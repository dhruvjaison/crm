'use client'

/**
 * Calendar Page - Full calendar view with Google Calendar integration
 */

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Calendar as CalendarIcon, Plus, RefreshCw, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import dynamic from 'next/dynamic'
import { EventInput } from '@fullcalendar/core'

// Dynamically import the entire calendar component to avoid SSR issues
const CalendarView = dynamic(() => import('@/components/calendar/calendar-view'), { 
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] items-center justify-center">
      <div className="text-center">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Loading calendar...</p>
      </div>
    </div>
  )
})

export default function CalendarPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [events, setEvents] = useState<EventInput[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Check Google Calendar connection status
  useEffect(() => {
    checkConnectionStatus()
  }, [])

  // Load calendar events
  useEffect(() => {
    loadEvents()
  }, [])

  const checkConnectionStatus = async () => {
    try {
      const res = await fetch('/api/calendar/sync/status')
      const data = await res.json()
      setIsConnected(data.connected)
    } catch (error) {
      console.error('Failed to check connection status:', error)
    }
  }

  const loadEvents = async () => {
    try {
      setLoading(true)
      // Load events for current month ±2 weeks
      const start = new Date()
      start.setDate(start.getDate() - 14)
      const end = new Date()
      end.setDate(end.getDate() + 60)

      const res = await fetch(
        `/api/calendar/events?start=${start.toISOString()}&end=${end.toISOString()}`
      )
      const data = await res.json()

      // Transform events for FullCalendar
      const transformedEvents = data.events.map((event: {
        id: string
        title: string
        startTime: string
        endTime: string
        allDay: boolean
        type: string
        status: string
        description?: string
        location?: string
        meetingLink?: string
        contact?: unknown
        deal?: unknown
        syncedToGoogle: boolean
      }) => ({
        id: event.id,
        title: event.title,
        start: event.startTime,
        end: event.endTime,
        allDay: event.allDay,
        backgroundColor: getEventColor(event.type),
        borderColor: getEventColor(event.type),
        extendedProps: {
          description: event.description,
          location: event.location,
          meetingLink: event.meetingLink,
          type: event.type,
          status: event.status,
          contact: event.contact,
          deal: event.deal,
          syncedToGoogle: event.syncedToGoogle,
        },
      }))

      setEvents(transformedEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
      toast({
        title: 'Error',
        description: 'Failed to load calendar events',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      MEETING: '#3b82f6',
      CALL: '#10b981',
      DEMO: '#8b5cf6',
      FOLLOWUP: '#f59e0b',
      PERSONAL: '#6b7280',
      OTHER: '#64748b',
    }
    return colors[type] || colors.OTHER
  }

  const handleConnectGoogle = () => {
    // Redirect to Google OAuth
    window.location.href = '/api/auth/google'
  }

  const handleSyncGoogle = async () => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect your Google Calendar first',
        variant: 'destructive',
      })
      return
    }

    try {
      setSyncing(true)
      const res = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daysBack: 7, daysForward: 30 }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Sync complete',
          description: `Imported ${data.imported} events, updated ${data.updated} events`,
        })
        loadEvents() // Reload events
      } else {
        throw new Error('Sync failed')
      }
    } catch (error) {
      console.error('Failed to sync calendar:', error)
      toast({
        title: 'Sync failed',
        description: 'Failed to sync with Google Calendar',
        variant: 'destructive',
      })
    } finally {
      setSyncing(false)
    }
  }

  const handleEventClick = (clickInfo: { event: unknown }) => {
    // TODO: Open event details dialog
    console.log('Event clicked:', clickInfo)
  }

  const handleDateSelect = (selectInfo: unknown) => {
    // TODO: Open create event dialog
    console.log('Date selected:', selectInfo)
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">
            Manage your schedule and sync with Google Calendar
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isConnected ? (
            <Button onClick={handleConnectGoogle} variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Connect Google Calendar
            </Button>
          ) : (
            <>
              <Badge variant="secondary" className="gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Connected
              </Badge>
              <Button
                onClick={handleSyncGoogle}
                variant="outline"
                disabled={syncing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync'}
              </Button>
            </>
          )}

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="flex h-[600px] items-center justify-center">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading calendar...</p>
            </div>
          </div>
        ) : (
          <CalendarView
            events={events}
            onEventClick={handleEventClick}
            onDateSelect={handleDateSelect}
          />
        )}
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium">Event Types:</span>
          {[
            { type: 'MEETING', label: 'Meeting', color: '#3b82f6' },
            { type: 'CALL', label: 'Call', color: '#10b981' },
            { type: 'DEMO', label: 'Demo', color: '#8b5cf6' },
            { type: 'FOLLOWUP', label: 'Follow-up', color: '#f59e0b' },
            { type: 'PERSONAL', label: 'Personal', color: '#6b7280' },
          ].map(({ type, label, color }) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

