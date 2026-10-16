interface MonthStripStyles {
  months: Record<string, unknown>;
  monthsMulti: Record<string, unknown>;
  year: Record<string, unknown>;
  monthNav: Record<string, unknown>;
  monthTab: Record<string, unknown>;
  monthTabActive: Record<string, unknown>;
  monthTabCurrent: Record<string, unknown>;
  monthTabActiveMulti: Record<string, unknown>;
  count: Record<string, unknown>;
  countActive: Record<string, unknown>;
  yr: Record<string, unknown>;
  spacer: Record<string, unknown>;
  stripEnd: Record<string, unknown>;
}

/** Tira de meses/tabs del mockup (`.months` + `.month-tab`). */
export const styles: MonthStripStyles = {
  months: {
    display: 'flex',
    alignItems: 'stretch',
    gap: 0,
    padding: '0 var(--gutter)',
    borderBottom: '1px solid var(--border-soft)',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  /** `.months--multi`: tabs tipo chip (presupuesto / settings). */
  monthsMulti: {
    alignItems: 'center',
  },
  year: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    padding: '0 10px 0 0',
    marginRight: '8px',
    border: 0,
    background: 'none',
    borderRight: '1px solid var(--border-muted)',
    cursor: 'pointer',
    '&:hover': {
      color: 'var(--text-primary)',
    },
    '& .MuiSvgIcon-root': {
      color: 'var(--text-tertiary)',
    },
  },
  monthNav: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    alignSelf: 'center',
    border: 0,
    background: 'none',
    cursor: 'pointer',
    color: 'var(--text-tertiary)',
    borderRadius: 'var(--radius)',
    '&:hover': {
      color: 'var(--text-primary)',
      background: 'var(--bg-row-hover)',
    },
    '&:disabled': {
      opacity: 0.3,
      pointerEvents: 'none',
    },
  },
  monthTab: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '6px',
    padding: '11px 10px 12px',
    margin: '0 1px',
    border: 0,
    borderBottom: '2px solid transparent',
    background: 'none',
    cursor: 'pointer',
    fontSize: '13.5px',
    color: 'var(--text-tertiary)',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s var(--ease)',
    '&:hover': {
      color: 'var(--text-secondary)',
    },
  },
  monthTabActive: {
    color: 'var(--text-primary)',
    borderBottomColor: 'var(--accent)',
  },
  /** `.month-tab.is-current::after` — punto del mes actual. */
  monthTabCurrent: {
    '&::after': {
      content: '""',
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'var(--accent)',
      alignSelf: 'center',
      marginLeft: '-2px',
    },
  },
  /** `.months--multi .month-tab.is-active`: chip con fondo. */
  monthTabActiveMulti: {
    margin: '8px 1px',
    padding: '4px 8px',
    border: '1px solid transparent',
    borderRadius: 'var(--radius)',
    alignSelf: 'center',
    background: 'var(--accent-soft)',
    borderColor: 'transparent',
    color: 'var(--text-primary)',
    '&::before': {
      content: '""',
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--accent)',
      alignSelf: 'center',
    },
  },
  count: {
    display: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-tertiary)',
  },
  countActive: {
    display: 'inline',
    color: 'var(--accent)',
  },
  yr: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-tertiary)',
  },
  spacer: {
    flex: 1,
  },
  stripEnd: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    paddingLeft: '12px',
    borderLeft: '1px solid var(--border-muted)',
    marginLeft: '8px',
  },
};
