import styled from 'styled-components'
import { Avatar, Box, Button, Card, Typography } from '@material-ui/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Loading } from '../../components/Loading'
import { useGetSearchResult } from '../../hooks'
import { ArrowRightAlt, DirectionsWalk, Room } from '@material-ui/icons'
import { hasWaitTime } from '../../utils'
import Head from 'next/head'
import { CustomMap } from '../../components/maps/CustomMap'

const Wrap = styled(Box)`
  margin: auto;
  padding-bottom: 8px;
  max-width: 800px;
`

const Text = styled(Typography)`
`

const ErrorText = styled(Typography)`
  margin: 16px 0 0 0;
`

const Overview = styled(Box)`
  padding: 16px 0;
  display: flex;
  color: ${(props) => props.theme.palette.logo.main};
  justify-content: center;
  align-items: center;
`

const OverviewText = styled(Typography)`
  font-size: 1.8rem;
  font-weight: bold;
`

const Duration = styled(Typography)`
  color: initial;
`

const Spot = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  height: 64px;
`

const Timetable = styled(Box)`
  display: flex;
  flex-direction: column;
  min-width: 52px;
`

const SpotText = styled(Box)`
  font-size: 1.2rem;
  padding: 0 8px;
`

const WaitTime = styled(Box)`
  position: relative;
`

const EnableAvatar = styled(Avatar)`
  color: white;
  background-color: ${(props) => props.theme.palette.enable.main};
  width: 4rem;
  height: 4rem;
  font-size: 1.6rem;
`

const DisableAvatar = styled(Avatar)`
  color: white;
  background-color: lightgray;
  width: 4rem;
  height: 4rem;
  font-size: 1.2rem;
`

const WtaiTimeText = styled(Typography)`
  position: absolute;
  right: 0;
  bottom: -4px;
  font-weight: bold;
`

const Distance = styled(Box)`
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 0 22px;
  color: ${(props) => props.theme.palette.logo.main};
`

const Line = styled.span`
  height: 100%;
  width: 8px;
  background-color: currentColor;
`

const Walk = styled(Box)`
  display: flex;
  align-items: center;
`

const DistanceText = styled(Typography)`
`

const ButtonWrap = styled(Box)`
  margin: 24px 8px 0;
`

const BackButton = styled(Button)`
  font-size: 1.3rem;
`

const Search = ({ query }) => {
  const router = useRouter()
  const { searchResult, error } = useGetSearchResult(query)
  if (error) return <>
    <Link href="/">もどる</Link>
    <ErrorText>{error}</ErrorText>
  </>
  if (!searchResult) return <Loading />

  const getDuration = (startTime, goalTime) => {
    const sub = goalTime.split(':')[1] - startTime.split(':')[1]
    const hour = sub < 0 ? goalTime.split(':')[0] - startTime.split(':')[0] - 1 : goalTime.split(':')[0] - startTime.split(':')[0]
    const minute = sub < 0 ? sub + 60 : sub
    return hour > 0 ? `(${hour}時間${minute}分)` : `(${minute}分)`
  }

  const getTransitTime = (transitTime) => {
    const hour = Math.round(transitTime / 60 / 60)
    const minute = Math.round(transitTime / 60)
    return hour > 1 ? `(${hour}時間${minute}分)` : `(${minute}分)`
  }

  const handleBack = () => {
    router.push({
      pathname: '/',
    })
  }

  return (
    <Wrap>
      <Head>
        <title>探索結果|TDS計画ツール|ディズニープラン</title>
        <meta property="og:title" content="探索結果|TDS計画ツール|ディズニープラン" />
        <meta property="og:description" content="ディズニーランド・シーを効率よくめぐる計画をたてるwebアプリです！リアルタイム待ち時間を考慮しています！" />
        <meta property="og:image" content="/og.png" />
      </Head>
      <Overview>
        <OverviewText>{searchResult.startTime}</OverviewText>
        <ArrowRightAlt color="inherit" fontSize="large" />
        <OverviewText>{searchResult.goalTime}</OverviewText>
        <Duration>{getDuration(searchResult.startTime, searchResult.goalTime)}</Duration>
      </Overview>
      <CustomMap searchResult={searchResult} />
      {searchResult.spots.map((spot, index) => <Box key={index}>
        <Spot square>
          <Timetable>
            <Text color="textSecondary">{index > 0 && searchResult.subroutes[index - 1].goalTime + '着'}</Text>
            <Text color="textSecondary">{index < searchResult.subroutes.length && searchResult.subroutes[index].startTime + '発'}</Text>
          </Timetable>
          <SpotText>{spot.shortSpotName}</SpotText>
          <WaitTime visibility={index > 0 && index < searchResult.spots.length - 1 && hasWaitTime(spot.type) ? 'visible' : 'hidden'}>
            {spot.violateBusinessHour && <>
              <DisableAvatar>時間外</DisableAvatar>
            </>}
            {!spot.violateBusinessHour && spot.waitTime === -1 && <>
              <DisableAvatar>休止中</DisableAvatar>
            </>}
            {!spot.violateBusinessHour && spot.waitTime !== -1 && <>
              <EnableAvatar>{spot.waitTime}分</EnableAvatar>
              <WtaiTimeText color="textSecondary">待ち</WtaiTimeText>
            </>}
          </WaitTime>
        </Spot>
        {index < searchResult.subroutes.length &&
          <Distance>
            <Line></Line>
            <Walk>
              <DirectionsWalk fontSize="large" />
              <DistanceText color="textSecondary">{searchResult.subroutes[index].distance}m{getTransitTime(searchResult.subroutes[index].transitTime)}</DistanceText>
            </Walk>
            <Room fontSize="large" />
          </Distance>
        }
      </Box>)}
      <ButtonWrap>
        <BackButton
          onClick={handleBack}
          variant="contained"
          color="primary"
          fullWidth
        >
          条件を変えて再検索
        </BackButton>
      </ButtonWrap>
    </Wrap>
  )
}

export function getServerSideProps(context) {
  const query = context.query
  return { props: { query } }
}

export default Search