import styled from 'styled-components'
import { Avatar, Box, Button, Card, Collapse, Grow, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, MenuItem, Paper, Select, Typography } from '@material-ui/core'
import { Close, FiberManualRecord } from '@material-ui/icons'
import { useState } from 'react'
import { SpotListDialog } from '../components/SpotListDialog'
import { TimePicker } from '@material-ui/pickers';
import { assoc, dissoc, remove, pipe, update } from 'ramda'
import { formatDateTime, parseDateTime, toKebabCaseObject } from '../utils'
import { useRouter } from 'next/router'
import { useGetSpotList } from '../hooks'
import { Loading } from '../components/Loading'
import { useRecoilState } from 'recoil'
import { searchInputState } from '../atoms/searchInput'
import { useEffect } from 'react'
import Head from 'next/head'

const Wrap = styled(Box)`
  margin: auto;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  /* @media screen and (max-width: 816px) {
    margin: 0 8px;
  } */
`

const Text = styled(Typography)`
`

const DescriptionList = styled(List)`
  margin: 16px 0 0;
  padding: 16px 8px;
  background-color: white;
`

const DescriptionListItem = styled(ListItem)`
  display: flex;
  align-items: center;
  padding: 0;
`

const DescriptionListItemIcon = styled(ListItemIcon)`
  min-width: 16px;
  width: 16px;
`

const DescriptionListItemText = styled(Typography)`
  font-size: 0.9rem;
`

const CustomList = styled(List)`
  margin: 16px 8px 0;
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

const Conditions = styled(Card)`
  margin: 16px 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-content: space-around;
  // 本当はgapを使いたいが、新しいプロパティなので様子見
  /* gap: 16px; */
`

const Condition = styled(Box)`
  flex-basis: calc(50% - 8px);
  :nth-child(n + 3) {
    margin-top: 16px;
  }
`

const Label = styled(Typography)`
  font-size: 0.8rem;
`

const ConditionTimePicker = styled(TimePicker)`
  margin: 0;
  background-color: white;
`

const ConditionStartTodaySelect = styled(Select)`
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
  padding: 0;
  color: ${props => props.theme.palette.close.main};
`

const SearchButton = styled(Button)`
  margin: 16px 0 0;
  font-size: 1.3rem;
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
  tab: 'attraction',
  keyword: '',
  enter: true
}

const initialStart = pipe(
  assoc('spotId', 103),
  assoc('shortName', 'サウス・エントランス'),
  assoc('tab', 'place')
)(initialEditing)

const initialGoal = pipe(
  assoc('spotId', 103),
  assoc('shortName', 'サウス・エントランス'),
  assoc('tab', 'place')
)(initialEditing)

const initialCondition = {
  specifiedTime: new Date(),
  startToday: 'true',
  walkSpeed: 'normal',
  optimizeSpotOrder: 'true'
}

