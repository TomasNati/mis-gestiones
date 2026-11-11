interface ComposicionInversionesStyles {
  table: Record<string, unknown>;
  row: Record<string, unknown>;
  tipo: Record<string, unknown>;
  barCell: Record<string, unknown>;
  track: Record<string, unknown>;
  fill: Record<string, unknown>;
  pct: Record<string, unknown>;
  monto: Record<string, unknown>;
  placeholder: Record<string, unknown>;
}

/**
 * Panel de composición por tipo de instrumento (`.type-table` / `.hbar` del
 * mockup): filas densas con barra relativa al tipo más grande.
 */
export const styles: ComposicionInversionesStyles = {
  table: {
    inlineSize: '100%',
    borderCollapse: 'collapse',
  },
  row: {
    '& td': {
      borderBottom: '1px solid var(--border-muted)',
      padding: '5px 0',
      verticalAlign: 'middle',
    },
    '& td:not(:last-of-type)': {
      paddingRight: '12px',
    },
    '&:last-of-type td': {
      borderBottom: 0,
    },
  },
  tipo: {
    color: 'var(--text-secondary)',
    fontSize: 'var(--fs-12)',
    whiteSpace: 'nowrap',
  },
  barCell: {
    width: '45%',
  },
  track: {
    display: 'block',
    width: '100%',
    height: '14px',
    backgroundColor: 'var(--bg-elevated)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  fill: {
    display: 'block',
    height: '100%',
    backgroundColor: 'var(--accent)',
    borderRadius: '0 3px 3px 0',
  },
  pct: {
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums',
    fontSize: 'var(--fs-12)',
    color: 'var(--text-primary)',
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  monto: {
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums',
    fontSize: 'var(--fs-12)',
    color: 'var(--text-tertiary)',
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px 0',
    inlineSize: '100%',
  },
};
