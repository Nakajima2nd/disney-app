import styled from 'styled-components'
import { Avatar, Box, Typography, List, ListItem } from '@material-ui/core'
import { Fragment } from 'react'
import { groupBy } from 'ramda'

const Wrap = styled(Box)`
  margin-top: 24px;
`

const AreaName = styled(Typography)`
  margin: 0 16px 8px;
  border-bottom: 2px solid gray;
  font-size: 12px;
  font-weight: bold;
`

const CustomList = styled(List)`
  height: calc(100% - 32px - 16px - 72px);
  overflow: auto;
`

const CustomListItem = styled(ListItem)`
  display: flex;
  border-bottom: 1px solid lightgray;
  justify-content: space-between;
  margin: 0 8px;
  padding: 0 8px;
  width: calc(100% - 16px);
  /* height: 92px; */
`

const SpotImg = styled.img`
  width: 56px;
  height: 56px;
`

const SpotNameContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 8px;
`

const SpotName = styled(Typography)`
  font-size: 11px;
`

const BusinessHours = styled(Typography)`
  font-size: 10px;
`

const EnableAvatar = styled(Avatar)`
  color: white;
  background-color: ${(props) => props.theme.palette.enable.main};
`

const DisableAvatar = styled(Avatar)`
  color: white;
  background-color: lightgray;
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

export const SpotList = ({ list, editing, handleClickSpot }) => {
  const filterdSpots = list.filter(spot => spot.name.indexOf(editing.keyword) > -1)
  const groupedSpots = groupBy(spot => spot.area, filterdSpots)

  return (<>
    {Object.entries(groupedSpots).map(([area, spots], index) =>
      <Wrap>
        <AreaName>{area}</AreaName>
        <CustomList>
          {spots.map((spot, index) => <Fragment key={index}>
            <CustomListItem
              key={index}
              button
              onClick={handleClickSpot(spot)}
              selected={editing.name === spot.name}
            >
              <SpotImg src={`/img/spots/${spot.spotId}_${spot.shortName}.jpg`} onError={(e) => e.target.src = "/img/spots/default.jpg"} alt={spot.shortName} />
              <SpotNameContainer>
                <SpotName>{spot.shortName}</SpotName>
                {(spot.startTime || spot.endTime) && <BusinessHours color="textSecondary">{spot.startTime}~{spot.endTime}</BusinessHours>}
              </SpotNameContainer>
              <WaitTimeContainer>
                {editing.tab === 'attraction' && <>
                  <Typography color="textSecondary" variant="caption">{spot.enable && spot.waitTime >= 0 ? '待ち時間' : '　'}</Typography>
                  <AvatarContainer>
                    {!spot.enable && <DisableAvatar>休止</DisableAvatar>}
                    {spot.enable && spot.waitTime < 0 && <DisableAvatar>準備</DisableAvatar>}
                    {spot.enable && spot.waitTime >= 0 && <EnableAvatar>{spot.waitTime}</EnableAvatar>}
                    {(!spot.enable || spot.waitTime < 0) && <Typography color="textSecondary" variant="caption">中</Typography>}
                    {spot.enable && spot.waitTime >= 0 && <Typography color="textSecondary" variant="caption">分</Typography>}
                  </AvatarContainer>
                  <Typography color="textSecondary" variant="caption">{spot.meanWaitTime >= 0 ? '平均' + spot.meanWaitTime + '分' : '　'}</Typography>
                </>}
              </WaitTimeContainer>
            </CustomListItem>
          </Fragment>)}
        </CustomList>
      </Wrap>
    )
    }
  </>)
}