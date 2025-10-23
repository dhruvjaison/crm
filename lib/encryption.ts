/**
 * Encryption Utilities
 * 
 * Encrypt/decrypt sensitive data like API keys and tokens
 */

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 64
const KEY_LENGTH = 32

/**
 * Get encryption key from environment
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }
  
  // Derive a proper key from the environment variable
  return crypto.scryptSync(key, 'salt', KEY_LENGTH)
}

/**
 * Encrypt a string
 */
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(IV_LENGTH)
    const salt = crypto.randomBytes(SALT_LENGTH)
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const tag = cipher.getAuthTag()
    
    // Combine salt + iv + encrypted + tag
    return [
      salt.toString('hex'),
      iv.toString('hex'),
      encrypted,
      tag.toString('hex'),
    ].join(':')
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt a string
 */
export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey()
    const parts = encryptedText.split(':')
    
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted text format')
    }
    
    const [, ivHex, encrypted, tagHex] = parts
    
    const iv = Buffer.from(ivHex, 'hex')
    const tag = Buffer.from(tagHex, 'hex')
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Hash a value (one-way, for API keys)
 */
export function hash(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex')
}

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Generate a secure API key
 */
export function generateApiKey(): string {
  // Format: crm_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  const prefix = 'crm_live_'
  const randomPart = crypto.randomBytes(32).toString('hex')
  return prefix + randomPart
}

/**
 * Validate encryption key on startup
 */
export function validateEncryptionKey(): boolean {
  try {
    const testString = 'test-encryption'
    const encrypted = encrypt(testString)
    const decrypted = decrypt(encrypted)
    return testString === decrypted
  } catch {
    return false
  }
}

