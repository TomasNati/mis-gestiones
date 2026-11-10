interface ChartPanelStyles {
  panel: Record<string, unknown>;
  header: Record<string, unknown>;
  title: Record<string, unknown>;
  hint: Record<string, unknown>;
  aside: Record<string, unknown>;
  body: Record<string, unknown>;
}

/** Panel de gráfico (`.panel` / `.panel-header` / `.panel-body` del mockup). */
export const styles: ChartPanelStyles = {
  panel: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    backgroundColor: 'var(--bg-panel)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-soft)',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
    fontFamily: 'var(--font-body)',
    fontSize: '13.5px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  hint: {
    fontSize: 'var(--fs-12)',
    fontWeight: 400,
    color: 'var(--text-tertiary)',
  },
  aside: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: '12px',
  },
  body: {
    flex: 1,
    minWidth: 0,
    padding: '16px',
  },
};
