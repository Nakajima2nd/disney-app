import '../styles/globals.css'
import React, { useEffect } from 'react'
import styled, { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import {
  ThemeProvider as MaterialUIThemeProvider,
  StylesProvider
} from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../styles/theme'
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Header } from '../components/Header'
import { Box } from '@material-ui/core'

const Wrap = styled(Box)`
  position: relative;
  top: 64px;
`

const MyApp = ({ Component, pageProps }) => {
  // Remove the server-side injected CSS.(https://material-ui.com/guides/server-rendering/)
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])

  return (
    <StylesProvider injectFirst>
      <MaterialUIThemeProvider theme={theme}>
        <StyledComponentsThemeProvider theme={theme}>
          <CssBaseline />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Header />
            <Wrap>
              <Component {...pageProps} />
            </Wrap>
          </MuiPickersUtilsProvider>
        </StyledComponentsThemeProvider>
      </MaterialUIThemeProvider>
    </StylesProvider>
  )
}

export default MyApp
