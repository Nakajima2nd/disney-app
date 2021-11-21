import styled from 'styled-components'
import { AppBar, Button, ButtonGroup, Toolbar, Typography } from '@material-ui/core'
import { useRecoilState } from 'recoil'
import { searchInputState } from '../atoms/searchInput'
import { useRouter } from 'next/router'

const CustomAppBar = styled(AppBar)`
  text-align: center;
`

const CustomToolbar = styled(Toolbar)`
  background-color: #EDF9FF;
  background-image:
    radial-gradient(white 20%, rgba(255, 255, 255, 0) 25%),
    radial-gradient(white 20%, rgba(255, 255, 255, 0) 25%);
  background-size: 24px 24px;
  background-position: 0 0, 12px 12px;
  height: 56px;
  min-height: 56px;
  display: flex;
  justify-content: center;
`

const Dummy = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 56px;
  background: linear-gradient(rgba(237, 249, 255, 0), rgba(255, 255, 255, 0.8));
`

const Text = styled.p`
  /* @import url('https://fonts.googleapis.com/css2?family=M+PLUS+2&family=Mochiy+Pop+One&display=swap'); */
  /* font-family: 'M PLUS 2', sans-serif; */
  font-family: 'Mochiy Pop One';
  font-size: 32px;
  font-weight: bold;
  color: #15859A;
  z-index: 2;
`

const Logo = styled.img`
  z-index: 2;
`

const SwitchButtons = styled(ButtonGroup)`
  height: 36px;
  min-height: 36px;
  background: linear-gradient(rgba(251, 254, 255, 1), rgba(255, 255, 255, 1));
`

const About = styled(Button)`
  border-right: 1px solid;
  border-image: linear-gradient(to bottom, #fbfeff 20%, #d6d6d6 80%);
  border-image-slice: 1;
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
        <Text onClick={onClick}>ディズニープラン</Text>
        {/* <Logo src="/logo.png" onClick={onClick} /> */}
      </CustomToolbar>
      <Dummy/>
      <SwitchButtons variant="text" fullWidth>
        <About>はじめに</About>
        <Sea color="primary">TDS計画ツール</Sea>
      </SwitchButtons>
    </CustomAppBar>
  )
}