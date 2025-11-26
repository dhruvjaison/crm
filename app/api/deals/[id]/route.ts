import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { DealStatus } from '@prisma/client'

/**
 * GET /api/deals/[id] - Get single deal
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

    const deal = await prisma.deal.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
      include: {
        contact: true,
        stage: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    return NextResponse.json({ deal })
  } catch (error) {
    console.error('[Deal GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/deals/[id] - Update deal
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
    const {
      title,
      value,
      contactId,
      stageId,
      status,
      expectedCloseDate,
    } = body

    // Check deal exists and belongs to tenant
    const existingDeal = await prisma.deal.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
      include: {
        stage: true,
      },
    })

    if (!existingDeal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    // If contact is being changed, verify it belongs to tenant
    if (contactId && contactId !== existingDeal.contactId) {
      const contact = await prisma.contact.findUnique({
        where: {
          id: contactId,
          tenantId: session.user.tenantId,
        },
      })

      if (!contact) {
        return NextResponse.json(
          { error: 'Contact not found' },
          { status: 404 }
        )
      }
    }

    // If stage is being changed, verify it belongs to tenant
    let stageChanged = false
    let newStage = null
    if (stageId && stageId !== existingDeal.stageId) {
      newStage = await prisma.pipelineStage.findUnique({
        where: {
          id: stageId,
          tenantId: session.user.tenantId,
        },
      })

      if (!newStage) {
        return NextResponse.json(
          { error: 'Pipeline stage not found' },
          { status: 404 }
        )
      }
      stageChanged = true
    }

    // Update deal
    const deal = await prisma.deal.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(value !== undefined && { value: parseFloat(value) }),
        ...(contactId && { contactId }),
        ...(stageId && { stageId }),
        ...(status && { status: status as DealStatus }),
        ...(expectedCloseDate !== undefined && {
          expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        }),
      },
      include: {
        contact: true,
        stage: true,
      },
    })

    // Log activity
    if (stageChanged && newStage) {
      await prisma.activity.create({
        data: {
          type: 'DEAL_STAGE_CHANGED',
          description: `Deal "${deal.title}" moved from ${existingDeal.stage.name} to ${newStage.name}`,
          tenantId: session.user.tenantId,
          dealId: deal.id,
          contactId: deal.contactId,
          userId: session.user.id,
        },
      })
    } else {
      await prisma.activity.create({
        data: {
          type: 'DEAL_CREATED', // Using DEAL_CREATED as generic update
          description: `Deal "${deal.title}" was updated`,
          tenantId: session.user.tenantId,
          dealId: deal.id,
          contactId: deal.contactId,
          userId: session.user.id,
        },
      })
    }

    return NextResponse.json({ deal })
  } catch (error) {
    console.error('[Deal PATCH] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/deals/[id] - Delete deal
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

    // Check deal exists and belongs to tenant
    const deal = await prisma.deal.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    })

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    // Delete deal
    await prisma.deal.delete({
      where: { id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'DEAL_LOST',
        description: `Deal "${deal.title}" was deleted`,
        tenantId: session.user.tenantId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: 'Deal deleted successfully' })
  } catch (error) {
    console.error('[Deal DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    )
  }
}

