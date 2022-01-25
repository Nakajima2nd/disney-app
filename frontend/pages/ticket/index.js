import styled from 'styled-components'
import { Card, List, ListItem, ListItemIcon, Typography } from '@material-ui/core'
import { FiberManualRecord } from '@material-ui/icons'
import dynamic from 'next/dynamic'

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
  height: 416px;
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



const Ticket = ({ query }) => {
  const Calendar = dynamic(() => import('../../components/calendar/Calendar').then(module => module.Callendar), { ssr: false })

  console.log(query)
  return (<>
    <Description list={descriptionItems} />
    <CalendarWrap>
      <Calendar />
    </CalendarWrap>
  </>)
}

export async function getServerSideProps(context) {
  const query = context.query
  return { props: { query } }
}

export default Ticket