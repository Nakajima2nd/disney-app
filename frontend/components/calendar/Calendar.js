import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import allLocales from '@fullcalendar/core/locales-all'
import googleCalendarPlugin from '@fullcalendar/google-calendar'

export const Callendar = () => {
  return (
    <FullCalendar
      plugins={[
        dayGridPlugin,
        googleCalendarPlugin
      ]}
      initialView="dayGridMonth"
      locales={allLocales}
      locale="ja"
      height={400}
      headerToolbar={{
        start: 'prev',
        center: 'title',
        end: 'next'
      }}
      dayCellContent={(e) => e.dayNumberText = e.dayNumberText.replace('日', '')}
      googleCalendarApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      eventSources={[
        {
          googleCalendarId: 'ja.japanese#holiday@group.v.calendar.google.com',
          className: 'holiday',
          display: 'background'
        }
      ]}
    />
  )
}