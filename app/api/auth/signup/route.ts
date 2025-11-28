import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, companyName, industry, companySize, primaryGoal } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create tenant (company)
    const tenant = await prisma.tenant.create({
      data: {
        name: companyName || `${name}'s Company`,
        slug: (companyName || name).toLowerCase().replace(/[^a-z0-9]/g, '-'),
        settings: {
          industry: industry || 'other',
          companySize: companySize || '1-10',
          primaryGoal: primaryGoal || 'increase-sales',
        },
      },
    })

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'CLIENT_ADMIN', // First user is admin of their tenant
        tenantId: tenant.id,
      },
    })

    // Create default pipeline stages
    const stages = [
      { name: 'Discovery', order: 1, probability: 10, color: '#3b82f6' },
      { name: 'Qualification', order: 2, probability: 25, color: '#8b5cf6' },
      { name: 'Proposal', order: 3, probability: 50, color: '#f59e0b' },
      { name: 'Negotiation', order: 4, probability: 75, color: '#10b981' },
      { name: 'Closed Won', order: 5, probability: 100, color: '#22c55e' },
    ]

    await Promise.all(
      stages.map(stage =>
        prisma.pipelineStage.create({
          data: {
            ...stage,
            tenantId: tenant.id,
          },
        })
      )
    )

    // Create welcome email template
    await prisma.emailTemplate.create({
      data: {
        name: 'Welcome Email',
        subject: 'Welcome to {{company}}!',
        body: `Hi {{firstName}},\n\nWelcome to {{company}}! We're excited to have you on board.\n\nBest regards,\nThe Team`,
        variables: ['firstName', 'company'],
        tenantId: tenant.id,
      },
    })

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Signup] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}

