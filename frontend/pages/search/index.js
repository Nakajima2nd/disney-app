import styled from 'styled-components'
import { Avatar, Box, Button, Card, Typography } from '@material-ui/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Loading } from '../../components/Loading'
import { useGetSearchResult } from '../../hooks'
import { ArrowRightAlt, DirectionsWalk, Room } from '@material-ui/icons'

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
`

const SpotText = styled(Box)`
  font-size: 1.2rem;
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

const Search = ({ param }) => {
  const router = useRouter()
  const { searchResult, error } = useGetSearchResult(param)
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

  return (<>
    <Overview>
      <OverviewText>{searchResult.startTime}</OverviewText>
      <ArrowRightAlt color="inherit" fontSize="large" />
      <OverviewText>{searchResult.goalTime}</OverviewText>
      <Duration>{getDuration(searchResult.startTime, searchResult.goalTime)}</Duration>
    </Overview>
    {searchResult.spots.map((spot, index) => <Box key={index}>
      <Spot square>
        <Timetable>
          <Text color="textSecondary">{index > 0 && searchResult.subroutes[index - 1].goalTime + '着'}</Text>
          <Text color="textSecondary">{index < searchResult.subroutes.length && searchResult.subroutes[index].startTime + '発'}</Text>
        </Timetable>
        <SpotText>{spot.shortSpotName}</SpotText>
        <WaitTime visibility={index > 0 && index < searchResult.spots.length - 1 ? 'visible' : 'hidden'}>
          <EnableAvatar>{spot.waitTime}分</EnableAvatar>
          <WtaiTimeText color="textSecondary">待ち</WtaiTimeText>
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
  </>)
}

export function getServerSideProps(context) {
  const param = context.query.param
  return { props: { param } }
}

export default Search