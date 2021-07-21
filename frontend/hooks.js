import axios from 'axios'
import useSWR from "swr"
import { toCamelCaseObject } from './utils';

export const useGetSpotList = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_ROOT + '/spot/list'
  const fetcher = async (url) => {
    const res = await axios.get(url)
    return res.data
  }

  const { data, error, mutate } = useSWR(API_URL, fetcher)

  return {
    spotList: data ? toCamelCaseObject(data) : data,
    error: error,
    mutate: mutate
  }
}


export const useGetSearchResult = (param) => {
  const API_URL = process.env.NEXT_PUBLIC_API_ROOT + '/search'
  const fetcher = async (url, param) => {
    const body = JSON.parse(decodeURI(param))
    const res = await axios.post(url, body)
    return res.data
  }

  const { data, error, mutate } = useSWR(param ? API_URL : null, (url) => fetcher(url, param))

  return {
    searchResult: data ? toCamelCaseObject(data) : data,
    error: error,
    mutate: mutate
  }
}