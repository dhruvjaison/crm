/**
 * Two-Factor Authentication (2FA)
 * 
 * Time-based One-Time Password (TOTP) implementation
 */

import crypto from 'crypto'

/**
 * Generate a secret key for TOTP
 */
export function generateSecret(): string {
  // Generate 32 random bytes and encode as base32
  const buffer = crypto.randomBytes(32)
  return base32Encode(buffer)
}

/**
 * Generate a TOTP code from a secret
 */
export function generateTOTP(secret: string, window: number = 0): string {
  const time = Math.floor(Date.now() / 1000 / 30) + window
  const timeBuffer = Buffer.alloc(8)
  timeBuffer.writeBigInt64BE(BigInt(time))
  
  const key = base32Decode(secret)
  const hmac = crypto.createHmac('sha1', key)
  hmac.update(timeBuffer)
  const digest = hmac.digest()
  
  const offset = digest[digest.length - 1] & 0xf
  const code = (
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff)
  ) % 1000000
  
  return code.toString().padStart(6, '0')
}

/**
 * Verify a TOTP code
 */
export function verifyTOTP(secret: string, token: string, window: number = 1): boolean {
  // Check current time window and adjacent windows
  for (let i = -window; i <= window; i++) {
    const expected = generateTOTP(secret, i)
    if (expected === token) {
      return true
    }
  }
  return false
}

/**
 * Generate QR code data URL for authenticator apps
 */
export function generateQRCodeData(
  secret: string,
  accountName: string,
  issuer: string = 'CRM Pro'
): string {
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`
  return otpauthUrl
}

/**
 * Generate backup codes
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    // Format as XXXX-XXXX
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`)
  }
  return codes
}

/**
 * Hash backup codes for storage
 */
export function hashBackupCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
}

/**
 * Verify backup code
 */
export function verifyBackupCode(code: string, hashedCodes: string[]): boolean {
  const hashedInput = hashBackupCode(code)
  return hashedCodes.includes(hashedInput)
}

// Base32 encoding/decoding utilities
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32Encode(buffer: Buffer): string {
  let bits = 0
  let value = 0
  let output = ''
  
  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i]
    bits += 8
    
    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  
  if (bits > 0) {
    output += BASE32_CHARS[(value << (5 - bits)) & 31]
  }
  
  return output
}

function base32Decode(input: string): Buffer {
  const cleanInput = input.toUpperCase().replace(/[^A-Z2-7]/g, '')
  let bits = 0
  let value = 0
  const output: number[] = []
  
  for (let i = 0; i < cleanInput.length; i++) {
    const char = cleanInput[i]
    const index = BASE32_CHARS.indexOf(char)
    
    if (index === -1) continue
    
    value = (value << 5) | index
    bits += 5
    
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  
  return Buffer.from(output)
}

