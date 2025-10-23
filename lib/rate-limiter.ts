/**
 * Rate Limiter
 * 
 * Simple in-memory rate limiting for login attempts and API calls
 * For production, consider using Redis or Vercel KV for distributed rate limiting
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt < now) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Check if rate limit is exceeded
   */
  check(
    identifier: string,
    maxAttempts: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now()
    const key = identifier
    const entry = this.store.get(key)

    // No entry or expired - allow and create new entry
    if (!entry || entry.resetAt < now) {
      this.store.set(key, {
        count: 1,
        resetAt: now + windowMs,
      })
      return {
        allowed: true,
        remaining: maxAttempts - 1,
        resetAt: now + windowMs,
      }
    }

    // Entry exists and not expired
    if (entry.count >= maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
      }
    }

    // Increment count
    entry.count++
    return {
      allowed: true,
      remaining: maxAttempts - entry.count,
      resetAt: entry.resetAt,
    }
  }

  /**
   * Reset rate limit for an identifier
   */
  reset(identifier: string): void {
    this.store.delete(identifier)
  }

  /**
   * Get current count for an identifier
   */
  getCount(identifier: string): number {
    const entry = this.store.get(identifier)
    if (!entry || entry.resetAt < Date.now()) {
      return 0
    }
    return entry.count
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.store.clear()
  }
}

// Singleton instance
const rateLimiter = new RateLimiter()

export { rateLimiter }

/**
 * Rate limit configuration
 */
export const RATE_LIMITS = {
  LOGIN: {
    maxAttempts: parseInt(process.env.MAX_FAILED_LOGIN_ATTEMPTS || '5'),
    windowMs: parseInt(process.env.ACCOUNT_LOCKOUT_DURATION_MINUTES || '15') * 60 * 1000,
  },
  API: {
    maxAttempts: parseInt(process.env.RATE_LIMIT_API || '100'),
    windowMs: 60 * 1000, // 1 minute
  },
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const

/**
 * Helper to check login rate limit
 */
export function checkLoginRateLimit(identifier: string) {
  return rateLimiter.check(
    `login:${identifier}`,
    RATE_LIMITS.LOGIN.maxAttempts,
    RATE_LIMITS.LOGIN.windowMs
  )
}

/**
 * Helper to check API rate limit
 */
export function checkApiRateLimit(identifier: string) {
  return rateLimiter.check(
    `api:${identifier}`,
    RATE_LIMITS.API.maxAttempts,
    RATE_LIMITS.API.windowMs
  )
}

/**
 * Helper to check password reset rate limit
 */
export function checkPasswordResetRateLimit(identifier: string) {
  return rateLimiter.check(
    `password-reset:${identifier}`,
    RATE_LIMITS.PASSWORD_RESET.maxAttempts,
    RATE_LIMITS.PASSWORD_RESET.windowMs
  )
}

/**
 * Reset login rate limit (call after successful login)
 */
export function resetLoginRateLimit(identifier: string) {
  rateLimiter.reset(`login:${identifier}`)
}

