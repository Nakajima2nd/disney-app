import styled from 'styled-components'
import { AppBar, Box, Button, Toolbar } from '@material-ui/core'
import { useRecoilState } from 'recoil'
import { searchInputState } from '../atoms/searchInput'
import { useRouter } from 'next/router'

const CustomAppBar = styled(AppBar)`
  text-align: center;
  max-width: 900px;
  left: 50%;
  transform: translate(-50%, 0);
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
  max-width: 900px;
  height: 56px;
  background: linear-gradient(rgba(237, 249, 255, 0), rgba(255, 255, 255, 0.8));
`

const Text = styled.p`
  /* @import url('https://fonts.googleapis.com/css2?family=M+PLUS+2&family=Mochiy+Pop+One&display=swap'); */
  /* font-family: 'M PLUS 2', sans-serif; */
  /* font-family: 'Mochiy Pop One'; */
  font-size: 32px;
  font-weight: bold;
  color: #15859A;
  z-index: 2;
  cursor: pointer;
`

const SwitchButtons = styled(Box)`
  background: linear-gradient(rgba(251, 254, 255, 1), rgba(255, 255, 255, 1));
  display: flex;
  flex-wrap: wrap;
  color: #5f5f5f;
`

const SwitchButton = styled(Button)`
  flex-basis: 50%;
`

const About = styled(SwitchButton)`
  border-right: 1px solid;
  border-image: linear-gradient(to bottom, #fbfeff 20%, #d6d6d6 80%);
  border-image-slice: 1;
`

const Sea = styled(SwitchButton)`
  border-right: 0px;
`

const Ticket = styled(SwitchButton)`
  border-right: 1px solid #d6d6d6;
  border-radius: 0;
`

export const Header = () => {
  const router = useRouter()
  const [searchInput, setSearchInput] = useRecoilState(searchInputState)
  
  const handleHome = () => {
    setSearchInput(null)
    router.push({
      pathname: '/',
    })
  }

  const handleButton = paths => e => {
    const current = router.pathname
    if (paths.includes(current)) {
    }
    else {
      router.push({
        pathname: paths[0],
      })
    }
  }

  const getColor = paths => {
    const current = router.pathname
    return paths.includes(current) ? 'primary' : 'inherit'
  }

  return (
    <CustomAppBar
      color="inherit"
      position="fixed"
      elevation={1}
    >
      <CustomToolbar>
        <Text onClick={handleHome}>ディズニープラン</Text>
      </CustomToolbar>
      <Dummy />
      <SwitchButtons>
        <Sea onClick={handleButton(['/', '/search'])} color={getColor(['/', '/search'])}>TDS計画ツール</Sea>
        <Ticket onClick={handleButton(['/ticket'])} color={getColor(['/ticket'])}>チケット予約ツール</Ticket>
        <About onClick={handleButton(['/about'])} color={getColor(['/about'])}>このサイトについて</About>
      </SwitchButtons>
    </CustomAppBar>
  )
}