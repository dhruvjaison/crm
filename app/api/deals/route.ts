import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { DealStatus } from '@prisma/client'

/**
 * GET /api/deals - List all deals for tenant
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const stageId = searchParams.get('stageId')

    interface WhereClause {
      tenantId: string
      stageId?: string
    }

    const where: WhereClause = {
      tenantId: session.user.tenantId,
    }

    // Filter by stage
    if (stageId && stageId !== 'all') {
      where.stageId = stageId
    }

    const deals = await prisma.deal.findMany({
      where,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            company: true,
          },
        },
        stage: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ deals })
  } catch (error) {
    console.error('[Deals GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/deals - Create new deal
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      value,
      contactId,
      stageId,
      expectedCloseDate,
    } = body

    // Validation
    if (!title || !value || !contactId || !stageId) {
      return NextResponse.json(
        { error: 'Title, value, contact, and stage are required' },
        { status: 400 }
      )
    }

    if (value <= 0) {
      return NextResponse.json(
        { error: 'Deal value must be greater than 0' },
        { status: 400 }
      )
    }

    // Verify contact belongs to tenant
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

    // Verify stage belongs to tenant
    const stage = await prisma.pipelineStage.findUnique({
      where: {
        id: stageId,
        tenantId: session.user.tenantId,
      },
    })

    if (!stage) {
      return NextResponse.json(
        { error: 'Pipeline stage not found' },
        { status: 404 }
      )
    }

    // Create deal
    const deal = await prisma.deal.create({
      data: {
        title: title.trim(),
        value: parseFloat(value),
        contactId,
        stageId,
        status: DealStatus.OPEN,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        tenantId: session.user.tenantId,
        ownerId: session.user.id,
      },
      include: {
        contact: true,
        stage: true,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'DEAL_CREATED',
        description: `Deal "${deal.title}" created for $${deal.value}`,
        tenantId: session.user.tenantId,
        dealId: deal.id,
        contactId: deal.contactId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ deal }, { status: 201 })
  } catch (error) {
    console.error('[Deals POST] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}

