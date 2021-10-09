import axios from 'axios'
import { assoc } from 'ramda'
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { searchInputState } from './atoms/searchInput';
import { toCamelCaseObject, toKebabCaseObject } from './utils';

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