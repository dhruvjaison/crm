import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

/**
 * GET /api/email-templates/[id] - Get single template
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const template = await prisma.emailTemplate.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('[Email Template GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/email-templates/[id] - Update template
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, subject, body: templateBody, variables } = body

    // Check template exists
    const existingTemplate = await prisma.emailTemplate.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    })

    if (!existingTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Update template
    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(subject && { subject: subject.trim() }),
        ...(templateBody && { body: templateBody.trim() }),
        ...(variables !== undefined && { variables }),
      },
    })

    return NextResponse.json({ template })
  } catch (error) {
    console.error('[Email Template PATCH] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/email-templates/[id] - Delete template
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check template exists
    const template = await prisma.emailTemplate.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Delete template
    await prisma.emailTemplate.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('[Email Template DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}

