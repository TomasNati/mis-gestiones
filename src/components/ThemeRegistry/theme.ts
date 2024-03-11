import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(61,167,214,0.86)',
    },
    secondary: {
      main: '#42a5f5',
    },
    background: {
      default: '#101414',
      paper: '#464e52',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      body {
        padding: 0;
        margin: 0;
      }

      input[type="date"]::-webkit-calendar-picker-indicator {
        background-color: #FFFFFF;
      }

      .MuiDataGrid-root {
        background-color: #424749
      }

      .MuiDataGrid-columnHeaders {
        background-color: #303335
      }
      `,
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#60a5fa',
          }),
        }),
      },
    },
  },
});

export default theme;
