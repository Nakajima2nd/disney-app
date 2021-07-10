import styled from 'styled-components'
import { Box, Typography } from '@material-ui/core'
import Link from 'next/link'
import { searchSample } from '../../sample/search'

const Text = styled(Typography)`
`
const data = searchSample

const Search = () => {
  console.log(data)
  return (<>
    <Link href="/">もどる</Link>
  </>)
}

export default Search