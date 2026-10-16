interface StatsClusterStyles {
  container: Record<string, unknown>;
  stat: Record<string, unknown>;
  statLast: Record<string, unknown>;
  statWide: Record<string, unknown>;
  label: Record<string, unknown>;
  value: Record<string, unknown>;
  valueAccent: Record<string, unknown>;
  valueDanger: Record<string, unknown>;
  valueSuccess: Record<string, unknown>;
  valueAttention: Record<string, unknown>;
  delta: Record<string, unknown>;
  deltaSuccess: Record<string, unknown>;
  deltaDanger: Record<string, unknown>;
  deltaAttention: Record<string, unknown>;
  deltaIcon: Record<string, unknown>;
  meter: Record<string, unknown>;
  meterFill: Record<string, unknown>;
  meterWarn: Record<string, unknown>;
  meterOver: Record<string, unknown>;
  meterFarOver: Record<string, unknown>;
  meterLegend: Record<string, unknown>;
  meterLegendPct: Record<string, unknown>;
}

/** Tira de stats del mockup (`.stats` / `.stat`): `.meter` opcional y estados ámbar/rojo/violeta. */
export const styles: StatsClusterStyles = {
  container: {
    display: 'flex',
    alignItems: 'stretch',
    gap: 0,
    padding: '20px var(--gutter)',
    borderBottom: '1px solid var(--border-soft)',
    overflowX: 'auto',
  },
  stat: {
    flex: '0 0 auto',
    minWidth: '150px',
    paddingRight: '24px',
    marginRight: '24px',
    borderRight: '1px solid var(--border-muted)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  statLast: {
    borderRight: 0,
    marginRight: 0,
    paddingRight: 0,
  },
  statWide: {
    flex: '1 1 260px',
    minWidth: '240px',
    gap: '8px',
  },
  label: {
    fontSize: '11.5px',
    color: 'var(--text-tertiary)',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  value: {
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums',
    fontSize: 'var(--fs-19)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
  },
  valueAccent: { color: 'var(--accent)' },
  valueDanger: { color: 'var(--danger)' },
  valueSuccess: { color: 'var(--success)' },
  valueAttention: { color: 'var(--attention)' },
  delta: {
    fontSize: '11.5px',
    marginTop: '4px',
    color: 'var(--text-tertiary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  deltaSuccess: { color: 'var(--success)' },
  deltaDanger: { color: 'var(--danger)' },
  deltaAttention: { color: 'var(--attention)' },
  deltaIcon: {
    width: 12,
    height: 12,
    fontSize: '12px',
  },
  meter: {
    height: '6px',
    background: 'var(--bg-elevated)',
    borderRadius: '3px',
    overflow: 'hidden',
    position: 'relative',
  },
  meterFill: {
    display: 'block',
    height: '100%',
    background: 'var(--accent)',
    borderRadius: '3px',
    transition: 'width 0.3s var(--ease)',
  },
  meterWarn: { background: 'var(--attention)' },
  meterOver: { background: 'var(--danger)' },
  meterFarOver: { background: 'var(--done)' },
  meterLegend: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11.5px',
    color: 'var(--text-tertiary)',
  },
  meterLegendPct: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent)',
  },
};
