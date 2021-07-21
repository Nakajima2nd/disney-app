import axios from 'axios'
import { assoc } from 'ramda'
import useSWR from "swr"
import { toCamelCaseObject } from './utils';

export const useGetSpotList = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_ROOT + '/spot/list'
  const fetcher = async (url) => {
    const res = await axios.get(url)
    return res.data
  }

  const { data, error, mutate } = useSWR(API_URL, fetcher)

  const spotList = parseSpotList(data)
  return {
    spotList: spotList,
    error: error,
    mutate: mutate
  }
}

const parseSpotList = (data) => {
  if (data) {
    return toCamelCaseObject(data)
  }
}