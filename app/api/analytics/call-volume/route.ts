import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { format, subDays } from 'date-fns'

export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const tenantId = searchParams.get('tenantId') || session.user.tenantId

  // Super admin can view any tenant, others only their own
  if (session.user.role !== 'SUPER_ADMIN' && tenantId !== session.user.tenantId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Get calls for the last 7 days
  const days = 7
  const data = []

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    const [inbound, outbound] = await Promise.all([
      prisma.call.count({
        where: {
          tenantId,
          direction: 'INBOUND',
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      prisma.call.count({
        where: {
          tenantId,
          direction: 'OUTBOUND',
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
    ])

    data.push({
      date: format(date, 'MMM dd'),
      inbound,
      outbound,
    })
  }

  return NextResponse.json(data)
}

