import { createTheme } from '@mui/material/styles';

/**
 * Tema MUI del sistema de diseño GitHub dark.
 * Los valores vivos están en `theme-tokens.css` (`:root`); acá se mapean a la
 * paleta y a los componentes MUI. Fuente de verdad: docs/mockups/assets/app.css
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4493F8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4493F8',
    },
    // Semánticos: solo para estado, siempre junto a texto o ícono.
    success: {
      main: '#3FB950',
      dark: '#238636',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#D29922',
      dark: '#9E6A03',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F85149',
      dark: '#DA3633',
      contrastText: '#FFFFFF',
    },
    // "done" del sistema (violeta)
    info: {
      main: '#A371F7',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0D1117',
      paper: '#151B23',
    },
    // Literal (no `var()`): MUI pasa los valores de la paleta por `alpha()` /
    // `decomposeColor()` y no acepta CSS vars. Equivale a `--border-muted`.
    // Los `var()` sí valen dentro de `styleOverrides` (CSS crudo).
    divider: '#262C36',
    text: {
      primary: '#F0F6FC',
      secondary: '#9198A1',
      disabled: '#656C76',
    },
  },
  typography: {
    // `--font-*` los define next/font en <html> (src/app/layout.tsx): usar la var,
    // no el nombre literal, o no coincide con la familia self-hosteada.
    fontFamily: 'var(--font-body)',
    h1: { fontFamily: 'var(--font-display)' },
    h2: { fontFamily: 'var(--font-display)' },
    h3: { fontFamily: 'var(--font-display)' },
    h4: { fontFamily: 'var(--font-display)' },
    h5: { fontFamily: 'var(--font-display)' },
    h6: { fontFamily: 'var(--font-display)' },
    button: { fontFamily: 'var(--font-display)' },
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
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontWeight: 500,
          lineHeight: 1,
          height: 'var(--control-h)',
          padding: '0 12px',
          borderRadius: 'var(--radius)',
        },
        sizeSmall: {
          height: 'var(--control-h-sm)',
          padding: '0 10px',
          fontSize: '12.5px',
        },
        textPrimary: {
          color: 'var(--accent)',
          '&:hover': {
            backgroundColor: 'var(--accent-soft)',
          },
        },
        outlinedPrimary: {
          color: 'var(--accent)',
          borderColor: 'var(--border-soft)',
          '&:hover': {
            borderColor: 'var(--border-strong)',
            backgroundColor: 'var(--bg-row-hover)',
          },
        },
        containedPrimary: {
          backgroundColor: 'var(--accent-emphasis)',
          color: 'var(--text-on-emphasis)',
          '&:hover': {
            backgroundColor: 'var(--accent-hover)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: 'var(--accent)',
            color: 'var(--text-on-emphasis)',
            '& .MuiAlert-icon': {
              color: 'var(--text-on-emphasis)',
            },
          }),
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--accent-emphasis)',
          },
        },
      },
    },
    // Modales: sombra solo acá (y en tooltips), header con subtítulo, footer con acciones a la derecha.
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: 'var(--bg-overlay)',
          border: '1px solid var(--border-soft)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-overlay)',
          // En el mockup los campos dentro de un modal usan el fondo más profundo.
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--bg-inset)',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-soft)',
          fontSize: 'var(--fs-16)',
          fontWeight: 600,
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          borderTop: '1px solid var(--border-soft)',
          justifyContent: 'flex-end',
          gap: '8px',
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
          color: 'var(--text-tertiary)',
          borderColor: 'var(--border-soft)',
          textTransform: 'none',
          '&.Mui-selected': {
            backgroundColor: 'var(--bg-emphasis)',
            color: 'var(--text-primary)',
            '&:hover': {
              backgroundColor: 'var(--bg-emphasis)',
            },
          },
        },
      },
    },
  },
});

export default theme;
