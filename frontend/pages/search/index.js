import styled from 'styled-components'
import { Box, Typography } from '@material-ui/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import { toCamelCaseObject } from '../../utils'
import { Error } from '../../components/Error'
import { Loading } from '../../components/Loading'

const Text = styled(Typography)`
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

const API_URL = process.env.NEXT_PUBLIC_API_ROOT + '/search'

const fetcher = async (url, param) => {
  const body = JSON.parse(decodeURI(param))
  const res = await axios.post(url, body)
  return res.data
}

const Search = () => {
  const router = useRouter()
  const param = router.query.param
  const { data, error, mutate } = useSWR(param ? API_URL : null, (url) => fetcher(url, param))
  if (error) return <Error />
  if (!data) return <Loading />
  const searchResult = toCamelCaseObject(data)

  return (<>
    <Link href="/">もどる</Link>
    <Overview>{searchResult.startTime} ～ {searchResult.goalTime}</Overview>
    {searchResult.spots.map((spot, index) => <Box key={index}>
      <Spot>
        <Timetable>
          <Text>{index > 0 && searchResult.subroutes[index - 1].goalTime + '着'}</Text>
          <Text>{index < searchResult.subroutes.length && searchResult.subroutes[index].startTime + '発'}</Text>
        </Timetable>
        <Text>{spot.spotName}</Text>
        <WaitTime>{spot.waitTime + '分待ち'}</WaitTime>
      </Spot>
      <Distance>{index < searchResult.subroutes.length && searchResult.subroutes[index].distance + 'm'}</Distance>
    </Box>)}
  </>)
}

export default Search