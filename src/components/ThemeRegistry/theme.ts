import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4493F8',
    },
    secondary: {
      main: '#4493F8',
    },
    background: {
      default: '#0D1117',
      paper: '#151B23',
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
        .MuiDataGrid-root { background-color: var(--bg-panel); }
        .MuiDataGrid-columnHeaders { background-color: var(--bg-elevated); }
        .MuiDataGrid-root .MuiInputBase-input.MuiOutlinedInput-input { padding-top: 4px; padding-bottom: 4px; }
        .MuiDataGrid-root .MuiDataGrid-cell.MuiDataGrid-cell--editing:focus-within { outline: unset !important; }
        .MuiDataGrid-cell { border-bottom-color: var(--border-soft) !important; }
        .MuiDataGrid-row:hover { background-color: var(--bg-row-hover) !important; }
        .MuiDataGrid-row.Mui-selected { background-color: var(--accent-soft) !important; }
        .MuiDataGrid-toolbar { background-color: var(--bg-panel); }
        .MuiDataGrid-footerContainer { border-top-color: var(--border-soft) !important; }
        .MuiLinearProgress-root { background-color: var(--bg-elevated); }
        .MuiLinearProgress-bar { background-color: var(--accent); }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: "'Space Grotesk', sans-serif",
        },
        textPrimary: {
          color: 'var(--accent)',
          '&:hover': {
            backgroundColor: 'var(--accent-soft)',
          },
        },
        outlinedPrimary: {
          color: 'var(--accent)',
          borderColor: 'var(--accent)',
          '&:hover': {
            borderColor: 'var(--accent)',
            backgroundColor: 'var(--accent-soft)',
          },
        },
        containedPrimary: {
          backgroundColor: 'var(--accent)',
          color: 'var(--bg-page)',
          '&:hover': {
            backgroundColor: 'var(--accent)',
            opacity: 0.9,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#4493F8',
          }),
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4493F8',
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
          color: '#656c76',
          borderColor: '#3d444d',
          '&.Mui-selected': {
            backgroundColor: 'rgba(68,147,248,0.14)',
            color: '#F0F6FC',
            '&:hover': {
              backgroundColor: 'rgba(68,147,248,0.2)',
            },
          },
        },
      },
    },
  },
});

export default theme;
