import styled from 'styled-components'
import { Box, Tabs, Tab, TextField, InputAdornment } from '@material-ui/core'
import { Restaurant, SportsTennis, AccessibilityNew, ShoppingCart, Search, Mood, Flag } from '@material-ui/icons'
import { SpotList } from './SpotList'
import { TabPanel } from '../styles/parts'
import SwipeableViews from 'react-swipeable-views/lib/SwipeableViews'

const KeywordInput = styled(TextField)`
  padding: 0 16px;
`

const SpotTabs = styled(Tabs)`
  margin: 16px 0 0;
`

const SpotTab = styled(Tab)`
`

const TabPanels = styled(Box)`
`

// やっつけ仕事
const tabs = [
  'attraction',
  'restaurant',
  'shop',
  'place',
  'show',
  'greeting'
]

export const SpotSelect = ({ handleKeyword, handleTab, spotList, editing, handleClickSpot, checked, handleCheckbox, selected }) => {
  const handleChangeIndex = index => {
    handleTab(null, tabs[index])
  }

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
      <SpotTab icon={<SportsTennis />} label="アトラクション" value="attraction" />
      <SpotTab icon={<Restaurant />} label="レストラン" value="restaurant" />
      <SpotTab icon={<ShoppingCart />} label="ショップ" value="shop" />
      <SpotTab icon={<Flag />} label="スポット" value="place" />
      <SpotTab icon={<AccessibilityNew />} label="ショー" value="show" />
      <SpotTab icon={<Mood />} label="グリーティング" value="greeting" />
    </SpotTabs>
    <TabPanels>
      <SwipeableViews
        enableMouseEvents
        index={tabs.findIndex(tab => tab === editing.tab)}
        resistance
        onChangeIndex={index => handleChangeIndex(index)}
      >
        {Object.entries(spotList).map(([key, value], index) => (
          <TabPanel
            key={index}
            value={editing.tab}
            index={key}
          >
            <SpotList
              list={value}
              editing={editing}
              handleClickSpot={handleClickSpot}
              checked={checked}
              handleCheckbox={handleCheckbox}
              selected={selected}
            />
          </TabPanel>
        ))}
      </SwipeableViews>
    </TabPanels>
  </>)
}