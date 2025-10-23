/**
 * Google Calendar OAuth - Callback handler
 */

import { NextRequest, NextResponse } from 'next/server'
import { getTokensFromCode } from '@/lib/google-calendar'
import { prisma } from '@/lib/db'
import { logSecurityEvent } from '@/lib/audit-logger'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state') // userId
  const error = searchParams.get('error')

  // Handle OAuth error
  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard/calendar?error=${error}`, request.url)
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/dashboard/calendar?error=missing_params', request.url)
    )
  }

  try {
    // Exchange code for tokens
    const tokens = await getTokensFromCode(code)

    // Get user from state
    const user = await prisma.user.findUnique({
      where: { id: state },
    })

    if (!user) {
      return NextResponse.redirect(
        new URL('/dashboard/calendar?error=user_not_found', request.url)
      )
    }

    // Save tokens to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token || user.googleRefreshToken, // Keep existing if not provided
        googleCalendarId: 'primary',
      },
    })

    // Log the connection
    await logSecurityEvent({
      type: 'role_changed', // Using existing type - should add 'integration_connected'
      userId: user.id,
      tenantId: user.tenantId,
      description: 'Connected Google Calendar',
      metadata: {
        service: 'google_calendar',
      },
    })

    // Redirect to calendar page with success
    return NextResponse.redirect(
      new URL('/dashboard/calendar?success=connected', request.url)
    )
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/dashboard/calendar?error=token_exchange_failed', request.url)
    )
  }
}

