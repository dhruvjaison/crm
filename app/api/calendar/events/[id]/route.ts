/**
 * Calendar Events API - Single event operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { syncEventToGoogle, deleteEvent as deleteGoogleEvent } from '@/lib/google-calendar'
import { EventType, EventStatus } from '@prisma/client'

/**
 * GET /api/calendar/events/[id] - Get single event
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const event = await prisma.calendarEvent.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Failed to fetch event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/calendar/events/[id] - Update event
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()

    // Check if event exists and user has access
    const existing = await prisma.calendarEvent.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const {
      title,
      description,
      location,
      meetingLink,
      startTime,
      endTime,
      allDay,
      timezone,
      type,
      status,
      contactId,
      dealId,
      attendees,
      reminders,
      syncToGoogle,
    } = body

    // Update event
    const event = await prisma.calendarEvent.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(location !== undefined && { location }),
        ...(meetingLink !== undefined && { meetingLink }),
        ...(startTime !== undefined && { startTime: new Date(startTime) }),
        ...(endTime !== undefined && { endTime: new Date(endTime) }),
        ...(allDay !== undefined && { allDay }),
        ...(timezone !== undefined && { timezone }),
        ...(type !== undefined && { type: type.toUpperCase() as EventType }),
        ...(status !== undefined && { status: status.toUpperCase() as EventStatus }),
        ...(contactId !== undefined && { contactId }),
        ...(dealId !== undefined && { dealId }),
        ...(attendees !== undefined && { attendees }),
        ...(reminders !== undefined && { reminders }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    // Sync to Google Calendar if requested
    if (syncToGoogle && event.googleEventId) {
      try {
        await syncEventToGoogle(event.id)
      } catch (error) {
        console.error('Failed to sync to Google Calendar:', error)
      }
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Failed to update event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/calendar/events/[id] - Delete event
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    // Check if event exists and user has access
    const event = await prisma.calendarEvent.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Delete from Google Calendar if synced
    if (event.googleEventId && event.syncedToGoogle) {
      try {
        await deleteGoogleEvent(event.userId, event.googleEventId)
      } catch (error) {
        console.error('Failed to delete from Google Calendar:', error)
        // Continue with local deletion
      }
    }

    // Delete from database
    await prisma.calendarEvent.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}

