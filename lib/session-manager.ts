/**
 * Session Manager
 * 
 * Manage user sessions with timeout and multi-device support
 */

import { prisma } from './db'

export interface Session {
  id: string
  createdAt: number
  lastActivityAt: number
  ipAddress?: string
  userAgent?: string
}

/**
 * Session timeout configuration
 */
export const SESSION_CONFIG = {
  idleTimeout: parseInt(process.env.SESSION_TIMEOUT_MINUTES || '30') * 60 * 1000, // 30 minutes
  maxDuration: parseInt(process.env.MAX_SESSION_DURATION_HOURS || '8') * 60 * 60 * 1000, // 8 hours
}

/**
 * Create a new session for a user
 */
export async function createSession(
  userId: string,
  sessionId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeSessions: true },
  })
  
  if (!user) return
  
  const sessions: Session[] = Array.isArray(user.activeSessions) 
    ? (user.activeSessions as unknown as Session[])
    : []
  
  const newSession: Session = {
    id: sessionId,
    createdAt: Date.now(),
    lastActivityAt: Date.now(),
    ipAddress,
    userAgent,
  }
  
  // Add new session
  sessions.push(newSession)
  
  // Clean up old sessions
  const validSessions = sessions.filter(s => !isSessionExpired(s))
  
  await prisma.user.update({
    where: { id: userId },
    data: {
      activeSessions: validSessions as never,
      lastActivityAt: new Date(),
    },
  })
}

/**
 * Update session activity timestamp
 */
export async function updateSessionActivity(
  userId: string,
  sessionId: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeSessions: true },
  })
  
  if (!user) return
  
  const sessions: Session[] = Array.isArray(user.activeSessions)
    ? (user.activeSessions as unknown as Session[])
    : []
  
  const session = sessions.find(s => s.id === sessionId)
  if (session) {
    session.lastActivityAt = Date.now()
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        activeSessions: sessions as never,
        lastActivityAt: new Date(),
      },
    })
  }
}

/**
 * Check if a session is valid
 */
export async function isSessionValid(
  userId: string,
  sessionId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeSessions: true, isActive: true },
  })
  
  if (!user || !user.isActive) return false
  
  const sessions: Session[] = Array.isArray(user.activeSessions)
    ? (user.activeSessions as unknown as Session[])
    : []
  
  const session = sessions.find(s => s.id === sessionId)
  if (!session) return false
  
  return !isSessionExpired(session)
}

/**
 * Check if a session is expired
 */
function isSessionExpired(session: Session): boolean {
  const now = Date.now()
  const age = now - session.createdAt
  const idle = now - session.lastActivityAt
  
  // Check max duration
  if (age > SESSION_CONFIG.maxDuration) {
    return true
  }
  
  // Check idle timeout
  if (idle > SESSION_CONFIG.idleTimeout) {
    return true
  }
  
  return false
}

/**
 * Revoke a specific session
 */
export async function revokeSession(
  userId: string,
  sessionId: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeSessions: true },
  })
  
  if (!user) return
  
  const sessions: Session[] = Array.isArray(user.activeSessions)
    ? (user.activeSessions as unknown as Session[])
    : []
  
  const filteredSessions = sessions.filter(s => s.id !== sessionId)
  
  await prisma.user.update({
    where: { id: userId },
    data: {
      activeSessions: filteredSessions as never,
    },
  })
}

/**
 * Revoke all sessions for a user (force logout everywhere)
 */
export async function revokeAllSessions(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      activeSessions: [] as never,
    },
  })
}

/**
 * Get all active sessions for a user
 */
export async function getActiveSessions(userId: string): Promise<Session[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeSessions: true },
  })
  
  if (!user) return []
  
  const sessions: Session[] = Array.isArray(user.activeSessions)
    ? (user.activeSessions as unknown as Session[])
    : []
  
  // Return only non-expired sessions
  return sessions.filter(s => !isSessionExpired(s))
}

/**
 * Clean up expired sessions for all users (run periodically)
 */
export async function cleanupExpiredSessions(): Promise<void> {
  // Get all users and filter in memory (JSON filtering in Prisma is tricky)
  const users = await prisma.user.findMany({
    select: {
      id: true,
      activeSessions: true,
    },
  })
  
  for (const user of users) {
    // Skip if no active sessions
    if (!user.activeSessions) continue
    
    const sessions: Session[] = Array.isArray(user.activeSessions)
      ? (user.activeSessions as unknown as Session[])
      : []
    
    // Skip if sessions array is empty
    if (sessions.length === 0) continue
    
    const validSessions = sessions.filter(s => !isSessionExpired(s))
    
    // Only update if we're removing expired sessions
    if (validSessions.length !== sessions.length) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          activeSessions: validSessions as never,
        },
      })
    }
  }
}

