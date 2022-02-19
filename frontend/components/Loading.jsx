import styled from 'styled-components'
import { Box, CircularProgress } from '@material-ui/core'

const Overlay = styled(Box)`
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`

export const Loading = () => {
  return (
    <Overlay>
      <CircularProgress />
    </Overlay>
  )
}