import styled from 'styled-components'
import { Box, CircularProgress } from '@material-ui/core'

const Overlay = styled(Box)`
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 20;
`

export const Loading = () => {
  return (
    <Overlay>
      <CircularProgress />
    </Overlay>
  )
}