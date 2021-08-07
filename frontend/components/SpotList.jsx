import styled from 'styled-components'
import { Avatar, Box, Typography, List, ListItem, ListItemText, Divider } from '@material-ui/core'

const CustomList = styled(List)`
  height: calc(100% - 32px - 16px - 72px);
  overflow: auto;
`

const CustomListItem = styled(ListItem)`
  display: flex;
`

const EnableAvatar = styled(Avatar)`
  color: white;
  background-color: darksalmon;
`

const DisableAvatar = styled(Avatar)`
  color: white;
  background-color: lightgray;
  font-size: 1rem;
`

const WaitTimeContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  padding-left: 8px;
  align-items: center;
`

const AvatarContainer = styled(Box)`
  display: flex;
  align-items: flex-end;
`

export const SpotList = ({ obj, editing, handleClickSpot }) => {
  const filterdSpots = obj.filter(spot => spot.name.indexOf(editing.keyword) > -1)
  return (
    <CustomList>
      {filterdSpots.map((spot, index) => <>
        <CustomListItem
          key={index}
          button
          onClick={handleClickSpot(spot)}
          selected={editing.name === spot.name}
        >
          {editing.tab === 0 && <>
            <ListItemText primary={spot.shortName} />
            <WaitTimeContainer>
              {!spot.enable && <Typography color="textSecondary" variant="caption">ただいま</Typography>}
              {spot.enable && spot.waitTime < 0 && <Typography color="textSecondary" variant="caption">ただいま</Typography>}
              {spot.enable && spot.waitTime >= 0 && <Typography color="textSecondary" variant="caption">待ち時間</Typography>}
              <AvatarContainer>
                {!spot.enable && <DisableAvatar>休止</DisableAvatar>}
                {spot.enable && spot.waitTime < 0 && <DisableAvatar>準備</DisableAvatar>}
                {spot.enable && spot.waitTime >= 0 && <EnableAvatar>{spot.waitTime}</EnableAvatar>}
                {(!spot.enable || spot.waitTime < 0) && <Typography color="textSecondary" variant="caption">中</Typography>}
                {spot.enable && spot.waitTime >= 0 && <Typography color="textSecondary" variant="caption">分</Typography>}
              </AvatarContainer>
              {spot.meanWaitTime >= 0 && <Typography color="textSecondary" variant="caption">{'平均' + spot.meanWaitTime + '分'}</Typography>}
            </WaitTimeContainer>
          </>}
          {editing.tab !== 0 && <ListItemText primary={spot.shortName} />}
        </CustomListItem>
        <Divider />
      </>)}
    </CustomList>
  )
}