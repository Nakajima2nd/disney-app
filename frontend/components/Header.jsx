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

const Logo = styled.img`
`

export const Header = () => {
  return (
    <CustomAppBar
      color="inherit"
      position="fixed"
      elevation={1}
    >
      <CustomToolbar>
        <Logo src="/logo.png" />
      </CustomToolbar>
    </CustomAppBar>
  )
}