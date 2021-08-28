import styled from 'styled-components'
import { Avatar, Box, Button, ButtonGroup, Collapse, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, MenuItem, Paper, Select, TextField, Typography } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { useState } from 'react'
import { SpotListDialog } from '../components/SpotListDialog'
import { TimePicker } from '@material-ui/pickers';
import { assoc, remove, update } from 'ramda'
import { formatDateTime, toKebabCaseObject } from '../utils'
import { useRouter } from 'next/router'
import { useGetSpotList } from '../hooks'
import { Loading } from '../components/Loading'

const Wrap = styled(Box)`
  padding: 8px;
  margin: 8px auto;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 816px) {
    margin: 0 8px;
  }
`

const Ad = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
`

const Caption = styled(Box)`
  margin: 24px 0 0;
`

const Text = styled(Typography)`
`

const SwitchButtons = styled(ButtonGroup)`
  margin: 24px 0 0;
`

const Land = styled(Button)`
`

const Sea = styled(Button)`
`

const CustomList = styled(List)`
  margin: 24px 0 0;
`

const CustomListItem = styled(ListItem)`
`

const CustomAvatar = styled(Avatar)`
  height: 24px;
`

const StartAvatar = styled(CustomAvatar)`
  background-color: ${(props) => props.theme.palette.start.main};
  color: white;
`

const ViaAvatar = styled(CustomAvatar)`
`

const GoalAvatar = styled(CustomAvatar)`
  background-color: ${(props) => props.theme.palette.goal.main};
  color: white;
`

const Conditions = styled(Box)`
  margin: 12px 0 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const Condition = styled(Box)`
  margin: 4px 0 0;
  flex-basis: 48%;
`

const Label = styled(Typography)`
`

const ConditionTimePicker = styled(TimePicker)`
  margin: 0;
  background-color: white;
`

const ConditionWaitTimeModeSelect = styled(Select)`
  background-color: white;
`

const ConditionWalkSpeedSelect = styled(Select)`
  background-color: white;
`

const ConditionOptimizeSpotOrderSelect = styled(Select)`
  background-color: white;
`

const DeleteButton = styled(IconButton)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  padding: 8px;
`

const SearchButton = styled(Button)`
  margin: 24px 0 0;
  font-size: 18px;
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
  keyword: '',
  enter: true
}

const spotInterface = [
  'spotId',
  'desiredArrivalTime',
  'stayTime',
  'specifiedWaitTime'
]

const Home = ({ src }) => {
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

  const handleDelete = (index) => async (event) => {
    const newSpots = update(index, assoc('display', false, spots[index]), spots)
    const newNewSpots = index < spots.length - 1 ? update(index + 1, assoc('enter', false, spots[index + 1]), newSpots) : newSpots
    setSpots(newNewSpots)
    await new Promise(resolve => setTimeout(resolve, 200))
    setSpots(remove(index, 1, newNewSpots))
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

    {!spotList && <Loading />}

    <Wrap>

      {/* 広告 */}
      <Ad src={src} alt="広告" />

      {/* 説明文 */}
      <Caption>
        <Text>TDL・TDSを効率よくめぐる順番を計算するツールです♪</Text>
        <Text>リアルタイム待ち時間にも対応◎</Text>
      </Caption>

      {/* ランド/シー切り替えボタン */}
      <SwitchButtons variant="contained" fullWidth>
        <Land>ディズニーランド</Land>
        <Sea color="primary">ディズニーシー</Sea>
      </SwitchButtons>

      {/* 選択済みスポット一覧 */}
      <CustomList component={Paper} >

        {/* スタート */}
        <CustomListItem button divider>
          <ListItemAvatar>
            <StartAvatar variant="rounded">出発</StartAvatar>
          </ListItemAvatar>
          <ListItemText>サウス・エントランス</ListItemText>
        </CustomListItem>

        {/* 選択済みスポット */}
        {spots.map((spot, index) =>
          <Collapse in={spot.display} key={index} enter={spot.enter}>
            <CustomListItem key={index} button onClick={handleOpen(spot, index)} divider>
              <ListItemAvatar>
                <ViaAvatar variant="rounded">経由</ViaAvatar>
              </ListItemAvatar>
              <ListItemText>{spot.shortName}</ListItemText>
              <ListItemSecondaryAction>
                <DeleteButton onClick={handleDelete(index)} color="secondary">
                  <Close />
                </DeleteButton>
              </ListItemSecondaryAction>
            </CustomListItem>
          </Collapse>
        )}

        {/* スポット追加 */}
        <CustomListItem button onClick={handleOpen(initialEditing, -1)} divider disabled={!spotList}>
          <ListItemAvatar>
            <ViaAvatar variant="rounded">経由</ViaAvatar>
          </ListItemAvatar>
          <ListItemText>スポットを追加</ListItemText>
        </CustomListItem>

        {/* ゴール */}
        <CustomListItem button>
          <ListItemAvatar>
            <GoalAvatar variant="rounded">到着</GoalAvatar>
          </ListItemAvatar>
          <ListItemText>サウス・エントランス</ListItemText>
        </CustomListItem>
      </CustomList>

      {/* 検索条件 */}
      <Conditions>
        <Condition>
          <Label>出発時刻</Label>
          <ConditionTimePicker
            margin="normal"
            format="HH:mm"
            value={condition.specifiedTime}
            onChange={handleDateTime('specifiedTime')}
            okLabel="決定"
            cancelLabel="キャンセル"
            fullWidth
          // inputVariant="outlined"
          />
        </Condition>
        <Condition>
          <Label>待ち時間</Label>
          <ConditionWaitTimeModeSelect
            value={condition.waitTimeMode}
            onChange={handleSelect('waitTimeMode')}
            fullWidth
          // variant="outlined"
          >
            <MenuItem value="real">リアルタイム待ち時間</MenuItem>
            <MenuItem value="mean">平均待ち時間</MenuItem>
          </ConditionWaitTimeModeSelect>
        </Condition>
        <Condition>
          <Label>歩く速度</Label>
          <ConditionWalkSpeedSelect
            value={condition.walkSpeed}
            onChange={handleSelect('walkSpeed')}
            fullWidth
          // variant="outlined"
          >
            <MenuItem value="slow">ゆっくり</MenuItem>
            <MenuItem value="normal">ふつう</MenuItem>
            <MenuItem value="fast">せかせか</MenuItem>
          </ConditionWalkSpeedSelect>
        </Condition>
        <Condition>
          <Label>スポットを巡る順番</Label>
          <ConditionOptimizeSpotOrderSelect
            value={condition.optimizeSpotOrder}
            onChange={handleSelect('optimizeSpotOrder')}
            fullWidth
          // variant="outlined"
          >
            <MenuItem value={"false"}>選んだ順にめぐる</MenuItem>
            <MenuItem value={"true"}>効率よくめぐる</MenuItem>
          </ConditionOptimizeSpotOrderSelect>
        </Condition>
      </Conditions>

      {/* 検索ボタン */}
      <SearchButton
        onClick={handleSearch}
        variant="contained"
        color="primary"
        fullWidth
        disabled={!spotList}
      >
        検索
      </SearchButton>
    </Wrap>

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

export function getServerSideProps() {
  const min = Math.ceil(1)
  const max = Math.floor(14)
  const num = Math.floor(Math.random() * (max - min + 1) + min)
  const src = '/minnie/minnie_' + ('00' + num).slice(-2) + '.png'
  return { props: { src } }
}

export default Home