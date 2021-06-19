import styled from 'styled-components'
import { Box, Button, MenuItem, TextField, Typography } from '@material-ui/core'
import { useState } from 'react'
import { SpotListDialog } from '../components/SpotListDialog'
import { DatePicker, TimePicker } from '@material-ui/pickers';

const Wrap = styled(Box)`
  display: flex;
  flex-direction: column;
`

const Text = styled(Typography)`
`

const SpotButton = styled(Button)`
  margin: 16px 0 0;
`

const PlusButton = styled(Button)`
  margin: 16px 0 0;
`

const Condition = styled(Box)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const ConditionDatePicker = styled(DatePicker)`
  flex-basis: 20%;
`

const ConditionTimePicker = styled(TimePicker)`
  flex-basis: 30%;
`

const ConditionTimeModeSelect = styled(TextField)`
  flex-basis: 30%;
  margin: 16px 0 8px;
`

const ConditionWalkSpeedSelect = styled(TextField)`
  flex-basis: 30%;
  margin: 16px 0 8px;
`

const SearchButton = styled(Button)`
  margin: 16px 0 0;
`

const initialEditing = {
  spotId: null,
  name: '',
  desiredArrivalTime: null,
  stayTime: 0
}

// const initialSpot = {
//   spotId: 102,
//   name: 'パークエントランス・ノース・チケットブース'
// }

const Home = () => {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState({})
  // const [startSpot, setStartSpot] = useState(initialSpot)
  // const [goalSpot, setGoalSpot] = useState(initialSpot)
  const [spots, setSpots] = useState([])
  const [selected, setSelected] = useState(-1)
  const [date, setDate] = useState(new Date())
  const [timeMode, setTimeMode] = useState('start')
  const [walkSpeed, setWalkSpeed] = useState('normal')

  const handleOpen = (spot, index) => () => {
    setEditing(spot)
    setSelected(index)
    setOpen(true)
  }

  const handleDate = (date) => {
    setDate(date);
  }

  const handleTimeMode = (event) => {
    setTimeMode(event.target.value)
  }

  const handleWalkSpeed = (event) => {
    setWalkSpeed(event.target.value)
  }

  const handleSearch = () => {
    console.log('検索')
  }

  return (
    <Wrap>
      <Text>回りたいスポットを入れてね</Text>
      {/* <SpotButton
        variant="outlined"
        color="primary"
        onClick={handleOpen(startSpot, -3)}
      >
        {startSpot.name}
      </SpotButton> */}
      {spots.map((spot, index) =>
        <SpotButton
          key={index}
          variant="outlined"
          color="primary"
          onClick={handleOpen(spot, index)}
        >
          {spot.name}
        </SpotButton>
      )}
      <PlusButton
        variant="outlined"
        color="secondary"
        onClick={handleOpen(initialEditing, -1)}
      >
        追加
      </PlusButton>
      {/* <SpotButton
        variant="outlined"
        color="primary"
        onClick={handleOpen(goalSpot, -2)}
      >
        {goalSpot.name}
      </SpotButton> */}
      <SpotListDialog
        editing={editing}
        selected={selected}
        open={open}
        spots={spots}
        setEditing={setEditing}
        setOpen={setOpen}
        setSpots={setSpots}
        setIndex={setSelected}
        // setStartSpot={setStartSpot}
        // setGoalSpot={setGoalSpot}
      />
      <Condition>
        {/* <ConditionDatePicker
          margin="normal"
          label="日付"
          format="MM/dd"
          value={date}
          onChange={handleDate}
          okLabel="決定"
          cancelLabel="キャンセル"
        /> */}
        <ConditionTimePicker
          margin="normal"
          label="時間"
          format="HH:mm"
          value={date}
          onChange={handleDate}
          okLabel="決定"
          cancelLabel="キャンセル"
        />
        <ConditionTimeModeSelect
          label="出発/到着"
          value={timeMode}
          onChange={handleTimeMode}
          select
        >
          <MenuItem value="start">出発</MenuItem>
          <MenuItem value="end">到着</MenuItem>
        </ConditionTimeModeSelect>
        <ConditionWalkSpeedSelect
          label="歩く速度"
          value={walkSpeed}
          onChange={handleWalkSpeed}
          select
        >
          <MenuItem value="slow">ゆっくり</MenuItem>
          <MenuItem value="normal">ふつう</MenuItem>
          <MenuItem value="fast">はやい</MenuItem>
        </ConditionWalkSpeedSelect>
      </Condition>
      <SearchButton
        onClick={handleSearch}
        variant="contained"
        color="primary"
      >
        検索
      </SearchButton>
    </Wrap>
  )
}

export default Home