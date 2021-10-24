import styled from 'styled-components'
import { Button, Dialog, DialogActions, DialogContent, Fab, IconButton } from '@material-ui/core'
import { Add, Close } from '@material-ui/icons'
import { append, assoc, dissoc, last, pipe, update } from 'ramda'
import { ConditionInput } from './ConditionInput'
import { SpotSelect } from './SpotSelect'
import { useState } from 'react'

const SpotDialog = styled(Dialog)`
`

const CloseButton = styled(IconButton)`
  margin: 0 0 0 auto;
`

const SpotDialogContent = styled(DialogContent)`
`

const CustomFab = styled(Fab)`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translate(-50%, 0);
`

export const SpotListDialog = ({ spotList, editing, selected, open, spots, setEditing, setOpen, setSpots, setStart, setGoal }) => {
  const [checked, setChecked] = useState([])

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

  const handleClickSpot = (spot) => () => {
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

  const handleCheckbox = (spot) => () => {
    const exists = checked.some(s => s.shortName === spot.shortName)
    if (exists) {
      setChecked(checked.filter(val => val.shortName !== spot.shortName))
    }
    else {
      const newSpot = pipe(
        assoc('spotId', spot.spotId),
        assoc('name', spot.name),
        assoc('shortName', spot.shortName),
        assoc('startTime', spot.startTime),
        assoc('step', 1)
      )(editing)
      setChecked(checked.concat(newSpot))
    }
  }

  const handleBackChecked = () => {
    const index = checked.findIndex(spot => spot.shortName === editing.shortName)
    const newChecked = update(index, pipe(
      assoc('checkedDesiredArrivalTime', editing.checkedDesiredArrivalTime),
      assoc('desiredArrivalTime', editing.tab === 'show' ? editing.startTime : editing.checkedDesiredArrivalTime ? editing.desiredArrivalTime : null),
      assoc('checkedStayTime', editing.checkedStayTime),
      assoc('stayTime', editing.checkedStayTime ? editing.stayTime : ''),
      assoc('checkedSpecifiedWaitTime', editing.checkedSpecifiedWaitTime),
      assoc('specifiedWaitTime', editing.checkedSpecifiedWaitTime ? editing.specifiedWaitTime : '')
    )(checked[index]), checked)
    setChecked(newChecked)
    handleBack()
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
      assoc('desiredArrivalTime', editing.tab === 'show' ? editing.startTime : editing.checkedDesiredArrivalTime ? editing.desiredArrivalTime : null),
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

  const handleFab = async () => {
    const newSpots = checked.map(spot => {
      return pipe(
        assoc('desiredArrivalTime', spot.tab === 'show' ? spot.startTime : spot.checkedDesiredArrivalTime ? spot.desiredArrivalTime : null),
        assoc('stayTime', spot.checkedStayTime ? spot.stayTime : ''),
        assoc('specifiedWaitTime', spot.checkedSpecifiedWaitTime ? spot.specifiedWaitTime : '')
      )(spot)
    })
    setSpots(spots.concat(newSpots))
    setChecked([])
    handleClose()
    await new Promise(resolve => setTimeout(resolve, 200))
    setSpots(spots.concat(newSpots.map(spot => assoc('display', true, spot))))
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
            spotList={spotList}
            editing={editing}
            handleClickSpot={handleClickSpot}
            checked={checked}
            handleCheckbox={handleCheckbox}
            selected={selected}
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
      {editing.step === 1 && checked.length === 0 &&
        <DialogActions>
          <Button onClick={handleBack} color="primary">もどる</Button>
          <Button onClick={handleComplete} color="primary">決定</Button>
        </DialogActions>
      }
      {editing.step === 1 && checked.length > 0 &&
        <DialogActions>
          <Button onClick={handleBackChecked} color="primary">もどる</Button>
        </DialogActions>
      }
      {editing.step === 0 && checked.length > 0 &&
        <CustomFab color="primary" onClick={handleFab}>
          <Add />
        </CustomFab>
      }
    </SpotDialog>
  )
}