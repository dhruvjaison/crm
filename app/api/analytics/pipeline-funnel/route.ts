import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { DealStatus } from '@prisma/client'

/**
 * GET /api/analytics/pipeline-funnel - Get deal counts by pipeline stage
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all pipeline stages
    const stages = await prisma.pipelineStage.findMany({
      where: {
        tenantId: session.user.tenantId,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        _count: {
          select: {
            deals: {
              where: {
                status: DealStatus.OPEN,
              },
            },
          },
        },
        deals: {
          where: {
            status: DealStatus.OPEN,
          },
          select: {
            value: true,
          },
        },
      },
    })

    const funnelData = stages.map(stage => ({
      stage: stage.name,
      count: stage._count.deals,
      value: stage.deals.reduce((sum, deal) => sum + (deal.value || 0), 0),
      probability: stage.probability,
      color: stage.color || '#3b82f6',
    }))

    return NextResponse.json({ data: funnelData })
  } catch (error) {
    console.error('[Analytics Pipeline Funnel] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pipeline data' },
      { status: 500 }
    )
  }
}

