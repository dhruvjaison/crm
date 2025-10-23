/**
 * Password Policy and Validation
 * 
 * Enforces strong password requirements:
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */

export const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
} as const

export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  score: number // 0-100
}

/**
 * Validate password against policy requirements
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  let score = 0

  // Check length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`)
  } else {
    score += 25
    if (password.length >= 16) score += 10
    if (password.length >= 20) score += 10
  }

  // Check uppercase
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else {
    score += 15
  }

  // Check lowercase
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else {
    score += 15
  }

  // Check number
  if (PASSWORD_REQUIREMENTS.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  } else {
    score += 15
  }

  // Check special character
  if (PASSWORD_REQUIREMENTS.requireSpecial && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)')
  } else {
    score += 15
  }

  // Bonus points for variety
  const uniqueChars = new Set(password.split('')).size
  if (uniqueChars > 10) score += 5

  // Determine strength
  let strength: PasswordValidationResult['strength']
  if (score < 50) {
    strength = 'weak'
  } else if (score < 70) {
    strength = 'medium'
  } else if (score < 90) {
    strength = 'strong'
  } else {
    strength = 'very-strong'
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score: Math.min(score, 100),
  }
}

/**
 * Check if password is commonly used (basic check)
 */
const COMMON_PASSWORDS = [
  'password', 'password123', '123456', '12345678', 'qwerty',
  'abc123', 'monkey', '1234567', 'letmein', 'trustno1',
  'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'shadow', '123123', '654321',
  'superman', 'qazwsx', 'michael', 'football', 'password1',
]

export function isCommonPassword(password: string): boolean {
  const lowerPassword = password.toLowerCase()
  return COMMON_PASSWORDS.some(common => lowerPassword.includes(common))
}

/**
 * Check if password contains personal information
 */
export function containsPersonalInfo(
  password: string, 
  userData: { email?: string; name?: string; phone?: string }
): boolean {
  const lowerPassword = password.toLowerCase()
  
  if (userData.email) {
    const emailParts = userData.email.toLowerCase().split('@')[0].split(/[._-]/)
    if (emailParts.some(part => part.length > 2 && lowerPassword.includes(part))) {
      return true
    }
  }
  
  if (userData.name) {
    const nameParts = userData.name.toLowerCase().split(' ')
    if (nameParts.some(part => part.length > 2 && lowerPassword.includes(part))) {
      return true
    }
  }
  
  if (userData.phone) {
    const phoneDigits = userData.phone.replace(/\D/g, '')
    if (phoneDigits.length >= 4 && lowerPassword.includes(phoneDigits.slice(-4))) {
      return true
    }
  }
  
  return false
}

/**
 * Generate a strong random password
 */
export function generateSecurePassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lowercase = 'abcdefghijkmnpqrstuvwxyz'
  const numbers = '23456789'
  const special = '!@#$%^&*-_=+'
  
  const all = uppercase + lowercase + numbers + special
  
  let password = ''
  
  // Ensure at least one of each required type
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Check if password needs to be changed based on age
 */
export function shouldForcePasswordChange(passwordChangedAt: Date | null, maxAgeDays: number = 90): boolean {
  if (!passwordChangedAt) return true // Never changed
  
  const daysSinceChange = (Date.now() - passwordChangedAt.getTime()) / (1000 * 60 * 60 * 24)
  return daysSinceChange > maxAgeDays
}

