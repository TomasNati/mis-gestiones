interface PageHeaderStyles {
  topbar: Record<string, unknown>;
  left: Record<string, unknown>;
  breadcrumb: Record<string, unknown>;
  crumbLink: Record<string, unknown>;
  sep: Record<string, unknown>;
  current: Record<string, unknown>;
  actions: Record<string, unknown>;
  subtitle: Record<string, unknown>;
}

/** Topbar del mockup (`.topbar` / `.breadcrumb` / `.topbar-actions`). */
export const styles: PageHeaderStyles = {
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '18px var(--gutter) 14px',
  },
  left: {
    minWidth: 0,
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--fs-19)',
    color: 'var(--text-tertiary)',
    minWidth: 0,
  },
  crumbLink: {
    color: 'inherit',
    '&:hover': {
      color: 'var(--text-secondary)',
    },
  },
  sep: {
    color: 'var(--border-strong)',
    fontWeight: 300,
  },
  current: {
    color: 'var(--text-primary)',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    marginTop: '2px',
  },
};
