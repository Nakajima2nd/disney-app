import styled from 'styled-components'
import { Box, FormControlLabel, MenuItem, Switch, TextField, Typography, Collapse, Link, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core'
import { FiberManualRecord, OpenInNew } from '@material-ui/icons'
import { TimePicker } from '@material-ui/pickers'
import { WaitTimeChart } from './charts/WaitTimeChart'

const Wrap = styled(Box)`
  padding: 0 16px;
`

const Name = styled(Typography)`
  font-size: 1.0rem;
  font-weight: bold;
`

const DescriptionList = styled(List)`
  margin-top: 16px;
  list-style: circle;
`

const DescriptionListItem = styled(ListItem)`
  display: flex;
  align-items: center;
  padding: 0;
  margin-top: 16px;
`

const CustomListItemIcon = styled(ListItemIcon)`
  min-width: 16px;
  width: 16px;
`

const CustomListItemText = styled(Typography)`
  font-size: 0.9rem;
`

const CustomLink = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
`

const ChartWrap = styled(Box)`
  margin-top: 16px;
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

export const ConditionInput = ({ handleDesiredArrivalTime, handleStayTime, handleSpecifiedWaitTime, editing, handleSwitches }) => {
  const switchLabels = {
    attraction: 'スタンバイパスを使用する',
    restaurant: '入店時刻を指定する',
    place: '到着時刻を指定する',
    greeting: '到着時刻を指定する'
  }
  const inputLables = {
    attraction: 'スタンバイパス指定時刻',
    restaurant: '入店時刻',
    place: '到着時刻',
    greeting: '到着時刻'
  }

  return (
    <Wrap>
      <Name color="primary">{editing.name}</Name>
      <DescriptionList>
        <DescriptionListItem>
          <CustomListItemIcon><FiberManualRecord color="primary" style={{ fontSize: 12 }} /></CustomListItemIcon>
          <CustomListItemText>{editing.description}</CustomListItemText>
        </DescriptionListItem>
        <DescriptionListItem>
          <CustomListItemIcon><FiberManualRecord color="primary" style={{ fontSize: 12 }} /></CustomListItemIcon>
          <CustomLink href={editing.url} target="_blank" rel="noopener">
            公式ページ<OpenInNew />
          </CustomLink>
        </DescriptionListItem>
      </DescriptionList>
      {editing.timespanMeanWaitTime && Object.keys(editing.timespanMeanWaitTime).length > 0 &&
        <ChartWrap>
          <WaitTimeChart
            timespanMeanWaitTime={editing.timespanMeanWaitTime}
            waitTime={editing.waitTime}
          />
        </ChartWrap>
      }
      {(editing.tab === 'attraction' || editing.tab === 'restaurant' || editing.tab === 'place' || editing.tab === 'greeting') && <>
        <ConditionSwitch
          control={<Switch checked={editing.checkedDesiredArrivalTime} color="primary" onChange={handleSwitches} name="checkedDesiredArrivalTime" />}
          label={<Text color="textSecondary">{switchLabels[editing.tab]}</Text>}
        />
        <Collapse in={editing.checkedDesiredArrivalTime}>
          <DesiredArrivalTimePicker
            margin="normal"
            label={inputLables[editing.tab]}
            format="HH:mm"
            value={editing.desiredArrivalTime}
            onChange={handleDesiredArrivalTime}
            okLabel="決定"
            cancelLabel="キャンセル"
            fullWidth
          />
        </Collapse>
      </>}
      {(editing.tab === 'restaurant' || editing.tab === 'shop') && <>
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
      {editing.tab === 'show' && <>
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
    </Wrap>
  )
}