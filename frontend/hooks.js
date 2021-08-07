import axios from 'axios'
import { useEffect, useState } from 'react';
import { toCamelCaseObject } from './utils';

export const useGetSpotList = () => {
  const [spotList, setSpotList] = useState()
  const [error, setError] = useState()
  const fetch = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_ROOT + '/spot/list'
      const res = await axios.get(API_URL)
      setSpotList(toCamelCaseObject(res.data))
    } catch (error) {
      setError(error)
    }
  }
  useEffect(() => {
    if (!spotList && !error) {
      fetch()
    }
  })
  return {
    spotList: spotList,
    error: error
  }
}

export const useGetSearchResult = (param) => {
  const [searchResult, setSearchResult] = useState()
  const [error, setError] = useState()
  const fetch = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_ROOT + '/search'
      const body = JSON.parse(decodeURI(param))
      const res = await axios.post(API_URL, body)
      setSearchResult(toCamelCaseObject(res.data))
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message)
      }
      else {
        setError('入力が不正です')
      }
    }
  }
  useEffect(() => {
    if (!searchResult && !error) {
      fetch()
    }
  })
  return {
    searchResult: searchResult,
    error: error
  }
}