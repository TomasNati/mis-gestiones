import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C99A44',
    },
    secondary: {
      main: '#C99A44',
    },
    background: {
      default: '#0E0C09',
      paper: '#15130F',
    },
  },
  typography: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    h1: { fontFamily: "'Space Grotesk', sans-serif" },
    h2: { fontFamily: "'Space Grotesk', sans-serif" },
    h3: { fontFamily: "'Space Grotesk', sans-serif" },
    h4: { fontFamily: "'Space Grotesk', sans-serif" },
    h5: { fontFamily: "'Space Grotesk', sans-serif" },
    h6: { fontFamily: "'Space Grotesk', sans-serif" },
    button: { fontFamily: "'Space Grotesk', sans-serif" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body { padding: 0; margin: 0; }
        input[type="date"]::-webkit-calendar-picker-indicator { background-color: #FFFFFF; }
        .MuiDataGrid-root { background-color: #15130F; }
        .MuiDataGrid-columnHeaders { background-color: #1B1813; }
        .MuiDataGrid-root .MuiInputBase-input.MuiOutlinedInput-input { padding-top: 4px; padding-bottom: 4px; }
        .MuiDataGrid-root .MuiDataGrid-cell.MuiDataGrid-cell--editing:focus-within { outline: unset !important; }
        .MuiDataGrid-cell { border-bottom-color: #2A251E !important; }
        .MuiDataGrid-row:hover { background-color: #221E16 !important; }
        .MuiDataGrid-row.Mui-selected { background-color: rgba(201,154,68,0.14) !important; }
        .MuiDataGrid-toolbar { background-color: #15130F; }
        .MuiDataGrid-footerContainer { border-top-color: #2A251E !important; }
        .MuiLinearProgress-root { background-color: #1B1813; }
        .MuiLinearProgress-bar { background-color: #C99A44; }
        .MuiDrawer-paper { background-color: #15130F !important; border-right-color: #2A251E !important; }
        .MuiListItemButton-root:hover { background-color: #1B1813 !important; }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: "'Space Grotesk', sans-serif",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#C99A44',
          }),
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C99A44',
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: '#6b6357',
          borderColor: '#2A251E',
          '&.Mui-selected': {
            backgroundColor: 'rgba(201,154,68,0.14)',
            color: '#F3EFE6',
            '&:hover': {
              backgroundColor: 'rgba(201,154,68,0.2)',
            },
          },
        },
      },
    },
  },
});

export default theme;
