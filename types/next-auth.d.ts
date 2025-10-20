import { UserRole } from '@prisma/client'
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    role: UserRole
    tenantId: string
    tenantSlug: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: 'SUPER_ADMIN' | 'CLIENT_ADMIN' | 'CLIENT_USER'
      tenantId: string
      tenantSlug: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'SUPER_ADMIN' | 'CLIENT_ADMIN' | 'CLIENT_USER'
    tenantId: string
    tenantSlug: string
  }
}

