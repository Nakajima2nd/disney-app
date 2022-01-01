import styled, { createGlobalStyle } from 'styled-components'
import { Avatar, Box, Button, Card, MobileStepper, SwipeableDrawer, Typography } from '@material-ui/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Loading } from '../../components/Loading'
import { useGetSearchResult } from '../../hooks'
import { ArrowRightAlt, DirectionsWalk, Room, KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons'
import { hasWaitTime } from '../../utils'
import Head from 'next/head'
import { CustomMap } from '../../components/maps/CustomMap'
import { useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

const GlobalStyle = createGlobalStyle`
  .MuiDrawer-root > .MuiPaper-root {
    height: calc(80% - 72px);
    overflow: visible;
    max-width: 800px;
    margin: auto;
    background-color: rgba(255, 255, 255, 0.9);
  }
`

const Wrap = styled(Box)`
  height: calc(100% - 8px);
  margin: 8px 0 0 0;
`

const CurrentPath = styled(Box)`
  height: 72px;
  padding: 8px 0 0 0;
  background: white;
  position: relative;
`

const Start = styled(Box)`
  display: flex;
  align-items: center;
  padding: 0 48px;
`

const Goal = styled(Box)`
  display: flex; 
  align-items: center;
  padding: 0 48px;
`

const Time = styled(Typography)`
  white-space: nowrap;
  width: 50px;
  text-align: right;
  flex-basis: 50px;
`

const SmallAvatar = styled(Avatar)`
  width: 16px;
  height: 16px;
  font-size: 10px;
  margin: 0 8px;
`

const ArrivalAvatar = styled(SmallAvatar)`
  background-color: ${(props) => props.theme.palette.arrival.main};
`

const DepartureAvatar = styled(SmallAvatar)`
  background-color: ${(props) => props.theme.palette.departure.main};
`

const Name = styled(Typography)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-basis: calc(100% - 50px - 32px);
  font-size: 1.2rem;
`

const CustomMobileStepper = styled(MobileStepper)`
  padding: 0;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
  background-color: inherit;
  height: 16px;
`

const ArrowButton = styled(Button)`
  position: relative;
  top: -28px;
  width: 24px;
  min-width: 24px;
`

const MapWrap = styled(Box)`
  position: relative;
  margin: 8px 0 0 0;
  height: calc(100% - 72px - 60px);
`

const Text = styled(Typography)`
`

const ErrorText = styled(Typography)`
  margin: 16px 0 0 0;
`

const Puller = styled(Box)`
  width: 30px;
  height: 6px;
  background-color: gray;
  border-radius: 3px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translate(-50%, 0);
`

const Overview = styled(Box)`
  padding: 16px 0;
  position: absolute;
  top: -72px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  visibility: visible;
  background-color: #fafafa;
  width: 100%;
  height: 72px;
  color: ${(props) => props.theme.palette.logo.main};
  text-align: center;
`
const OverviewText = styled(Typography)`
  font-size: 1.8rem;
  font-weight: bold;
`

const TimeWrap = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Detail = styled(Box)`
  height: 100%;
  overflow: auto;
`

const Duration = styled(Typography)`
  position: relative;
  top: -8px;
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
  background-color: ${(props) => props.current ? props.theme.palette.logo.main : 'lightgray'};
`

const Walk = styled(Box)`
  display: flex;
  align-items: center;
`

const DistanceText = styled(Typography)`
`

const ButtonWrap = styled(Box)`
  margin: 24px 8px;
`

const BackButton = styled(Button)`
  font-size: 1.3rem;
`

const Search = ({ query }) => {
  const router = useRouter()
  const { searchResult, error } = useGetSearchResult(query)
  const [open, setOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
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

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  const handleNextArrow = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)

  }

  const handleBackArrow = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleChangeIndex = index => {
    setActiveStep(index)
  }

  return (
    <Wrap>
      <Head>
        <title>探索結果|TDS計画ツール|ディズニープラン</title>
        <meta property="og:title" content="探索結果|TDS計画ツール|ディズニープラン" />
        <meta property="og:description" content="ディズニーランド・シーを効率よくめぐる計画をたてるwebアプリです！リアルタイム待ち時間を考慮しています！" />
        <meta property="og:image" content="/og.png" />
      </Head>
      <CurrentPath>
        <SwipeableViews
          enableMouseEvents
          index={activeStep}
          resistance
          onChangeIndex={index => handleChangeIndex(index)}
        >
          {searchResult.subroutes.map((_, index) => <>
            <Start>
              <Time>{searchResult.subroutes[index].startTime}発</Time>
              <DepartureAvatar>S</DepartureAvatar>
              <Name>{searchResult.spots[index].shortSpotName}</Name>
            </Start>
            <Goal>
              <Time>{searchResult.subroutes[index].goalTime}着</Time>
              <ArrivalAvatar>G</ArrivalAvatar>
              <Name>{searchResult.spots[index + 1].shortSpotName}</Name>
            </Goal>
          </>)}
        </SwipeableViews>
        <CustomMobileStepper
          variant="dots"
          steps={searchResult.subroutes.length}
          position="static"
          activeStep={activeStep}
          nextButton={
            <ArrowButton size="small" onClick={handleNextArrow} disabled={activeStep === searchResult.subroutes.length - 1}>
              <KeyboardArrowRight />
            </ArrowButton>
          }
          backButton={
            <ArrowButton size="small" onClick={handleBackArrow} disabled={activeStep === 0}>
              <KeyboardArrowLeft />
            </ArrowButton>
          }
        />
      </CurrentPath>
      <MapWrap>
        <CustomMap searchResult={searchResult} current={activeStep} />
      </MapWrap>
      <GlobalStyle />
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={72}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Overview>
          <Puller />
          <TimeWrap>
            <OverviewText>{searchResult.startTime}</OverviewText>
            <ArrowRightAlt color="inherit" fontSize="large" />
            <OverviewText>{searchResult.goalTime}</OverviewText>
          </TimeWrap>
          <Duration>{getDuration(searchResult.startTime, searchResult.goalTime)}</Duration>
        </Overview>
        <Detail>
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
                <Line
                  current={index === activeStep}
                />
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
        </Detail>
      </SwipeableDrawer>
    </Wrap>
  )
}

export function getServerSideProps(context) {
  const query = context.query
  return { props: { query } }
}

export default Search