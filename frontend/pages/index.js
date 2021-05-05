import styled from 'styled-components'
import { Paper } from '@material-ui/core'

export default function Home() {
  const Container = styled(Paper)`
    background-color: darkseagreen
  `
  const Text = styled.p`
    color: white
  `
  return (
    <>
      <Container>
        <Text>ディズニー</Text>
      </Container>
    </>
  )
}
