'use client'

/**
 * Calendar View Component - FullCalendar wrapper (client-side only)
 */

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/core'

interface CalendarViewProps {
  events: EventInput[]
  onEventClick: (clickInfo: { event: unknown }) => void
  onDateSelect: (selectInfo: unknown) => void
}

export default function CalendarView({ events, onEventClick, onDateSelect }: CalendarViewProps) {
  return (
    <div className="h-[600px]">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        eventClick={onEventClick}
        select={onDateSelect}
        height="100%"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={true}
        nowIndicator={true}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '09:00',
          endTime: '17:00',
        }}
      />
    </div>
  )
}

