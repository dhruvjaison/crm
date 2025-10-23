/**
 * Audit Logger
 * 
 * Log security-related events for compliance and monitoring
 */

import { prisma } from './db'

export type SecurityEventType =
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'password_changed'
  | 'password_reset_requested'
  | 'password_reset_completed'
  | '2fa_enabled'
  | '2fa_disabled'
  | '2fa_verified'
  | '2fa_failed'
  | 'account_locked'
  | 'account_unlocked'
  | 'api_key_created'
  | 'api_key_deleted'
  | 'suspicious_activity'
  | 'session_expired'
  | 'email_changed'
  | 'role_changed'
  | 'data_export'

interface AuditLogOptions {
  type: SecurityEventType
  userId?: string
  tenantId: string
  description?: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

/**
 * Log a security event
 */
export async function logSecurityEvent(options: AuditLogOptions): Promise<void> {
  try {
    await prisma.securityEvent.create({
      data: {
        type: options.type,
        description: options.description,
        userId: options.userId,
        tenantId: options.tenantId,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        metadata: options.metadata ? JSON.parse(JSON.stringify(options.metadata)) : undefined,
      },
    })
  } catch (error) {
    // Don't throw - audit logging should never break the app
    console.error('Failed to log security event:', error)
  }
}

/**
 * Get IP address from request headers
 */
export function getIpAddress(request: Request): string | undefined {
  // Check common headers used by proxies/CDNs
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  // Vercel specific
  const vercelIp = request.headers.get('x-vercel-forwarded-for')
  if (vercelIp) {
    return vercelIp
  }
  
  return undefined
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: Request): string | undefined {
  return request.headers.get('user-agent') || undefined
}

/**
 * Log login attempt
 */
export async function logLoginAttempt(
  email: string,
  success: boolean,
  tenantId: string,
  userId?: string,
  request?: Request
): Promise<void> {
  await logSecurityEvent({
    type: success ? 'login_success' : 'login_failed',
    userId,
    tenantId,
    description: `Login ${success ? 'successful' : 'failed'} for ${email}`,
    ipAddress: request ? getIpAddress(request) : undefined,
    userAgent: request ? getUserAgent(request) : undefined,
    metadata: {
      email,
      success,
    },
  })
}

/**
 * Log password change
 */
export async function logPasswordChange(
  userId: string,
  tenantId: string,
  request?: Request
): Promise<void> {
  await logSecurityEvent({
    type: 'password_changed',
    userId,
    tenantId,
    description: 'Password changed successfully',
    ipAddress: request ? getIpAddress(request) : undefined,
    userAgent: request ? getUserAgent(request) : undefined,
  })
}

/**
 * Log 2FA event
 */
export async function log2FAEvent(
  type: '2fa_enabled' | '2fa_disabled' | '2fa_verified' | '2fa_failed',
  userId: string,
  tenantId: string,
  request?: Request
): Promise<void> {
  await logSecurityEvent({
    type,
    userId,
    tenantId,
    description: `2FA ${type.replace('2fa_', '')}`,
    ipAddress: request ? getIpAddress(request) : undefined,
    userAgent: request ? getUserAgent(request) : undefined,
  })
}

/**
 * Log account lockout
 */
export async function logAccountLocked(
  userId: string,
  tenantId: string,
  reason: string,
  request?: Request
): Promise<void> {
  await logSecurityEvent({
    type: 'account_locked',
    userId,
    tenantId,
    description: `Account locked: ${reason}`,
    ipAddress: request ? getIpAddress(request) : undefined,
    userAgent: request ? getUserAgent(request) : undefined,
    metadata: {
      reason,
    },
  })
}

/**
 * Log suspicious activity
 */
export async function logSuspiciousActivity(
  description: string,
  tenantId: string,
  userId?: string,
  request?: Request,
  metadata?: Record<string, unknown>
): Promise<void> {
  await logSecurityEvent({
    type: 'suspicious_activity',
    userId,
    tenantId,
    description,
    ipAddress: request ? getIpAddress(request) : undefined,
    userAgent: request ? getUserAgent(request) : undefined,
    metadata,
  })
}

/**
 * Detect suspicious login patterns
 */
export async function detectSuspiciousLogin(
  userId: string,
  ipAddress?: string
): Promise<boolean> {
  if (!ipAddress) return false
  
  // Check if user has logged in from this IP before
  const recentLogins = await prisma.securityEvent.findMany({
    where: {
      userId,
      type: 'login_success',
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
    select: {
      ipAddress: true,
    },
  })
  
  const knownIps = recentLogins.map(l => l.ipAddress).filter(Boolean)
  const isNewIp = !knownIps.includes(ipAddress)
  
  // Check for rapid login attempts from different IPs
  const recentFailures = await prisma.securityEvent.findMany({
    where: {
      userId,
      type: 'login_failed',
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    },
  })
  
  const hasManyFailures = recentFailures.length >= 3
  
  return isNewIp || hasManyFailures
}

