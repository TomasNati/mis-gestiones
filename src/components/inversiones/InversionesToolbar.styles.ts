import { dateFieldSx } from './dateField.styles';

interface InversionesToolbarStyles {
  actions: Record<string, unknown>;
  segmented: Record<string, unknown>;
  neutralButton: Record<string, unknown>;
  divider: Record<string, unknown>;
  dateField: Record<string, unknown>;
  currencyBar: Record<string, unknown>;
  summary: Record<string, unknown>;
  summaryNum: Record<string, unknown>;
  spacer: Record<string, unknown>;
}

/**
 * Controles de Inversiones según el mockup: `.topbar-actions` (fecha, guardar,
 * sobreescribir, gráficos, nueva) y `.toolbar.currency-bar` (moneda, tipo de
 * cambio, resúmenes). Fuente: docs/mockups/inversiones.html + assets/app.css.
 */
export const styles: InversionesToolbarStyles = {
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  segmented: {
    backgroundColor: 'var(--bg-inset)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius)',
    padding: '2px',
    height: 'var(--control-h-sm)',
    '& .MuiToggleButtonGroup-grouped': {
      margin: 0,
      border: 0,
      borderRadius: '4px',
      height: '100%',
      padding: '0 8px',
      fontSize: '12px',
      fontWeight: 500,
      color: 'var(--text-secondary)',
      '&:hover': {
        color: 'var(--text-primary)',
        backgroundColor: 'transparent',
      },
      '&.Mui-selected': {
        backgroundColor: 'var(--bg-emphasis)',
        color: 'var(--text-primary)',
      },
      '&.Mui-selected:hover': {
        backgroundColor: 'var(--bg-emphasis)',
      },
    },
  },
  neutralButton: {
    color: 'var(--text-secondary)',
    borderColor: 'var(--border-soft)',
    backgroundColor: 'transparent',
    '&:hover': {
      color: 'var(--text-primary)',
      borderColor: 'var(--border-strong)',
      backgroundColor: 'var(--bg-row-hover)',
    },
  },
  divider: {
    width: '1px',
    height: '20px',
    backgroundColor: 'var(--border-muted)',
    mx: '4px',
  },
  dateField: dateFieldSx,
  currencyBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    minHeight: '48px',
    padding: '8px var(--gutter)',
    borderTop: '1px solid var(--border-soft)',
    borderBottom: '1px solid var(--border-soft)',
  },
  summary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  summaryNum: {
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
  },
  spacer: { flex: 1 },
};
