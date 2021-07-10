import styled from 'styled-components'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, MenuItem, Switch, Tabs, Tab, TextField, Typography, List, ListItem, ListItemText, Collapse } from '@material-ui/core'
import { Close, Restaurant, SportsTennis, AccessibilityNew, ShoppingCart } from '@material-ui/icons'
import { TimePicker } from '@material-ui/pickers';
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

const Text = styled(Typography)`
`

const DesiredArrivalTimePicker = styled(TimePicker)`
  margin: 0;
`

const StayTimeSelect = styled(TextField)`
  margin: 0;
`
const SpecifiedWaitTimeSelect = styled(TextField)`
  margin: 0;
`

const ConditionSwitch = styled(FormControlLabel)`
  margin-top: 24px;
`

const API_URL = process.env.NEXT_PUBLIC_API_ROOT + '/spot/list'

const fetcher = async (url) => {
  const res = await axios.get(url)
  return res.data
}

export const SpotListDialog = ({ editing, selected, open, spots, setEditing, setOpen, setSpots }) => {
  const { data: spotList, error, mutate } = useSWR(API_URL, fetcher)
  const [keyword, setKeyword] = useState('')
  const [tab, setTab] = useState(0)
  const [control, setControl] = useState(0)
  const [switches, setSwitches] = useState({
    desiredArrivalTime: false,
    stayTime: false,
    specifiedWaitTime: false
  })

  if (error) return <Error />
  if (!spotList) return <Loading />

  const handleClose = () => {
    setOpen(false)
    setTimeout(setControl(0), 2000)
    setTimeout(setSwitches({
      desiredArrivalTime: false,
      stayTime: false,
      specifiedWaitTime: false
    }), 2000)
  }

  // todo: 日本語未確定の状態では絞り込みは行わなくしたい
  const handleKeyword = (event) => {
    setKeyword(event.target.value)
  }

  const handleTab = (event, value) => {
    setTab(value)
  }

  const handleSwitches = (event) => {
    setSwitches(assoc(event.target.name, event.target.checked, switches))
  }

  const handleClickSpot = (spot) => (event) => {
    const newSpot = pipe(
      assoc('spotId', spot.spot_id),
      assoc('name', spot.name)
    )(editing)
    setEditing(newSpot)
    setControl(1)
  }

  const handleBack = () => {
    setControl(0)
  }

  const handleDesiredArrivalTime = (date) => {
    setEditing(assoc('desiredArrivalTime', date, editing));
  }

  const handleStayTime = (event) => {
    setEditing(assoc('stayTime', event.target.value, editing))
  }

  const handleSpecifiedWaitTime = (event) => {
    setEditing(assoc('specifiedWaitTime', event.target.value, editing))
  }

  const handleComplete = () => {
    if (selected === -1) {
      setSpots(append(editing))
    }
    else {
      setSpots(update(selected, editing, spots))
    }
    handleClose()
  }

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
        {control === 0 &&
          <SpotSelect
            keyword={keyword}
            handleKeyword={handleKeyword}
            tab={tab}
            handleTab={handleTab}
            spotList={spotList}
            editing={editing}
            handleClickSpot={handleClickSpot}
          />
        }
        {control === 1 &&
          <ConditionInput
            handleDesiredArrivalTime={handleDesiredArrivalTime}
            handleStayTime={handleStayTime}
            handleSpecifiedWaitTime={handleSpecifiedWaitTime}
            tab={tab}
            editing={editing}
            switches={switches}
            handleSwitches={handleSwitches}
          />
        }
      </SpotDialogContent>
      <DialogActions>
        {control === 1 && <>
          <Button onClick={handleBack} color="primary">もどる</Button>
          <Button onClick={handleComplete} color="primary">決定</Button>
        </>}
        <Button onClick={handleClose} color="primary">キャンセル</Button>
      </DialogActions>
    </SpotDialog>
  )
}

const SpotSelect = ({ keyword, handleKeyword, tab, handleTab, spotList, editing, handleClickSpot }) => {
  return (<>
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
    </SpotTabs>
    <SpotList
      obj={spotList[Object.keys(spotList)[tab]]}
      editing={editing}
      keyword={keyword}
      handleClickSpot={handleClickSpot}
    />
  </>)
}

const ConditionInput = ({ handleDesiredArrivalTime, handleStayTime, handleSpecifiedWaitTime, tab, editing, switches, handleSwitches }) => {
  return (<>
    <Text>{editing.name}</Text>
    {(tab === 0 || tab === 1 || tab === 3) && <>
      <ConditionSwitch
        control={<Switch checked={switches.desiredArrivalTime} color="primary" onChange={handleSwitches} name="desiredArrivalTime" />}
        label={<Text color="textSecondary">到着希望時間を指定する</Text>}
      />
      <Collapse in={switches.desiredArrivalTime}>
        <DesiredArrivalTimePicker
          margin="normal"
          label="到着希望時間"
          format="HH:mm"
          value={editing.desiredArrivalTime}
          onChange={handleDesiredArrivalTime}
          okLabel="決定"
          cancelLabel="キャンセル"
          fullWidth
        />
      </Collapse>
    </>}
    {(tab === 1 || tab === 2) && <>
      <ConditionSwitch
        control={<Switch checked={switches.stayTime} color="primary" onChange={handleSwitches} name="stayTime" />}
        label={<Text color="textSecondary">滞在時間を指定する</Text>}
      />
      <Collapse in={switches.stayTime}>
        <StayTimeSelect
          label="滞在時間"
          value={editing.stayTime}
          onChange={handleStayTime}
          select
          fullWidth
        >
          <MenuItem value="10">10分</MenuItem>
          <MenuItem value="30">30分</MenuItem>
          <MenuItem value="60">60分</MenuItem>
        </StayTimeSelect>
      </Collapse>
    </>}
    {tab === 4 && <>
      <ConditionSwitch
        control={<Switch checked={switches.specifiedWaitTime} color="primary" onChange={handleSwitches} name="specifiedWaitTime" />}
        label={<Text color="textSecondary">待ち時間を指定する</Text>}
      />
      <Collapse in={switches.specifiedWaitTime}>
        <SpecifiedWaitTimeSelect
          label="指定待ち時間"
          value={editing.specifiedWaitTime}
          onChange={handleSpecifiedWaitTime}
          select
          fullWidth
        >
          <MenuItem value="10">10分</MenuItem>
          <MenuItem value="30">30分</MenuItem>
          <MenuItem value="60">60分</MenuItem>
        </SpecifiedWaitTimeSelect>
      </Collapse>
    </>}
  </>)
}

const SpotList = ({ obj, editing, keyword, handleClickSpot }) => {
  return (
    <CustomList>
      {obj.filter(spot => spot.name.indexOf(keyword) > -1).map((spot, index) => (
        <ListItem
          key={index}
          button
          onClick={handleClickSpot(spot)}
          selected={editing.spotId === spot.spot_id}
        >
          <ListItemText primary={spot.name} />
        </ListItem>
      ))}
    </CustomList>
  )
}