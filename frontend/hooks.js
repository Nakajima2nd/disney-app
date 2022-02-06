import axios from 'axios'
import { assoc } from 'ramda'
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { searchInputState } from './atoms/searchInput';
import { toCamelCaseObject, toCamelCaseArray } from './utils';

export const useGetTicketReservation = () => {
  const [data, setData] = useState()
  const [error, setError] = useState()
  const fetch = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_ROOT + '/ticket-reservation'
      const res = await axios.get(API_URL)
      setData(toCamelCaseArray(res.data))
    }
    catch (error) {
      console.log(error)
      setError("何らかのエラー")
    }
  }
  useEffect(() => {
    if (!data && !error) {
      fetch()
    }
  }, [data, error])
  return {
    data: data,
    error: error
  }
}

export const useGetSpotList = () => {
  const [spotList, setSpotList] = useState()
  const [error, setError] = useState()
  const fetch = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_ROOT + '/spot/list'
      const res = await axios.get(API_URL)
      setSpotList(toCamelCaseObject(res.data))
    }
    catch (error) {
      console.log(error)
      setError("何らかのエラー")
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

export const useGetSearchResult = (query) => {
  const [searchResult, setSearchResult] = useState()
  const [searchInput, setSearchInput] = useRecoilState(searchInputState)
  const [error, setError] = useState()

  const fetch = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_ROOT + '/search?'
      setSearchInput(toCamelCaseObject(query))
      const res = await axios.get(API_URL + Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&'))
      setSearchResult(toCamelCaseObject(res.data))
    }
    catch (error) {
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
  }, [searchResult, error])
  return {
    searchResult: searchResult,
    error: error
  }
}

export const useGetDevice = () => {
  const [device, setDevice] = useState()
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('android') > -1) {
      setDevice('sp')
    }
    else {
      setDevice('pc')
    }
  }, [])

  return device
}