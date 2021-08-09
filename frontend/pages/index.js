import styled from 'styled-components'
import { Box, Button, IconButton, MenuItem, TextField, Typography } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { useState } from 'react'
import { SpotListDialog } from '../components/SpotListDialog'
import { TimePicker } from '@material-ui/pickers';
import { assoc, remove } from 'ramda'
import { formatDateTime, toKebabCaseObject } from '../utils'
import { useRouter } from 'next/router'
import { useGetSpotList } from '../hooks'
import { Loading } from '../components/Loading'

const Wrap = styled(Box)`
  display: flex;
  flex-direction: column;
`

const Text = styled(Typography)`
`

const SpotButton = styled(Button)`
  margin: 16px 0 0;
  flex-grow: 1;
`

const PlusButton = styled(Button)`
  margin: 16px 0 0;
`

const Condition = styled(Box)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const ConditionTimePicker = styled(TimePicker)`
  flex-basis: 30%;
`

const ConditionWaitTimeModeSelect = styled(TextField)`
  flex-basis: 65%;
  margin: 16px 0 8px;
`

const ConditionWalkSpeedSelect = styled(TextField)`
  flex-basis: 30%;
  margin: 16px 0 8px;
`

const ConditionOptimizeOpotOrder = styled(TextField)`
  flex-basis: 65%;
  margin: 16px 0 8px;
`

const SearchButton = styled(Button)`
  margin: 16px 0 0;
`

const Spot = styled(Box)`
  display: flex;
  position: relative;
`

const DeleteButton = styled(IconButton)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  margin: 8px 0 0;
  padding: 8px;
`

const initialEditing = {
  spotId: null,
  name: '',
  shortName: '',
  desiredArrivalTime: null,
  startTime: null,
  stayTime: '',
  specifiedWaitTime: '',
  checkedDesiredArrivalTime: false,
  checkedStayTime: false,
  checkedSpecifiedWaitTime: false,
  step: 0,
  tab: 0,
  keyword: ''
}

const spotInterface = [
  'spotId',
  'desiredArrivalTime',
  'stayTime',
  'specifiedWaitTime'
]

const Home = () => {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState({})
  const [spots, setSpots] = useState([])
  const [selected, setSelected] = useState(-1)
  const [specifiedTime, setSpecifiedTime] = useState(new Date())
  const [waitTimeMode, setWaitTimeMode] = useState('real')
  const [walkSpeed, setWalkSpeed] = useState('normal')
  const [optimizeSpotOrder, setOptimizeSpotOrder] = useState("false")
  const router = useRouter()
  const { spotList, error } = useGetSpotList()

  if (error) return <Text>{error}</Text>
  if (!spotList) return <Loading />
  const handleOpen = (spot, index) => () => {
    setEditing(spot)
    setSelected(index)
    setOpen(true)
  }

  const handleSpecifiedTime = (date) => {
    setSpecifiedTime(date);
  }

  const handleWaitTimeMode = (event) => {
    setWaitTimeMode(event.target.value)
  }

  const handleWalkSpeed = (event) => {
    setWalkSpeed(event.target.value)
  }

  const handleOptimizeSpotOrder = (event) => {
    setOptimizeSpotOrder(event.target.value)
  }

  const handleDelete = (index) => (event) => {
    setSpots(remove(index, 1, spots))
  }

  const modifySpots = (spots) => {
    return spots.map(spot => {
      return Object.keys(spot).filter(key => spotInterface.includes(key)).reduce((acc, cur) => {
        if (cur === 'spotId') {
          return assoc(cur, spot[cur], acc)
        }
        else if (spot[cur]) {
          return assoc(cur, cur === 'desiredArrivalTime' ? formatDateTime(spot[cur]) : spot[cur], acc)
        }
        else {
          return acc
        }
      }, {})
    })
  }

  const handleSearch = () => {
    router.push({
      pathname: '/search',
      query: {
        param: encodeURI(JSON.stringify(toKebabCaseObject({
          waitTimeMode: waitTimeMode,
          specifiedTime: formatDateTime(specifiedTime),
          walkSpeed: walkSpeed,
          optimizeSpotOrder: optimizeSpotOrder,
          startSpotId: 103,
          goalSpotId: 103,
          spots: modifySpots(spots)
        })))
      }
    })
  }

  return (
    <Wrap>
      <Text>回りたいスポットを入れてね</Text>
      {spots.map((spot, index) =>
        <Spot key={index}>
          <SpotButton
            variant="outlined"
            color="primary"
            onClick={handleOpen(spot, index)}
          >
            {spot.shortName}
          </SpotButton>
          <DeleteButton onClick={handleDelete(index)}>
            <Close />
          </DeleteButton>
        </Spot>
      )}
      <PlusButton
        variant="outlined"
        color="secondary"
        onClick={handleOpen(initialEditing, -1)}
      >
        追加
      </PlusButton>
      <SpotListDialog
        spotList={spotList}
        editing={editing}
        selected={selected}
        open={open}
        spots={spots}
        setEditing={setEditing}
        setOpen={setOpen}
        setSpots={setSpots}
        setIndex={setSelected}
      />
      <Condition>
        <ConditionTimePicker
          margin="normal"
          label="時間"
          format="HH:mm"
          value={specifiedTime}
          onChange={handleSpecifiedTime}
          okLabel="決定"
          cancelLabel="キャンセル"
        />
        <ConditionWaitTimeModeSelect
          label="待ち時間"
          value={waitTimeMode}
          onChange={handleWaitTimeMode}
          select
        >
          <MenuItem value="real">リアルタイム待ち時間</MenuItem>
          <MenuItem value="mean">平均待ち時間</MenuItem>
        </ConditionWaitTimeModeSelect>
        <ConditionWalkSpeedSelect
          label="歩く速度"
          value={walkSpeed}
          onChange={handleWalkSpeed}
          select
        >
          <MenuItem value="slow">ゆっくり</MenuItem>
          <MenuItem value="normal">ふつう</MenuItem>
          <MenuItem value="fast">せかせか</MenuItem>
        </ConditionWalkSpeedSelect>
        <ConditionOptimizeOpotOrder
          label="スポットをめぐる順番"
          value={optimizeSpotOrder}
          onChange={handleOptimizeSpotOrder}
          select
        >
          <MenuItem value={"false"}>選んだ順にめぐる</MenuItem>
          <MenuItem value={"true"}>効率よくめぐる</MenuItem>
        </ConditionOptimizeOpotOrder>
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