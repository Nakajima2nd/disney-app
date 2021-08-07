import styled from 'styled-components'
import { Button, Dialog, DialogActions, DialogContent, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { append, assoc, dissoc, pipe, update } from 'ramda'
import { Error } from '../components/Error'
import { Loading } from '../components/Loading'
import { useGetSpotList } from '../hooks'
import { ConditionInput } from './ConditionInput'
import { SpotSelect } from './SpotSelect'

const SpotDialog = styled(Dialog)`
`

const CloseButton = styled(IconButton)`
  margin: 0 0 0 auto;
`

const SpotDialogContent = styled(DialogContent)`
`

export const SpotListDialog = ({ spotList, editing, selected, open, spots, setEditing, setOpen, setSpots }) => {
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
      <CloseButton onClick={handleClose}>
        <Close />
      </CloseButton>
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
      {editing.step === 1 &&
        <DialogActions>
          <Button onClick={handleBack} color="primary">もどる</Button>
          <Button onClick={handleComplete} color="primary">決定</Button>
        </DialogActions>
      }
    </SpotDialog>
  )
}