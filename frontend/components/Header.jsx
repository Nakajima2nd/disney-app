import styled from 'styled-components'
import { AppBar, Button, ButtonGroup, Toolbar, Typography } from '@material-ui/core'
import { useRecoilState } from 'recoil'
import { searchInputState } from '../atoms/searchInput'
import { useRouter } from 'next/router'

const CustomAppBar = styled(AppBar)`
  text-align: center;
  min-height: 56px;
`

const CustomToolbar = styled(Toolbar)`
  background-color: #EDF9FF;
  background-image:
    radial-gradient(white 20%, rgba(255, 255, 255, 0) 25%),
    radial-gradient(white 20%, rgba(255, 255, 255, 0) 25%);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
  height: 56px;
  min-height: 56px;
  display: flex;
  justify-content: center;
`

const Text = styled(Typography)`
  font-size: 32px;
  font-weight: bold;
  color: #15859A;
`

const Logo = styled.img`
`

const SwitchButtons = styled(ButtonGroup)`
  height: 36px;
  min-height: 36px;
`

const About = styled(Button)`
  border-radius: 0;
`

const Sea = styled(Button)`
  border-radius: 0;
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
        {/* <Text>ディズニープラン</Text> */}
        <Logo src="/logo.png" onClick={onClick} />
      </CustomToolbar>
      <SwitchButtons variant="outlined" fullWidth>
        <About>はじめに</About>
        <Sea color="primary">TDS計画ツール</Sea>
      </SwitchButtons>
    </CustomAppBar>
  )
}