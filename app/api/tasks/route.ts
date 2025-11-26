import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { TaskStatus, TaskPriority } from '@prisma/client'

/**
 * GET /api/tasks - List all tasks for tenant
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') as TaskStatus | null

    interface WhereClause {
      tenantId: string
      status?: TaskStatus
    }

    const where: WhereClause = {
      tenantId: session.user.tenantId,
    }

    // Filter by status
    if (status) {
      where.status = status
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            value: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('[Tasks GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tasks - Create new task
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
      description,
      status,
      priority,
      dueDate,
      contactId,
      dealId,
    } = body

    // Validation
    if (!title) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || TaskStatus.TODO,
        priority: priority || TaskPriority.MEDIUM,
        dueDate: dueDate ? new Date(dueDate) : null,
        contactId: contactId || null,
        dealId: dealId || null,
        tenantId: session.user.tenantId,
        assignedToId: session.user.id, // Assign to creator by default
        createdById: session.user.id,
      },
      include: {
        contact: true,
        deal: true,
        assignedTo: true,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'TASK_CREATED',
        description: `Task "${task.title}" was created`,
        tenantId: session.user.tenantId,
        userId: session.user.id,
        ...(task.contactId && { contactId: task.contactId }),
        ...(task.dealId && { dealId: task.dealId }),
      },
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('[Tasks POST] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

