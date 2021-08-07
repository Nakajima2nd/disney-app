import styled from 'styled-components'
import { Tabs, Tab, TextField, InputAdornment } from '@material-ui/core'
import { Restaurant, SportsTennis, AccessibilityNew, ShoppingCart, Search, Mood } from '@material-ui/icons'
import { SpotList } from './SpotList'

const KeywordInput = styled(TextField)`
  padding: 0 16px;
`

const SpotTabs = styled(Tabs)`
  margin: 16px 0 0;
`

const SpotTab = styled(Tab)`
`

export const SpotSelect = ({ handleKeyword, handleTab, spotList, editing, handleClickSpot }) => {
  return (<>
    <KeywordInput
      value={editing.keyword}
      onChange={handleKeyword}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
    <SpotTabs
      value={editing.tab}
      onChange={handleTab}
      variant="scrollable"
      indicatorColor="primary"
      textColor="primary"
      scrollButtons="on"
    >
      <SpotTab icon={<SportsTennis />} label="アトラクション" />
      <SpotTab icon={<Restaurant />} label="レストラン" />
      <SpotTab icon={<ShoppingCart />} label="ショップ" />
      <SpotTab icon={<AccessibilityNew />} label="ショー" />
      <SpotTab icon={<Mood />} label="グリーティング" />
    </SpotTabs>
    <SpotList
      obj={spotList[Object.keys(spotList)[editing.tab]]}
      editing={editing}
      handleClickSpot={handleClickSpot}
    />
  </>)
}