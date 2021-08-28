import styled from 'styled-components'
import { Button, Dialog, DialogActions, DialogContent, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { append, assoc, dissoc, last, pipe, update } from 'ramda'
import { ConditionInput } from './ConditionInput'
import { SpotSelect } from './SpotSelect'

const SpotDialog = styled(Dialog)`
`

const CloseButton = styled(IconButton)`
  margin: 0 0 0 auto;
`

const SpotDialogContent = styled(DialogContent)`
`

export const SpotListDialog = ({ spotList, editing, selected, open, spots, setEditing, setOpen, setSpots, setStart, setGoal }) => {
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
      assoc('startTime', spot.startTime)
    )(editing)
    setEditing(newSpot)
    if (selected === -2) {
      setStart(newSpot)
      handleClose()
    }
    else if (selected === -3) {
      setGoal(newSpot)
      handleClose()
    }
    else {
      setEditing(assoc('step', 1, newSpot))
    }
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

  const handleComplete = async () => {
    const newSpot = pipe(
      assoc('desiredArrivalTime', editing.startTime ? editing.startTime : editing.checkedDesiredArrivalTime ? editing.desiredArrivalTime : null),
      assoc('stayTime', editing.checkedStayTime ? editing.stayTime : ''),
      assoc('specifiedWaitTime', editing.checkedSpecifiedWaitTime ? editing.specifiedWaitTime : '')
    )(editing)
    if (selected === -1) {
      const newSpots = append(newSpot, spots)
      setSpots(newSpots)
      handleClose()
      await new Promise(resolve => setTimeout(resolve, 200))
      setSpots(update(-1, assoc('display', true, last(newSpots)), newSpots))
    }
    else {
      setSpots(update(selected, newSpot, spots))
      handleClose()
    }
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