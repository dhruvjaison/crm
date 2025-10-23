import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { getUserByEmail, verifyPassword } from './lib/auth'
import { prisma } from './lib/db'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google Sign-In
      if (account?.provider === 'google' && profile?.email) {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                { email: profile.email },
                { googleId: account.providerAccountId },
              ],
            },
          })

          if (existingUser) {
            // Update existing user with Google ID if not set
            if (!existingUser.googleId) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  googleId: account.providerAccountId,
                  provider: 'google',
                  image: (profile.image as string) || null,
                },
              })
            }
          } else {
            // Create new user and tenant for Google sign-in
            const tenant = await prisma.tenant.create({
              data: {
                name: `${profile.name}'s Organization`,
                slug: `org-${Math.random().toString(36).substring(7)}`,
                planTier: 'starter',
                maxUsers: 5,
              },
            })

            // Create user
            await prisma.user.create({
              data: {
                email: profile.email,
                name: (profile.name as string) || profile.email.split('@')[0],
                googleId: account.providerAccountId,
                provider: 'google',
                providerAccountId: account.providerAccountId,
                image: (profile.image as string) || null,
                password: '', // No password for Google sign-in
                role: 'CLIENT_ADMIN',
                tenantId: tenant.id,
                emailVerified: new Date(),
              },
            })

            // Create default pipeline stages for new tenant
            const stages = [
              { name: 'New Lead', order: 1, probability: 10, color: '#gray' },
              { name: 'Qualified', order: 2, probability: 30, color: '#blue' },
              { name: 'Proposal', order: 3, probability: 50, color: '#yellow' },
              { name: 'Negotiation', order: 4, probability: 75, color: '#orange' },
              { name: 'Closed Won', order: 5, probability: 100, color: '#green' },
            ]

            for (const stageData of stages) {
              await prisma.pipelineStage.create({
                data: {
                  ...stageData,
                  tenantId: tenant.id,
                },
              })
            }
          }

          return true
        } catch (error) {
          console.error('Error in Google sign-in:', error)
          return false
        }
      }

      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.tenantId = user.tenantId
        token.tenantSlug = user.tenantSlug
      }
      
      // Handle session update
      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'SUPER_ADMIN' | 'CLIENT_ADMIN' | 'CLIENT_USER'
        session.user.tenantId = token.tenantId as string
        session.user.tenantSlug = token.tenantSlug as string
      }
      return session
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await getUserByEmail(credentials.email as string)

        if (!user || !user.isActive) {
          return null
        }

        const isValidPassword = await verifyPassword(
          credentials.password as string,
          user.password
        )

        if (!isValidPassword) {
          return null
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        // Log activity
        await prisma.activity.create({
          data: {
            type: 'USER_LOGIN',
            description: `${user.name || user.email} logged in`,
            userId: user.id,
            tenantId: user.tenantId,
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
          tenantSlug: user.tenant.slug,
          image: user.image,
        }
      },
    }),
  ],
} satisfies NextAuthConfig

