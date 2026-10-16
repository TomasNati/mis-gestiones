interface LayoutStyles {
  drawer: Record<string, unknown>;
  drawerPaper: Record<string, unknown>;
  brand: Record<string, unknown>;
  brandLink: Record<string, unknown>;
  brandMark: Record<string, unknown>;
  brandName: Record<string, unknown>;
  toggle: Record<string, unknown>;
  nav: Record<string, unknown>;
  navFooter: Record<string, unknown>;
  navItem: Record<string, unknown>;
  navItemSub: Record<string, unknown>;
  navItemActive: Record<string, unknown>;
  navItemParentActive: Record<string, unknown>;
  navItemCollapsed: Record<string, unknown>;
  navItemSubCollapsed: Record<string, unknown>;
  navSubCollapsed: Record<string, unknown>;
  navIcon: Record<string, unknown>;
  navLabel: Record<string, unknown>;
  navCaret: Record<string, unknown>;
  navCaretOpen: Record<string, unknown>;
  navSub: Record<string, unknown>;
  main: Record<string, unknown>;
}

/**
 * Sidebar según `docs/mockups/assets/app.css` (`.sidebar`, `.nav-item`, `.nav-sub`).
 * Anchos: `--sidebar-w` 232 / `--sidebar-w-collapsed` 56.
 */
export const styles: LayoutStyles = {
  drawer: {
    flexShrink: 0,
  },
  drawerPaper: {
    boxSizing: 'border-box',
    bottom: 0,
    height: 'auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: '12px 10px',
    // El mockup separa la barra con borde sobre el fondo de página, no con panel.
    background: 'var(--bg-page)',
    borderRight: '1px solid var(--border-soft)',
    color: 'var(--text-secondary)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    padding: '4px 4px 12px 6px',
    marginBottom: '8px',
    borderBottom: '1px solid var(--border-muted)',
  },
  brandLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0,
    color: 'inherit',
  },
  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 'var(--radius)',
    background: 'var(--accent-emphasis)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '13px',
    flexShrink: 0,
  },
  brandName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 'var(--fs-14)',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
  },
  toggle: {
    color: 'var(--text-tertiary)',
    flexShrink: 0,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    marginTop: 'auto',
    paddingTop: '8px',
    borderTop: '1px solid var(--border-muted)',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    height: '32px',
    padding: '0 8px',
    borderRadius: 'var(--radius)',
    color: 'var(--text-secondary)',
    fontSize: '13.5px',
    whiteSpace: 'nowrap',
    position: 'relative',
    transition: 'background 0.12s var(--ease), color 0.12s var(--ease)',
    '&:hover': {
      background: 'var(--bg-row-hover)',
      color: 'var(--text-primary)',
      '& .nav-icon': { color: 'var(--text-primary)' },
    },
  },
  /** `.nav-sub .nav-item`: un poco más bajo y con rail a la izquierda. */
  navItemSub: {
    height: '30px',
    fontSize: '13px',
    paddingLeft: '12px',
  },
  /** `.nav-item.is-active`: fondo acento suave + barra de 3px a la izquierda. */
  navItemActive: {
    background: 'var(--accent-soft)',
    color: 'var(--text-primary)',
    fontWeight: 500,
    '& .nav-icon': { color: 'var(--accent)' },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '-10px',
      top: '6px',
      bottom: '6px',
      width: '3px',
      borderRadius: '0 3px 3px 0',
      background: 'var(--accent)',
    },
  },
  /** `.nav-item.is-parent-active`: solo se aclara el texto (el hijo lleva el activo). */
  navItemParentActive: {
    color: 'var(--text-primary)',
  },
  /** `body.sidebar-collapsed .nav-item`: sólo ícono, centrado. */
  navItemCollapsed: {
    justifyContent: 'center',
    padding: 0,
    // 2px para que el ícono + caret entren en el riel de 56px.
    gap: '2px',
  },
  /**
   * Colapsado: los hijos del submenú se muestran como íconos centrados (sin riel
   * ni etiqueta) para poder entrar al submenú sin expandir la barra.
   * **Desvío deliberado del mockup** (el mock esconde el `.nav-sub` al colapsar).
   */
  navItemSubCollapsed: {
    justifyContent: 'center',
    padding: 0,
    gap: 0,
    // Sin barra de activo: el ícono acento + fondo ya marcan la selección.
    '&::before': { display: 'none' },
  },
  navIcon: {
    width: 18,
    height: 18,
    fontSize: '18px',
    color: 'var(--text-tertiary)',
    flexShrink: 0,
  },
  navLabel: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  navCaret: {
    marginLeft: 'auto',
    width: 16,
    height: 16,
    fontSize: '16px',
    color: 'var(--text-tertiary)',
    transition: 'transform 0.15s var(--ease)',
    transform: 'rotate(-90deg)',
    flexShrink: 0,
  },
  navCaretOpen: {
    transform: 'rotate(0deg)',
  },
  /** `.nav-sub`: riel vertical de 1px detrás de los hijos. */
  navSub: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    margin: '2px 0 6px',
    paddingLeft: '14px',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '15px',
      top: '4px',
      bottom: '4px',
      width: '1px',
      background: 'var(--border-muted)',
    },
    '& .nav-icon': { width: 14, height: 14, fontSize: '14px' },
  },
  /** `.nav-sub` colapsado: sin riel y con los hijos centrados. */
  navSubCollapsed: {
    paddingLeft: '2px',
    '&::before': { display: 'none' },
  },
  main: {
    flexGrow: 1,
    background: 'var(--bg-page)',
    // TODO(rediseño-tema): quitar este padding cuando cada página aporte su
    // propio `--gutter` (`.topbar` / `.section` del mockup). Hoy se mantiene
    // para no dejar sin aire a las páginas todavía no migradas.
    p: 3,
    height: '100vh',
    overflow: 'auto',
  },
};
