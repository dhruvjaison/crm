/**
 * Calendar Sync API - Import from Google Calendar
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { importEventsFromGoogle, isCalendarConnected } from '@/lib/google-calendar'

/**
 * POST /api/calendar/sync - Sync events from Google Calendar
 */
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Check if user has connected Google Calendar
    const isConnected = await isCalendarConnected(session.user.id)

    if (!isConnected) {
      return NextResponse.json(
        { error: 'Google Calendar not connected' },
        { status: 400 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const daysBack = body.daysBack || 7
    const daysForward = body.daysForward || 30

    // Import events
    const result = await importEventsFromGoogle(
      session.user.id,
      session.user.tenantId,
      daysBack,
      daysForward
    )

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Failed to sync calendar:', error)
    return NextResponse.json(
      { error: 'Failed to sync calendar' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/calendar/sync/status - Check sync status
 */
export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const isConnected = await isCalendarConnected(session.user.id)

    return NextResponse.json({
      connected: isConnected,
    })
  } catch (error) {
    console.error('Failed to check sync status:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}

