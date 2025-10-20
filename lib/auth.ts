import { prisma } from './db'
import { compare } from 'bcrypt'
import { UserRole } from '@prisma/client'

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      tenant: true,
    },
  })
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      tenant: true,
    },
  })
}

// Check if user has permission
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.SUPER_ADMIN]: 3,
    [UserRole.CLIENT_ADMIN]: 2,
    [UserRole.CLIENT_USER]: 1,
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Check if user is super admin
export function isSuperAdmin(userRole: UserRole): boolean {
  return userRole === UserRole.SUPER_ADMIN
}

// Check if user can access tenant
export function canAccessTenant(user: { role: UserRole; tenantId: string }, targetTenantId: string): boolean {
  // Super admins can access any tenant
  if (user.role === UserRole.SUPER_ADMIN) {
    return true
  }
  
  // Other users can only access their own tenant
  return user.tenantId === targetTenantId
}

