import styled from 'styled-components'
import { Card, List, ListItem, ListItemIcon, Typography } from '@material-ui/core'
import { FiberManualRecord } from '@material-ui/icons'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import allLocales from '@fullcalendar/core/locales-all'
// import googleCalendarPlugin from '@fullcalendar/google-calendar'

const DescriptionList = styled(List)`
  margin: 16px 0 0;
  padding: 16px 8px;
  background-color: white;
`

const DescriptionListItem = styled(ListItem)`
  display: flex;
  align-items: center;
  padding: 0;
`

const DescriptionListItemIcon = styled(ListItemIcon)`
  min-width: 16px;
  width: 16px;
`

const DescriptionListItemText = styled(Typography)`
  font-size: 0.9rem;
`

const CalendarWrap = styled(Card)`
  margin: 16px;
  padding: 16px 0 0;
`

const Description = ({ list }) => {
  return (
    <DescriptionList>
      {list.map((item, index) => (
        <DescriptionListItem key={index}>
          <DescriptionListItemIcon><FiberManualRecord color="primary" style={{ fontSize: 12 }} /></DescriptionListItemIcon>
          <DescriptionListItemText>{item}</DescriptionListItemText>
        </DescriptionListItem>
      ))}
    </DescriptionList>
  )
}

const descriptionItems = [
  'ディズニーチケットの販売状況まとめページです',
  '現在、ワンデーパスポートのみ対応しています',
  'カレンダーの◯をタップすると予約ページにいきます'
]

const Ticket = () => {
  return (<>
    <Description list={descriptionItems} />
    <CalendarWrap>
      <FullCalendar
        plugins={[
          dayGridPlugin,
          // googleCalendarPlugin
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
        // googleCalendarApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        // events={{
        //   googleCalendarId: 'ja.japanese#holiday@group.v.calendar.google.com',
        //   className: 'holiday',
        //   display: 'background'
        // }}
      />
    </CalendarWrap>
  </>)
}

export default Ticket