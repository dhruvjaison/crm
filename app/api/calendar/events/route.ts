/**
 * Calendar Events API - List and Create
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { syncEventToGoogle } from '@/lib/google-calendar'
import { EventType, EventStatus, Prisma } from '@prisma/client'

/**
 * GET /api/calendar/events - List calendar events
 */
export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const type = searchParams.get('type')

  try {
    const where: Prisma.CalendarEventWhereInput = {
      tenantId: session.user.tenantId,
      status: { not: 'CANCELLED' },
    }

    // Filter by date range
    if (start && end) {
      where.startTime = {
        gte: new Date(start),
        lte: new Date(end),
      }
    }

    // Filter by type
    if (type && type !== 'all') {
      where.type = type.toUpperCase() as EventType
    }

    const events = await prisma.calendarEvent.findMany({
      where,
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
      orderBy: {
        startTime: 'asc',
      },
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Failed to fetch calendar events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/calendar/events - Create calendar event
 */
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

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
      contactId,
      dealId,
      attendees,
      reminders,
      syncToGoogle,
    } = body

    // Validate required fields
    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create event in database
    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description,
        location,
        meetingLink,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        allDay: allDay || false,
        timezone: timezone || 'America/New_York',
        type: (type?.toUpperCase() as EventType) || 'MEETING',
        status: 'CONFIRMED' as EventStatus,
        userId: session.user.id,
        tenantId: session.user.tenantId,
        contactId,
        dealId,
        attendees: attendees || undefined,
        reminders: reminders || undefined,
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
    if (syncToGoogle) {
      try {
        await syncEventToGoogle(event.id)
      } catch (error) {
        console.error('Failed to sync to Google Calendar:', error)
        // Don't fail the request, event is created locally
      }
    }

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'NOTE',
        description: `Calendar event "${title}" created`,
        userId: session.user.id,
        tenantId: session.user.tenantId,
        contactId,
      },
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error('Failed to create calendar event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

