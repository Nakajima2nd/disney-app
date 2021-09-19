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

export const useGetSearchResult = (param) => {
  const [searchResult, setSearchResult] = useState()
  const [searchInput, setSearchInput] = useRecoilState(searchInputState)
  const [error, setError] = useState()
  const spotInterface = [
    'spotId',
    'desiredArrivalTime',
    'stayTime',
    'specifiedWaitTime'
  ]

  const modifySpots = (spots) => {
    return spots.map(spot => {
      return Object.keys(spot).filter(key => spotInterface.includes(key)).reduce((acc, cur) => {
        if (cur === 'spotId') {
          return assoc(cur, spot[cur], acc)
        }
        else if (spot[cur]) {
          return assoc(cur, spot[cur], acc)
        }
        else {
          return acc
        }
      }, {})
    })
  }

  const createRequest = (body) => {
    return toKebabCaseObject({
      ...body.condition,
      startSpotId: body.start.spotId,
      goalSpotId: body.goal.spotId,
      spots: modifySpots(body.spots)
    })
  }

  const fetch = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_ROOT + '/search'
      const body = JSON.parse(decodeURI(param))
      setSearchInput(body)
      const request = createRequest(body)
      const res = await axios.post(API_URL, request)
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