const Home = () => {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState({})
  const [spots, setSpots] = useState([])
  const [start, setStart] = useState(initialStart)
  const [goal, setGoal] = useState(initialGoal)
  const [selected, setSelected] = useState(-1)
  const [condition, setCondition] = useState(initialCondition)
  const router = useRouter()
  const { spotList, error } = useGetSpotList()
  const [searchInput, setSearchInput] = useRecoilState(searchInputState)

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

  // todo: スタート地点、ゴール地点をショーにした場合、開始時間の考慮はどうするのか
  const handleSearch = () => {
    const query = {
      'startSpotId': start.spotId,
      'goalSpotId': goal.spotId,
      'specifiedTime': formatDateTime(condition.specifiedTime),
      'spotIds': spots.length !== 0 ? spots.map(spot => String(spot.spotId)).join('_') : 'none',
      'walkSpeed': initialCondition.walkSpeed !== condition.walkSpeed ? condition.walkSpeed : 'none',
      'optimizeSpotOrder': initialCondition.optimizeSpotOrder !== condition.optimizeSpotOrder ? condition.optimizeSpotOrder : 'none',
      'startToday': initialCondition.startToday !== condition.startToday ? condition.startToday : 'none',
      'desiredArrivalTimes': spots.filter(spot => spot.desiredArrivalTime).length > 0 ? spots.map(spot => formatDateTime(spot.desiredArrivalTime)).join('_') : 'none',
      'stayTimes': spots.filter(spot => spot.stayTime).length > 0 ? spots.map(spot => spot.stayTime).join('_') : 'none',
      'specifiedWaitTimes': spots.filter(spot => spot.specifiedWaitTime).length > 0 ? spots.map(spot => spot.specifiedWaitTime).join('_') : 'none'
    }

    const queeeery = Object.keys(query).reduce((acc, cur) => {
      return query[cur] === 'none' ? dissoc(cur, acc) : acc
    }, query)

    router.push({
      pathname: '/search',
      query: toKebabCaseObject(queeeery)
    })
  }

  // todo: スタート地点、ゴール地点をショーにした場合、開始時間の考慮はどうするのか
  const parseSearchInput = (searchInput) => {
    // スタート地点
    Object.entries(spotList).some(([key, value]) => {
      const spot = value.find(spot => String(spot.spotId) === searchInput.startSpotId)
      if (spot) {
        setStart(pipe(
          assoc('tab', key),
          assoc('keyword', ''),
          assoc('step', 0)
        )(spot))
        return true
      }
    })

    // ゴール地点
    Object.entries(spotList).some(([key, value]) => {
      const spot = value.find(spot => String(spot.spotId) === searchInput.goalSpotId)
      if (spot) {
        setGoal(pipe(
          assoc('tab', key),
          assoc('keyword', ''),
          assoc('step', 0)
        )(spot))
        return true
      }
    })

    // スポット
    if (searchInput.spotIds) {
      const spots = searchInput.spotIds.split('_').reduce((acc, cur, index) => {
        Object.entries(spotList).some(([key, value]) => {
          const spot = value.find(spot => String(spot.spotId) === cur)
          if (spot) {
            const desiredArrivalTime = searchInput.desiredArrivalTimes ? searchInput.desiredArrivalTimes.split('_')[index] : null
            const checkedDesiredArrivalTime = desiredArrivalTime ? true : false
            const stayTime = searchInput.stayTimes ? searchInput.stayTimes.split('_')[index] : null
            const checkedStayTime = stayTime ? true : false
            const specifiedWaitTime = searchInput.specifiedWaitTimes ? searchInput.specifiedWaitTimes.split('_')[index] : null
            const checkedSpecifiedWaitTime = specifiedWaitTime ? true : false
            const name = key === 'show' ? spot.name.replace(/\(((0?[0-9]|1[0-9])|2[0-3]):[0-5][0-9]\)$/, `(${desiredArrivalTime})`) : spot.name
            const shortName = key === 'show' ? spot.shortName.replace(/\(((0?[0-9]|1[0-9])|2[0-3]):[0-5][0-9]\)$/, `(${desiredArrivalTime})`) : spot.shortName
            const startTime = key === 'show' ? desiredArrivalTime : spot.startTime

            // todo: /page/indexとhandleClickSpotとhandleCheckboxで似たような記述が必要なのをどうにかする
            const spppot = pipe(
              assoc('spotId', spot.spotId),
              assoc('name', name),
              assoc('shortName', shortName),
              assoc('startTime', startTime),
              assoc('tab', key),
              assoc('display', true),
              assoc('step', 1),
              assoc('desiredArrivalTime', parseDateTime(desiredArrivalTime)),
              assoc('checkedDesiredArrivalTime', checkedDesiredArrivalTime),
              assoc('stayTime', stayTime),
              assoc('checkedStayTime', checkedStayTime),
              assoc('specifiedWaitTime', specifiedWaitTime),
              assoc('checkedSpecifiedWaitTime', checkedSpecifiedWaitTime),
              assoc('timespanMeanWaitTime', spot.timespanMeanWaitTime),
              assoc('waitTime', spot.waitTime),
              assoc('url', spot.url),
              assoc('description', spot.description),
            )(initialEditing)
            acc.push(spppot)
            return true
          }
        })
        return acc
      }, [])
      setSpots(spots)
    }

    // 検索条件
    const condition = Object.keys(initialCondition).reduce((acc, cur) => {
      if (searchInput[cur]) {
        if (cur === 'specifiedTime') {
          return assoc(cur, parseDateTime(searchInput[cur]), acc)
        }
        else {
          return assoc(cur, searchInput[cur], acc)
        }
      }
      return acc
    }, initialCondition)
    setCondition(condition)

  }

  useEffect(() => {
    if (searchInput && spotList) {
      parseSearchInput(searchInput)
    }
  }, [searchInput, spotList])

  return (<>

    {!spotList && <Loading />}

    <Wrap>
      <Head>
        <title>TDS計画ツール|ディズニープラン</title>
        <meta property="og:title" content="TDS計画ツール|ディズニープラン" />
        <meta property="og:description" content="ディズニーランド・シーを効率よくめぐる計画をたてるwebアプリです！リアルタイム待ち時間を考慮しています！" />
        <meta property="og:image" content="/og.png" />
      </Head>
      {/* 説明文 */}
      <DescriptionList>
        <DescriptionListItem>
          <DescriptionListItemIcon><FiberManualRecord color="primary" style={{ fontSize: 12 }} /></DescriptionListItemIcon>
          <DescriptionListItemText>TDL・TDSを効率よくめぐる順番を計算するツールです</DescriptionListItemText>
        </DescriptionListItem>
        <DescriptionListItem>
          <DescriptionListItemIcon><FiberManualRecord color="primary" style={{ fontSize: 12 }} /></DescriptionListItemIcon>
          <DescriptionListItemText>リアルタイム待ち時間にも対応</DescriptionListItemText>
        </DescriptionListItem>
      </DescriptionList>

      {/* 選択済みスポット一覧 */}
      <CustomList component={Paper} >

        {/* スタート */}
        <CustomListItem button divider onClick={handleOpen(start, -2)} disabled={!spotList}>
          <ListItemAvatar>
            <StartAvatar variant="rounded">出発</StartAvatar>
          </ListItemAvatar>
          <Grow in={selected !== -2 || !open} timeout={1000}>
            <ListItemText>{start.shortName}</ListItemText>
          </Grow>
        </CustomListItem>

        {/* 選択済みスポット */}
        {spots.map((spot, index) =>
          <Collapse in={spot.display} key={index} enter={spot.enter}>
            <CustomListItem key={index} button onClick={handleOpen(spot, index)} divider>
              <ListItemAvatar>
                <ViaAvatar variant="rounded">経由</ViaAvatar>
              </ListItemAvatar>
              <Grow in={selected !== index || !open} timeout={1000}>
                <ListItemText>{spot.shortName}</ListItemText>
              </Grow>
              <ListItemSecondaryAction>
                <DeleteButton onClick={handleDelete(index)}>
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
          <Grow in={true} timeout={1000}>
            <ListItemText>スポットを追加</ListItemText>
          </Grow>
        </CustomListItem>

        {/* ゴール */}
        <CustomListItem button onClick={handleOpen(goal, -3)} disabled={!spotList}>
          <ListItemAvatar>
            <GoalAvatar variant="rounded">到着</GoalAvatar>
          </ListItemAvatar>
          <Grow in={selected !== -3 || !open} timeout={1000}>
            <ListItemText>{goal.shortName}</ListItemText>
          </Grow>
        </CustomListItem>
      </CustomList>

      {/* 検索条件 */}
      <Conditions>
        <Condition>
          <Label>入園日</Label>
          <ConditionStartTodaySelect
            value={condition.startToday}
            onChange={handleSelect('startToday')}
            fullWidth
          // variant="outlined"
          >
            <MenuItem value="true">本日！</MenuItem>
            <MenuItem value="false">べつの日</MenuItem>
          </ConditionStartTodaySelect>
        </Condition>
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
            <MenuItem value={"true"}>効率よくめぐる</MenuItem>
            <MenuItem value={"false"}>選んだ順にめぐる</MenuItem>
          </ConditionOptimizeSpotOrderSelect>
        </Condition>

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
      </Conditions>

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
      setStart={setStart}
      setGoal={setGoal}
    />
  </>)
}

export default Home