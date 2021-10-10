import styled from 'styled-components'
import { Tabs, Tab, TextField, InputAdornment } from '@material-ui/core'
import { Restaurant, SportsTennis, AccessibilityNew, ShoppingCart, Search, Mood, Flag } from '@material-ui/icons'
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
      <SpotTab icon={<SportsTennis />} label="アトラクション" value="attraction"/>
      <SpotTab icon={<Restaurant />} label="レストラン" value="restaurant"/>
      <SpotTab icon={<ShoppingCart />} label="ショップ" value="shop"/>
      <SpotTab icon={<Flag />} label="スポット" value="place"/>
      <SpotTab icon={<AccessibilityNew />} label="ショー" value="show"/>
      <SpotTab icon={<Mood />} label="グリーティング" value="greeting"/>
    </SpotTabs>
    <SpotList
      list={spotList[editing.tab]}
      editing={editing}
      handleClickSpot={handleClickSpot}
    />
  </>)
}