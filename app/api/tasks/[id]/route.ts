import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { TaskStatus, TaskPriority } from '@prisma/client'

/**
 * GET /api/tasks/[id] - Get single task
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

    const task = await prisma.task.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
      include: {
        contact: true,
        deal: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error('[Task GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/tasks/[id] - Update task
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
      description,
      status,
      priority,
      dueDate,
      contactId,
      dealId,
    } = body

    // Check task exists and belongs to tenant
    const existingTask = await prisma.task.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    })

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Update task
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(status && { status: status as TaskStatus }),
        ...(priority && { priority: priority as TaskPriority }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(contactId !== undefined && { contactId: contactId || null }),
        ...(dealId !== undefined && { dealId: dealId || null }),
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
        type: 'TASK_CREATED', // Using TASK_CREATED as generic update
        description: `Task "${task.title}" was updated`,
        tenantId: session.user.tenantId,
        userId: session.user.id,
        ...(task.contactId && { contactId: task.contactId }),
        ...(task.dealId && { dealId: task.dealId }),
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error('[Task PATCH] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/tasks/[id] - Delete task
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

    // Check task exists and belongs to tenant
    const task = await prisma.task.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Delete task
    await prisma.task.delete({
      where: { id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'TASK_CREATED', // Using TASK_CREATED as generic
        description: `Task "${task.title}" was deleted`,
        tenantId: session.user.tenantId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('[Task DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}

