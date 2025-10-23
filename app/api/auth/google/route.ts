/**
 * Google Calendar OAuth - Initiate flow
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getAuthUrl } from '@/lib/google-calendar'

export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Store userId in session/cookie for callback
  const authUrl = getAuthUrl()
  
  // Add state parameter with user info
  const url = new URL(authUrl)
  url.searchParams.set('state', session.user.id)

  return NextResponse.redirect(url.toString())
}

