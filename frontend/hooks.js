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
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_ROOT + '/search'
    const body = JSON.parse(decodeURI(param))
    const fetcher = async (url, body) => {
      const res = await axios.post(url, body)
      return res.data
    }
    const { data, error } = useSWR(param ? API_URL : null, (url) => fetcher(url, body))
    return {
      searchResult: data ? toCamelCaseObject(data) : data,
      error: error ? error.response.data.message : error
    }
  }
  catch (e) {
    return {
      error: 'URLが不正です。'
    }
  }
}