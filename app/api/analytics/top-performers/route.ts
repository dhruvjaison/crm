import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { DealStatus } from '@prisma/client'

/**
 * GET /api/analytics/top-performers - Get top performing users by deals won
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all users with their deal stats
    const users = await prisma.user.findMany({
      where: {
        tenantId: session.user.tenantId,
      },
      include: {
        assignedDeals: {
          where: {
            status: DealStatus.WON,
          },
          select: {
            value: true,
          },
        },
        _count: {
          select: {
            assignedDeals: {
              where: {
                status: DealStatus.WON,
              },
            },
          },
        },
      },
    })

    const performers = users
      .map(user => ({
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        dealsWon: user._count.assignedDeals,
        totalRevenue: user.assignedDeals.reduce((sum, deal) => sum + (deal.value || 0), 0),
      }))
      .filter(p => p.dealsWon > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10) // Top 10

    return NextResponse.json({ data: performers })
  } catch (error) {
    console.error('[Analytics Top Performers] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top performers' },
      { status: 500 }
    )
  }
}

