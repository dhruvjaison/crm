import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

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

  // Get sentiment counts
  const [positive, neutral, negative] = await Promise.all([
    prisma.call.count({
      where: {
        tenantId,
        sentiment: 'POSITIVE',
      },
    }),
    prisma.call.count({
      where: {
        tenantId,
        sentiment: 'NEUTRAL',
      },
    }),
    prisma.call.count({
      where: {
        tenantId,
        sentiment: 'NEGATIVE',
      },
    }),
  ])

  const data = [
    { name: 'POSITIVE', value: positive },
    { name: 'NEUTRAL', value: neutral },
    { name: 'NEGATIVE', value: negative },
  ]

  return NextResponse.json(data)
}

