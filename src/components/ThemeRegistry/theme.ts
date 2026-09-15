import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4FB8C4',
    },
    secondary: {
      main: '#4FB8C4',
    },
    background: {
      default: '#08100F',
      paper: '#0D1716',
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
            backgroundColor: '#4FB8C4',
          }),
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4FB8C4',
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
          color: '#5a7376',
          borderColor: '#1f2e2e',
          '&.Mui-selected': {
            backgroundColor: 'rgba(79,184,196,0.14)',
            color: '#E9F4F5',
            '&:hover': {
              backgroundColor: 'rgba(79,184,196,0.2)',
            },
          },
        },
      },
    },
  },
});

export default theme;
