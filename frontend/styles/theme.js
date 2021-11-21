import { createMuiTheme } from '@material-ui/core'
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

const breakpoints = createBreakpoints({})

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2B99FF',
      contrastText: '#fff'
    },
    secondary: {
      main: '#FFC224'
    },
    close: {
      main: '#FF0A0A'
    },
    sea: {
      main: '#2B99FF'
    },
    start: {
      main: '#FFC224'
    },
    goal: {
      main: '#FFC224'
    },
    logo: {
      main: '#087D8D',
      contrast: '#d1dfd2'
    },
    enable: {
      main: '#FFC224'
    }
  },
  overrides: {
    MuiDialog: {
      paperFullWidth: {
        height: 'calc(100% - 64px)'
      }
    },
    MuiDialogContent: {
      root: {
        padding: 0
      }
    },
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0
      }
    },
    MuiListItem: {
      gutters: {
        // paddingLeft: 0,
        // paddingRight: 0
      },
      root: {
        // paddingTop: 0,
        // paddingBottom: 0
      }
    },
    MuiTab: {
      root: {
        // minWidth: '0px',
        [breakpoints.down("sm")]: {
          // minWidth: '0px',
        }
      }
    },
    MuiButton: {
      root: {
        fontSize: '1rem'
      }
    }
  }
})
export default theme