import styled from 'styled-components'
import { Box, Typography } from '@material-ui/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Loading } from '../../components/Loading'
import { useGetSearchResult } from '../../hooks'

const Text = styled(Typography)`
`

const ErrorText = styled(Typography)`
  margin: 16px 0 0 0;
`

const Overview = styled(Typography)`
  margin: 16px 0 0 0;
`

const Spot = styled(Box)`
  margin: 16px 0 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Timetable = styled(Box)`
  display: flex;
  flex-direction: column;
`

const WaitTime = styled(Box)`
`

const Distance = styled(Typography)`
  margin: 16px auto 0;
  text-align: center;  
`

const Search = ({ param }) => {
  const router = useRouter()
  const { searchResult, error } = useGetSearchResult(param)
  if (error) return <>
    <Link href="/">もどる</Link>
    <ErrorText>{error}</ErrorText>
  </>
  if (!searchResult) return <Loading />

  return (<>
    <Link href="/">もどる</Link>
    <Overview>{searchResult.startTime} ～ {searchResult.goalTime}</Overview>
    {searchResult.spots.map((spot, index) => <Box key={index}>
      <Spot>
        <Timetable>
          <Text>{index > 0 && searchResult.subroutes[index - 1].goalTime + '着'}</Text>
          <Text>{index < searchResult.subroutes.length && searchResult.subroutes[index].startTime + '発'}</Text>
        </Timetable>
        <Text>{spot.shortSpotName}</Text>
        <WaitTime>{spot.waitTime + '分待ち'}</WaitTime>
      </Spot>
      <Distance>{index < searchResult.subroutes.length && searchResult.subroutes[index].distance + 'm'}</Distance>
    </Box>)}
  </>)
}

export function getServerSideProps(context) {
  const param = context.query.param
  return { props: { param } }
}

export default Search