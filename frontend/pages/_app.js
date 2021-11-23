import '../styles/globals.css'
import React, { useEffect } from 'react'
import { RecoilRoot } from 'recoil'
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
import GoogleAnalytics from '../components/GoogleAnalytics'
import { useRouter } from 'next/router';
import { existsGaId, pageview } from '../components/gtag'

// todo: 本当はtop手書きはよくない
const Wrap = styled(Box)`
  position: relative;
  top: 92px;
`

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter()
  
  // Remove the server-side injected CSS.(https://material-ui.com/guides/server-rendering/)
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
    
    // Google Analytics
    if (!existsGaId) {
      return
    }
    const handleRouteChange = (path) => {
      pageview(path)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <StylesProvider injectFirst>
      <MaterialUIThemeProvider theme={theme}>
        <StyledComponentsThemeProvider theme={theme}>
          <CssBaseline />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <RecoilRoot>
              <Header />
              <Wrap>
                <GoogleAnalytics />
                <Component {...pageProps} />
              </Wrap>
            </RecoilRoot>
          </MuiPickersUtilsProvider>
        </StyledComponentsThemeProvider>
      </MaterialUIThemeProvider>
    </StylesProvider>
  )
}

export default MyApp
