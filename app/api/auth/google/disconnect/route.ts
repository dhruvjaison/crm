/**
 * Google Calendar - Disconnect
 */

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { disconnectCalendar } from '@/lib/google-calendar'
import { logSecurityEvent } from '@/lib/audit-logger'

export async function POST() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await disconnectCalendar(session.user.id)

    // Log the disconnection
    await logSecurityEvent({
      type: 'role_changed', // Using existing type - should add 'integration_disconnected'
      userId: session.user.id,
      tenantId: session.user.tenantId,
      description: 'Disconnected Google Calendar',
      metadata: {
        service: 'google_calendar',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to disconnect Google Calendar:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect calendar' },
      { status: 500 }
    )
  }
}

