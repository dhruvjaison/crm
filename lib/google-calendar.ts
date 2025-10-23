/**
 * Google Calendar API Integration
 * 
 * Handles OAuth authentication and calendar operations
 */

import { google } from 'googleapis'
import { prisma } from './db'

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'

/**
 * Create OAuth2 client
 */
export function createOAuth2Client() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  )
}

/**
 * Generate OAuth URL for user to authorize
 */
export function getAuthUrl(): string {
  const oauth2Client = createOAuth2Client()
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent', // Force to get refresh token
  })
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(code: string) {
  const oauth2Client = createOAuth2Client()
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

/**
 * Get authenticated calendar client for a user
 */
export async function getCalendarClient(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
    },
  })

  if (!user?.googleAccessToken) {
    throw new Error('User has not connected Google Calendar')
  }

  const oauth2Client = createOAuth2Client()
  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  })

  // Refresh token if expired
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.refresh_token) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
        },
      })
    } else if (tokens.access_token) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: tokens.access_token,
        },
      })
    }
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

/**
 * Types for calendar events
 */
export interface GoogleCalendarEvent {
  id?: string
  summary: string
  description?: string
  location?: string
  start: {
    dateTime: string
    timeZone?: string
  }
  end: {
    dateTime: string
    timeZone?: string
  }
  attendees?: Array<{
    email: string
    displayName?: string
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted'
  }>
  conferenceData?: {
    createRequest?: {
      requestId: string
      conferenceSolutionKey: {
        type: 'hangoutsMeet'
      }
    }
  }
  reminders?: {
    useDefault: boolean
    overrides?: Array<{
      method: 'email' | 'popup'
      minutes: number
    }>
  }
}

/**
 * List calendar events
 */
export async function listEvents(userId: string, options: {
  timeMin?: Date
  timeMax?: Date
  maxResults?: number
  singleEvents?: boolean
  orderBy?: 'startTime' | 'updated'
} = {}) {
  const calendar = await getCalendarClient(userId)
  
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: (options.timeMin || new Date()).toISOString(),
    timeMax: options.timeMax?.toISOString(),
    maxResults: options.maxResults || 250,
    singleEvents: options.singleEvents !== false,
    orderBy: options.orderBy || 'startTime',
  })

  return response.data.items || []
}

/**
 * Get a specific event
 */
export async function getEvent(userId: string, eventId: string) {
  const calendar = await getCalendarClient(userId)
  
  const response = await calendar.events.get({
    calendarId: 'primary',
    eventId,
  })

  return response.data
}

/**
 * Create a calendar event
 */
export async function createEvent(userId: string, event: GoogleCalendarEvent) {
  const calendar = await getCalendarClient(userId)
  
  const response = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: event.conferenceData ? 1 : 0,
    requestBody: event,
  })

  return response.data
}

/**
 * Update a calendar event
 */
export async function updateEvent(userId: string, eventId: string, event: Partial<GoogleCalendarEvent>) {
  const calendar = await getCalendarClient(userId)
  
  const response = await calendar.events.patch({
    calendarId: 'primary',
    eventId,
    requestBody: event,
  })

  return response.data
}

/**
 * Delete a calendar event
 */
export async function deleteEvent(userId: string, eventId: string) {
  const calendar = await getCalendarClient(userId)
  
  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
  })
}

/**
 * Get user's free/busy information
 */
export async function getFreeBusy(userId: string, timeMin: Date, timeMax: Date, calendars: string[] = ['primary']) {
  const calendar = await getCalendarClient(userId)
  
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: calendars.map(id => ({ id })),
    },
  })

  return response.data
}

/**
 * Check if user has connected Google Calendar
 */
export async function isCalendarConnected(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { googleAccessToken: true },
  })

  return !!user?.googleAccessToken
}

/**
 * Disconnect Google Calendar
 */
export async function disconnectCalendar(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      googleAccessToken: null,
      googleRefreshToken: null,
      googleCalendarId: null,
    },
  })
}

/**
 * Sync CRM event to Google Calendar
 */
