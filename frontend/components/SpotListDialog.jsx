import styled from 'styled-components'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, Tabs, Tab, TextField, Typography, List, ListItem, ListItemText } from '@material-ui/core'
import { Close, Restaurant, SportsTennis, AccessibilityNew, ShoppingCart } from '@material-ui/icons'
import { useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import { append, assoc, pipe, update } from 'ramda'
import { Error } from '../components/Error'
import { Loading } from '../components/Loading'

// todo: 画面サイズによってダイアログの横幅を調節
const SpotDialog = styled(Dialog)`
`

const DialogHead = styled(Box)`
  position: relative;
`

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translate(0, -50%);
`

const SpotTabs = styled(Tabs)`
  margin: 32px 0 0;
`

const SpotTab = styled(Tab)`
`

const CustomList = styled(List)`
  height: calc(100% - 32px - 32px - 72px);
  overflow: auto;
`

const SpotDialogContent = styled(DialogContent)`
`

// todo envファイルに書く
const API_URL = 'http://localhost:8001/spot/list'

const fetcher = async (url) => {
  const res = await axios.get(url)
  return res.data
}

export const SpotListDialog = ({ editing, selected, open, spots, setEditing, setOpen, setSpots, setStartSpot, setGoalSpot }) => {
  const { data, error, mutate } = useSWR(API_URL, fetcher)
  const [keyword, setKeyword] = useState('')
  const [tab, setTab] = useState(0)
  if (error) return <Error />
  if (!data) return <Loading />

  const handleClose = () => {
    setOpen(false)
  }

  // todo: 日本語未確定の状態では絞り込みは行わなくしたい
  const handleKeyword = (event) => {
    setKeyword(event.target.value)
  }

  const handleTab = (event, value) => {
    setTab(value)
  }

  const handleComplete = () => {
    if (selected === -3) {
      setStartSpot(editing)
    }
    else if (selected === -2) {
      setGoalSpot(editing)
    }
    else if (selected === -1) {
      setSpots(append(editing))
    }
    else {
      setSpots(update(selected, editing, spots))
    }
    setOpen(false)
  }

  const handleSelect = (spot) => (event) => {
    const newSpot = pipe(
      assoc('spotId', spot.spot_id),
      assoc('name', spot.name)
    )(editing)
    setEditing(newSpot)
  }

  const spotList = JSON.parse(data)

  return (
    <SpotDialog
      open={open}
      onClose={handleClose}
      fullWidth
    >
      <DialogHead>
        <DialogTitle>スポット選択</DialogTitle>
        <CloseButton onClick={handleClose}>
          <Close />
        </CloseButton>
      </DialogHead>
      <SpotDialogContent>
        <TextField
          value={keyword}
          onChange={handleKeyword}
          fullWidth
        />
        <SpotTabs
          value={tab}
          onChange={handleTab}
          variant="scrollable"
          indicatorColor="primary"
          textColor="primary"
          scrollButtons="on"
        >
          <SpotTab icon={<SportsTennis />} label="アトラクション" />
          <SpotTab icon={<Restaurant />} label="レストラン" />
          <SpotTab icon={<ShoppingCart />} label="ショップ" />
          <SpotTab icon={<AccessibilityNew />} label="スポット" />
          {/* <SpotTab icon={<AccessibilityNew />} label="ショー" /> */}
          {/* <SpotTab icon={<AccessibilityNew />} label="グリーティング" /> */}
        </SpotTabs>
        <SpotList
          obj={spotList[Object.keys(spotList)[tab]]}
          editing={editing}
          keyword={keyword}
          handleSelect={handleSelect}
        />
      </SpotDialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">キャンセル</Button>
        <Button onClick={handleComplete} color="primary">{selected === -1 ? '追加' : '更新'}</Button>
      </DialogActions>
    </SpotDialog>
  )
}

const SpotList = ({ obj, editing, keyword, handleSelect }) => {
  return (
    <CustomList>
      {obj.filter(spot => spot.name.indexOf(keyword) > -1).map((spot, index) => (
        <ListItem
          key={index}
          button
          onClick={handleSelect(spot)}
          selected={editing.spotId === spot.spot_id}
        >
          <ListItemText primary={spot.name} />
        </ListItem>
      ))}
    </CustomList>
  )
}