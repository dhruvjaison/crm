import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { DealStatus } from '@prisma/client'

/**
 * GET /api/analytics/overview - Get overview analytics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build date filter
    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    } : {}

    // Get all deals for calculations
    const deals = await prisma.deal.findMany({
      where: {
        tenantId: session.user.tenantId,
        ...dateFilter,
      },
      include: {
        contact: true,
        stage: true,
      },
    })

    // Get all contacts
    const contacts = await prisma.contact.findMany({
      where: {
        tenantId: session.user.tenantId,
        ...dateFilter,
      },
    })

    // Calculate metrics
    const totalDeals = deals.length
    const wonDeals = deals.filter(d => d.status === DealStatus.WON)
    const lostDeals = deals.filter(d => d.status === DealStatus.LOST)
    const openDeals = deals.filter(d => d.status === DealStatus.OPEN)

    const totalRevenue = wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
    const averageDealSize = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0
    const winRate = totalDeals > 0 ? (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100 : 0
    const conversionRate = contacts.length > 0 ? (wonDeals.length / contacts.length) * 100 : 0

    // Pipeline value (open deals)
    const pipelineValue = openDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)

    // Get previous period for comparison
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const currentPeriodDeals = deals.filter(d => d.createdAt >= thirtyDaysAgo)
    const previousPeriodDeals = deals.filter(d => 
      d.createdAt >= sixtyDaysAgo && d.createdAt < thirtyDaysAgo
    )

    const currentRevenue = currentPeriodDeals
      .filter(d => d.status === DealStatus.WON)
      .reduce((sum, deal) => sum + (deal.value || 0), 0)
    
    const previousRevenue = previousPeriodDeals
      .filter(d => d.status === DealStatus.WON)
      .reduce((sum, deal) => sum + (deal.value || 0), 0)

    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0

    return NextResponse.json({
      overview: {
        totalRevenue,
        revenueGrowth,
        totalDeals,
        wonDeals: wonDeals.length,
        lostDeals: lostDeals.length,
        openDeals: openDeals.length,
        averageDealSize,
        winRate,
        conversionRate,
        pipelineValue,
        totalContacts: contacts.length,
      },
    })
  } catch (error) {
    console.error('[Analytics Overview] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

