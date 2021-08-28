import styled from 'styled-components'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { Mickey } from '../styles/parts'

const CustomAppBar = styled(AppBar)`
  text-align: center;
  height: 56px;
  min-height: 56px;
  `

const CustomToolbar = styled(Toolbar)`
  height: 56px;
  min-height: 56px;
  display: flex;
  justify-content: center;
`

const Title = styled(Typography)`
  font-size: 2rem;
  font-weight: bold;
  color: #087D8D;
`

const CustomMickey = styled(Mickey)`
  margin: 0 8px;
  top: 2px;
`

export const Header = () => {
  return (
    <CustomAppBar
      color="inherit"
      position="fixed"
      elevation={1}
    >
      <CustomToolbar>
        <Title>ディズニー</Title>
        <CustomMickey />
        <Title>プラン</Title>
      </CustomToolbar>
    </CustomAppBar>
  )
}