import styled from 'styled-components'
import { Box, Card, List, ListItem, ListItemIcon, Typography } from '@material-ui/core'
import { FiberManualRecord } from '@material-ui/icons'
import dynamic from 'next/dynamic'
import { useGetTicketReservation } from '../../hooks'
import { Loading } from '../../components/Loading'
import Head from 'next/head'

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

const CalendarHead = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 56px;
`

const CalendarTitle = styled(Typography)`
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

  // hookの中でやった方がいいか
  const land = data.map(event => ({
    start: event.dateStr,
    status: event.onedayPass.land,
    name: 'ticket',
    className: 'ticket',
    url: `${baseUrl}&useDateFrom=${event.dateStr.split('-').join('')}&selectParkDay1=01`
  }))

  // hookの中でやった方がいいか
  const sea = data.map(event => ({
    start: event.dateStr,
    status: event.onedayPass.sea,
    name: 'ticket',
    className: 'ticket',
    url: `${baseUrl}&useDateFrom=${event.dateStr.split('-').join('')}&selectParkDay1=02`
  }))

  const weather = data.map(({ weather }) => ({
    start: weather.dateStr,
    title: weather.weatherStr.substring(0, 1),
    name: ~weather.weatherStr.indexOf('雪')
      ? 'snow'
      : ~weather.weatherStr.indexOf('雨')
        ? 'rainy'
        : ~weather.weatherStr.indexOf('曇')
          ? 'cloudy'
          : ~weather.weatherStr.indexOf('晴')
            ? 'sunny'
            : null,
    img: ~weather.weatherStr.indexOf('雪')
      ? '/snow.svg'
      : ~weather.weatherStr.indexOf('雨')
        ? '/rainy.svg'
        : ~weather.weatherStr.indexOf('曇')
          ? '/cloudy.svg'
          : ~weather.weatherStr.indexOf('晴')
            ? '/sunny.svg'
            : null
  })).filter(w => w.start)

  const emphasisLand = [{
    start: query.land
  }]

  const emphasisSea = [{
    start: query.sea
  }]

  return (<>
    <Head>
      <title>チケット予約|TDS計画ツール|ディズニープラン</title>
      <meta property="og:title" content="チケット予約|TDS計画ツール|ディズニープラン" />
      <meta property="og:description" content="ディズニーランド・シーを効率よくめぐる計画をたてるwebアプリです！リアルタイム待ち時間を考慮しています！" />
      <meta property="og:image" content="/og.png" />
    </Head>
    <Description list={descriptionItems} />
    <CalendarWrap>
      <CalendarHead>
        <img src="/land.svg" />
        <CalendarTitle>ディズニーランド</CalendarTitle>
        <img src="/land.svg" />
      </CalendarHead>
      <Calendar
        events={land}
        weather={weather}
        type="land"
        emphasis={emphasisLand}
      />
    </CalendarWrap>
    <CalendarWrap>
      <CalendarHead>
        <img src="/sea.svg" />
        <CalendarTitle>ディズニーシー</CalendarTitle>
        <img src="/sea.svg" />
      </CalendarHead>
      <Calendar
        events={sea}
        weather={weather}
        type="sea"
        emphasis={emphasisSea}
      />
    </CalendarWrap>
  </>)
}

export async function getServerSideProps(context) {
  const query = context.query
  return { props: { query } }
}

export default Ticket