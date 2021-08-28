import { createMuiTheme } from '@material-ui/core'
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

const breakpoints = createBreakpoints({})

const theme = createMuiTheme({
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
    }
  }
})
export default theme