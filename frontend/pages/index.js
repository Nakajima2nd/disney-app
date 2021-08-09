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
  padding: 8px;
  margin: 8px auto;
  max-width: 800px;
  background-color: white;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 816px) {
    margin: 8px;
  }
`

const Text = styled(Typography)`
`

const Title = styled(Typography)`
  text-align: center;
  margin: 32px 0 0;
  font-size: 3rem;
  font-weight: bold;
`

const Caption = styled(Typography)`
  text-align: center;
  font-size: 1.1rem;
  width: max-content;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.5);
`
const Minnie = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  padding: 0 0 0 20%;
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
  display: flex;
  margin: 20vw auto 32px;
  width: 30vw;
  height: 30vw;
  border-radius: 50%;
  position: relative;
  background-color: rgba(245,226,196,1);
  color: white;
  font-size: 1.5rem;
  transition: 0.5s;
  max-width: 240px;
  max-height: 240px;
  &::before {
    transition: 0.5s;
    width: 20vw;
    height: 20vw;
    border-radius: 50%;
    position: absolute;
    right: -33%;
    top: -50%;
    content: '';
    background-color: rgba(245,226,196,1);
    max-width: 160px;
    max-height: 160px;
  }
  &::after {
    transition: 0.5s;
    width: 20vw;
    height: 20vw;
    border-radius: 50%;
    position: absolute;
    left: -33%;
    top: -50%;
    content: '';
    background-color: rgba(245,226,196,1);
    max-width: 160px;
    max-height: 160px;
  }
  &:hover {
    transition: 0.5s;
    background-color: rgba(209,223,210,1);
    color: white;
    &::after {
      transition: 0.5s;
      background-color: rgba(209,223,210,1);
    }
    &::before {
      transition: 0.5s;
      background-color: rgba(209,223,210,1);
    }
  }
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
  const [condition, setCondition] = useState({
    specifiedTime: new Date(),
    waitTimeMode: 'real',
    walkSpeed: 'normal',
    optimizeSpotOrder: 'false'
  })
  const router = useRouter()
  const { spotList, error } = useGetSpotList()

  if (error) return <Text>{error}</Text>
  if (!spotList) return <Loading />
  const handleOpen = (spot, index) => () => {
    setEditing(spot)
    setSelected(index)
    setOpen(true)
  }

  const handleDateTime = (key) => (date) => {
    setCondition(assoc(key, date, condition))
  }

  const handleSelect = (key) => (event) => {
    setCondition(assoc(key, event.target.value, condition))
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
          ...assoc('specifiedTime', formatDateTime(condition.specifiedTime), condition),
          startSpotId: 103,
          goalSpotId: 103,
          spots: modifySpots(spots)
        })))
      }
    })
  }

  return (<>
    {/* タイトル */}
    <Title>ディズニープラン</Title>
    <Caption>TDRをめぐる計画を立てるお役立ちアプリです！</Caption>

    {/* ミニーの画像 */}
    <Minnie
      src="/minnie/minnie_01.png"
      alt="ミニーの画像"
    />

    <Wrap>
      {/* 選択済みスポット一覧 */}
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

      {/* 条件入力 */}
      <Condition>
        <ConditionTimePicker
          margin="normal"
          label="時間"
          format="HH:mm"
          value={condition.specifiedTime}
          onChange={handleDateTime('specifiedTime')}
          okLabel="決定"
          cancelLabel="キャンセル"
        />
        <ConditionWaitTimeModeSelect
          label="待ち時間"
          value={condition.waitTimeMode}
          onChange={handleSelect('waitTimeMode')}
          select
        >
          <MenuItem value="real">リアルタイム待ち時間</MenuItem>
          <MenuItem value="mean">平均待ち時間</MenuItem>
        </ConditionWaitTimeModeSelect>
        <ConditionWalkSpeedSelect
          label="歩く速度"
          value={condition.walkSpeed}
          onChange={handleSelect('walkSpeed')}
          select
        >
          <MenuItem value="slow">ゆっくり</MenuItem>
          <MenuItem value="normal">ふつう</MenuItem>
          <MenuItem value="fast">せかせか</MenuItem>
        </ConditionWalkSpeedSelect>
        <ConditionOptimizeOpotOrder
          label="スポットをめぐる順番"
          value={condition.optimizeSpotOrder}
          onChange={handleSelect('optimizeSpotOrder')}
          select
        >
          <MenuItem value={"false"}>選んだ順にめぐる</MenuItem>
          <MenuItem value={"true"}>効率よくめぐる</MenuItem>
        </ConditionOptimizeOpotOrder>
      </Condition>
    </Wrap>

    {/* 検索ボタン */}
    <SearchButton
      onClick={handleSearch}
      variant="text"
    >
      検索
    </SearchButton>

    {/* スポット選択ダイアログ */}
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
  </>)
}

export default Home