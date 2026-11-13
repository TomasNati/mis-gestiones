interface HistorialInversionesStyles {
  segmented: Record<string, unknown>;
  rangoPersonalizado: Record<string, unknown>;
  grafico: Record<string, unknown>;
  placeholder: Record<string, unknown>;
}

/** Panel de historial: `.segmented.sm` del mockup + fila de rango personalizado. */
export const styles: HistorialInversionesStyles = {
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
      gap: '6px',
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
  rangoPersonalizado: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  grafico: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    inlineSize: '100%',
  },
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px 0',
    inlineSize: '100%',
  },
};
