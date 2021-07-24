import styled from 'styled-components'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, MenuItem, Switch, Tabs, Tab, TextField, Typography, List, ListItem, ListItemText, Collapse, InputAdornment } from '@material-ui/core'
import { Close, Restaurant, SportsTennis, AccessibilityNew, ShoppingCart, Search } from '@material-ui/icons'
import { TimePicker } from '@material-ui/pickers';
import { append, assoc, dissoc, pipe, update } from 'ramda'
import { Error } from '../components/Error'
import { Loading } from '../components/Loading'
import { useGetSpotList } from '../hooks'

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

export const SpotListDialog = ({ editing, selected, open, spots, setEditing, setOpen, setSpots }) => {
  const { spotList, error, mutate } = useGetSpotList()

  if (error) return <Error />
  if (!spotList) return <Loading />

  const handleClose = () => {
    setOpen(false)
  }

  // todo: 日本語未確定の状態では絞り込みは行わなくしたい
  const handleKeyword = (event) => {
    setEditing(assoc('keyword', event.target.value, editing))
  }

  const handleTab = (event, value) => {
    setEditing(assoc('tab', value, editing))
  }

  const handleSwitches = (event) => {
    setEditing(assoc(event.target.name, event.target.checked, editing))
  }

  const handleClickSpot = (spot) => (event) => {
    const newSpot = pipe(
      assoc('spotId', spot.spotId),
      assoc('name', spot.name),
      assoc('shortName', spot.shortName),
      assoc('startTime', spot.startTime),
      assoc('step', 1)
    )(editing)
    setEditing(newSpot)
  }

  const handleBack = () => {
    setEditing(assoc('step', 0, editing))
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
    const newSpot = pipe(
      assoc('desiredArrivalTime', editing.startTime ? editing.startTime : editing.checkedDesiredArrivalTime ? editing.desiredArrivalTime : null),
      assoc('stayTime', editing.checkedStayTime ? editing.stayTime : ''),
      assoc('specifiedWaitTime', editing.checkedSpecifiedWaitTime ? editing.specifiedWaitTime : '')
    )(editing)
    if (selected === -1) {
      setSpots(append(newSpot))
    }
    else {
      setSpots(update(selected, newSpot, spots))
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
        {editing.step === 0 &&
          <SpotSelect
            handleKeyword={handleKeyword}
            handleTab={handleTab}
            spotList={dissoc('place', spotList)}
            editing={editing}
            handleClickSpot={handleClickSpot}
          />
        }
        {editing.step === 1 &&
          <ConditionInput
            handleDesiredArrivalTime={handleDesiredArrivalTime}
            handleStayTime={handleStayTime}
            handleSpecifiedWaitTime={handleSpecifiedWaitTime}
            editing={editing}
            handleSwitches={handleSwitches}
          />
        }
      </SpotDialogContent>
      <DialogActions>
        {editing.step === 1 && <>
          <Button onClick={handleBack} color="primary">もどる</Button>
          <Button onClick={handleComplete} color="primary">決定</Button>
        </>}
      </DialogActions>
    </SpotDialog>
  )
}

const SpotSelect = ({ handleKeyword, handleTab, spotList, editing, handleClickSpot }) => {
  return (<>
    <TextField
      value={editing.keyword}
      onChange={handleKeyword}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }} />
    <SpotTabs
      value={editing.tab}
      onChange={handleTab}
      variant="scrollable"
      indicatorColor="primary"
      textColor="primary"
      scrollButtons="on"
    >
      <SpotTab icon={<SportsTennis />} label="アトラクション" />
      <SpotTab icon={<Restaurant />} label="レストラン" />
      <SpotTab icon={<ShoppingCart />} label="ショップ" />
      <SpotTab icon={<AccessibilityNew />} label="ショー" />
    </SpotTabs>
    <SpotList
      obj={spotList[Object.keys(spotList)[editing.tab]]}
      editing={editing}
      handleClickSpot={handleClickSpot}
    />
  </>)
}

const ConditionInput = ({ handleDesiredArrivalTime, handleStayTime, handleSpecifiedWaitTime, editing, handleSwitches }) => {
  const switchLabels = [
    'スタンバイパスを使用する',
    '入店時刻を指定する',
    '到着時刻を指定する'
  ]
  const desiredArrivalTimeLabels = [
    'スタンバイパス指定時刻',
    '入店時刻',
    '到着時刻'
  ]

  return (<>
    <Text>{editing.name}</Text>
    {(editing.tab === 0 || editing.tab === 1 || editing.tab === 4) && <>
      <ConditionSwitch
        control={<Switch checked={editing.checkedDesiredArrivalTime} color="primary" onChange={handleSwitches} name="checkedDesiredArrivalTime" />}
        label={<Text color="textSecondary">{switchLabels[editing.tab]}</Text>}
      />
      <Collapse in={editing.checkedDesiredArrivalTime}>
        <DesiredArrivalTimePicker
          margin="normal"
          label={desiredArrivalTimeLabels[editing.tab]}
          format="HH:mm"
          value={editing.desiredArrivalTime}
          onChange={handleDesiredArrivalTime}
          okLabel="決定"
          cancelLabel="キャンセル"
          fullWidth
        />
      </Collapse>
    </>}
    {(editing.tab === 1 || editing.tab === 2) && <>
      <ConditionSwitch
        control={<Switch checked={editing.checkedStayTime} color="primary" onChange={handleSwitches} name="checkedStayTime" />}
        label={<Text color="textSecondary">滞在時間を指定する</Text>}
      />
      <Collapse in={editing.checkedStayTime}>
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
    {editing.tab === 3 && <>
      <ConditionSwitch
        control={<Switch checked={editing.checkedSpecifiedWaitTime} color="primary" onChange={handleSwitches} name="checkedSpecifiedWaitTime" />}
        label={<Text color="textSecondary">余裕をもって到着する</Text>}
      />
      <Collapse in={editing.checkedSpecifiedWaitTime}>
        <SpecifiedWaitTimeSelect
          label="分前に到着"
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

const SpotList = ({ obj, editing, handleClickSpot }) => {
  return (
    <CustomList>
      {obj.filter(spot => spot.name.indexOf(editing.keyword) > -1).map((spot, index) => (
        <ListItem
          key={index}
          button
          onClick={handleClickSpot(spot)}
          selected={editing.name === spot.name}
        >
          <ListItemText primary={spot.name} />
        </ListItem>
      ))}
    </CustomList>
  )
}