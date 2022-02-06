import styled from 'styled-components'
import { Box, Card, List, ListItem, ListItemIcon, Typography } from '@material-ui/core'
import { FiberManualRecord } from '@material-ui/icons'
import dynamic from 'next/dynamic'
import { useGetTicketReservation } from '../../hooks'
import { Loading } from '../../components/Loading'

const baseUrl = 'https://reserve.tokyodisneyresort.jp/ticket/search/?parkTicketGroupCd=020&numOfAdult=2&numOfJunior=0&numOfChild=0&parkTicketSalesForm=1&useDays=1&route=1'

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
  height: 484px;
`

const Head = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 56px;
`

const Title = styled(Typography)`
  font-size: 1.2rem;
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
  const { data, error } = useGetTicketReservation()

  if (error) return <Text>{error}</Text>
  if (!data) return <Loading />

  console.log(data)
  const land = data.map(event => ({
    start: event.dateStr,
    sea: event.onedayPass.sea,
    land: event.onedayPass.land,
    name: 'ticket',
    className: 'ticket',
    url: `${baseUrl}&useDateFrom=${event.dateStr.split('-').join('')}&selectParkDay1=01`
  })).filter(event => event.land)

  const sea = data.map(event => ({
    start: event.dateStr,
    sea: event.onedayPass.sea,
    land: event.onedayPass.land,
    name: 'ticket',
    className: 'ticket',
    url: `${baseUrl}&useDateFrom=${event.dateStr.split('-').join('')}&selectParkDay1=02`
  })).filter(event => event.sea)

  const weather = data.map(({ weather }) => ({
    start: weather.dateStr,
    title: weather.weatherStr.substring(0, 1)
  })).filter(w => w.start)

  return (<>
    <Description list={descriptionItems} />
    <CalendarWrap>
      <Head>
        <img src="/land.svg" />
        <Title>ディズニーランド</Title>
        <img src="/land.svg" />
      </Head>
      <Calendar
        events={land}
        weather={weather}
        type="land"
      />
    </CalendarWrap>
    <CalendarWrap>
    <Head>
        <img src="/sea.svg" />
        <Title>ディズニーシー</Title>
        <img src="/sea.svg" />
      </Head>
      <Calendar
        events={sea}
        weather={weather}
        type="sea"
      />
    </CalendarWrap>
  </>)
}

export async function getServerSideProps(context) {
  const query = context.query
  return { props: { query } }
}

export default Ticket