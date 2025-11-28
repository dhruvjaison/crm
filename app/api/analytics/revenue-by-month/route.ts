import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { DealStatus } from '@prisma/client'

/**
 * GET /api/analytics/revenue-by-month - Get revenue by month for last 12 months
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get deals from last 12 months
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const deals = await prisma.deal.findMany({
      where: {
        tenantId: session.user.tenantId,
        status: DealStatus.WON,
        closedAt: {
          gte: twelveMonthsAgo,
        },
      },
      select: {
        value: true,
        closedAt: true,
      },
    })

    // Group by month
    const revenueByMonth: { [key: string]: number } = {}
    
    deals.forEach(deal => {
      if (deal.closedAt && deal.value) {
        const monthKey = deal.closedAt.toISOString().substring(0, 7) // YYYY-MM
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + deal.value
      }
    })

    // Generate last 12 months array
    const months = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toISOString().substring(0, 7)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      months.push({
        month: monthName,
        revenue: revenueByMonth[monthKey] || 0,
      })
    }

    return NextResponse.json({ data: months })
  } catch (error) {
    console.error('[Analytics Revenue by Month] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    )
  }
}

