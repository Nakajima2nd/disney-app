import styled from 'styled-components'
import { AppBar, Box, Toolbar, Typography } from '@material-ui/core'
import { Mickey } from '../styles/parts'
import { useRecoilState } from 'recoil'
import { searchInputState } from '../atoms/searchInput'
import { useRouter } from 'next/router'

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
  const router = useRouter()
  const [searchInput, setSearchInput] = useRecoilState(searchInputState)
  const onClick = () => {
    setSearchInput(null)
    router.push({
      pathname: '/',
    })
  }

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