export async function syncEventToGoogle(crmEventId: string) {
  const crmEvent = await prisma.calendarEvent.findUnique({
    where: { id: crmEventId },
    include: {
      contact: true,
      user: true,
    },
  })

  if (!crmEvent) {
    throw new Error('Event not found')
  }

  // Check if user has Google Calendar connected
  if (!await isCalendarConnected(crmEvent.userId)) {
    return // Skip sync if not connected
  }

  const googleEvent: GoogleCalendarEvent = {
    summary: crmEvent.title,
    description: crmEvent.description || undefined,
    location: crmEvent.location || undefined,
    start: {
      dateTime: crmEvent.startTime.toISOString(),
      timeZone: crmEvent.timezone,
    },
    end: {
      dateTime: crmEvent.endTime.toISOString(),
      timeZone: crmEvent.timezone,
    },
  }

  // Add attendees if present
  if (crmEvent.attendees) {
    const attendees = crmEvent.attendees as Array<{ email: string; name?: string }>
    googleEvent.attendees = attendees.map(a => ({
      email: a.email,
      displayName: a.name,
    }))
  }

  // Add reminders if present
  if (crmEvent.reminders) {
    const reminders = crmEvent.reminders as { useDefault: boolean; overrides?: Array<{ method: 'email' | 'popup'; minutes: number }> }
    googleEvent.reminders = reminders
  }

  try {
    if (crmEvent.googleEventId) {
      // Update existing event
      const updated = await updateEvent(crmEvent.userId, crmEvent.googleEventId, googleEvent)
      
      await prisma.calendarEvent.update({
        where: { id: crmEventId },
        data: {
          syncedToGoogle: true,
          lastSyncedAt: new Date(),
        },
      })

      return updated
    } else {
      // Create new event
      const created = await createEvent(crmEvent.userId, googleEvent)
      
      await prisma.calendarEvent.update({
        where: { id: crmEventId },
        data: {
          googleEventId: created.id,
          syncedToGoogle: true,
          lastSyncedAt: new Date(),
        },
      })

      return created
    }
  } catch (error) {
    console.error('Failed to sync event to Google:', error)
    throw error
  }
}

/**
 * Import Google Calendar events to CRM
 */
export async function importEventsFromGoogle(userId: string, tenantId: string, daysBack: number = 7, daysForward: number = 30) {
  const timeMin = new Date()
  timeMin.setDate(timeMin.getDate() - daysBack)
  
  const timeMax = new Date()
  timeMax.setDate(timeMax.getDate() + daysForward)

  const googleEvents = await listEvents(userId, { timeMin, timeMax })
  
  let imported = 0
  let updated = 0

  for (const gEvent of googleEvents) {
    if (!gEvent.id || !gEvent.summary) continue

    const startTime = gEvent.start?.dateTime || gEvent.start?.date
    const endTime = gEvent.end?.dateTime || gEvent.end?.date
    
    if (!startTime || !endTime) continue

    // Check if event already exists
    const existing = await prisma.calendarEvent.findFirst({
      where: {
        googleEventId: gEvent.id,
        userId,
      },
    })

    const eventData = {
      title: gEvent.summary,
      description: gEvent.description || null,
      location: gEvent.location || null,
      meetingLink: gEvent.hangoutLink || null,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      allDay: !!gEvent.start?.date, // If date (not dateTime), it's all day
      timezone: gEvent.start?.timeZone || 'America/New_York',
      type: 'MEETING' as const,
      status: gEvent.status === 'cancelled' ? 'CANCELLED' as const : 'CONFIRMED' as const,
      googleEventId: gEvent.id,
      syncedToGoogle: true,
      lastSyncedAt: new Date(),
      userId,
      tenantId,
      attendees: gEvent.attendees ? gEvent.attendees.map(a => ({
        email: a.email,
        name: a.displayName,
        status: a.responseStatus,
      })) : undefined,
    }

    if (existing) {
      await prisma.calendarEvent.update({
        where: { id: existing.id },
        data: eventData,
      })
      updated++
    } else {
      await prisma.calendarEvent.create({
        data: eventData,
      })
      imported++
    }
  }

  return { imported, updated, total: googleEvents.length }
}

