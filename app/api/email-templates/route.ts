import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

/**
 * GET /api/email-templates - List all email templates
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templates = await prisma.emailTemplate.findMany({
      where: {
        tenantId: session.user.tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('[Email Templates GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/email-templates - Create new email template
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, subject, body: templateBody, variables } = body

    // Validation
    if (!name || !subject || !templateBody) {
      return NextResponse.json(
        { error: 'Name, subject, and body are required' },
        { status: 400 }
      )
    }

    // Create template
    const template = await prisma.emailTemplate.create({
      data: {
        name: name.trim(),
        subject: subject.trim(),
        body: templateBody.trim(),
        variables: variables || [],
        tenantId: session.user.tenantId,
      },
    })

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error('[Email Templates POST] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}

