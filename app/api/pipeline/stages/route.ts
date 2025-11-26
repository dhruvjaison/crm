import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

/**
 * GET /api/pipeline/stages - Get all pipeline stages for tenant
 */
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stages = await prisma.pipelineStage.findMany({
      where: {
        tenantId: session.user.tenantId,
      },
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json({ stages })
  } catch (error) {
    console.error('[Pipeline Stages GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pipeline stages' },
      { status: 500 }
    )
  }
}

