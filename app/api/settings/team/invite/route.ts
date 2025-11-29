import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can invite users
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'CLIENT_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, role } = body

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, email, and role are required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Check tenant user limit
    const tenant = await prisma.tenant.findUnique({
      where: { id: session.user.tenantId },
      include: { _count: { select: { users: true } } },
    })

    if (tenant && tenant._count.users >= tenant.maxUsers) {
      return NextResponse.json(
        { error: `User limit reached (${tenant.maxUsers} users)` },
        { status: 400 }
      )
    }

    // Create temporary password (user should change on first login)
    const tempPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        tenantId: session.user.tenantId,
        isActive: true,
      },
    })

    // TODO: Send invitation email with temporary password
    // For now, just return success

    return NextResponse.json({ 
      user,
      message: 'User invited successfully. Temporary password: ' + tempPassword 
    })
  } catch (error) {
    console.error('Error inviting user:', error)
    return NextResponse.json(
      { error: 'Failed to invite user' },
      { status: 500 }
    )
  }
}

