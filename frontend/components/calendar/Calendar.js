import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import allLocales from '@fullcalendar/core/locales-all'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import { RadioButtonUnchecked } from '@material-ui/icons'

export const Callendar = ({ events, weather, type, emphasis }) => {
  return (
    <FullCalendar
      plugins={[
        dayGridPlugin,
        googleCalendarPlugin
      ]}
      initialView="dayGridMonth"
      locales={allLocales}
      locale="ja"
      height={440}
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
        },
        {
          events: events,
          className: type,
          textColor: '#ff56e4'
        },
        {
          events: weather,
          display: 'background',
          className: 'weather',
          textColor: 'inherit',
          backgroundColor: 'inherit',
        },
        {
          events: emphasis,
          display: 'background',
          className: 'emphasis',
          backgroundColor: 'yellow',
        }
      ]}
      eventClick={(info) => {
        info.jsEvent.preventDefault()
        if (info.event.extendedProps.name && info.event.url) {
          window.open(info.event.url)
        }
      }}
      eventContent={(arg) => {
        if (arg.event.extendedProps.name === 'ticket') {
          return (
            <RadioButtonUnchecked />
          )
        }
      }}
      // eventContent={(arg) => {
      //   if (arg.event.extendedProps.className === 'weather') {
      //     return (
      //       <img src={arg.event.extendedProps.url} />
      //     )
      //   }
      // }}
    />
  )
}