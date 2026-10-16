'use client';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ApiOutlinedIcon from '@mui/icons-material/ApiOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import { Box, Drawer, IconButton } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ElementType, type ReactNode } from 'react';
import { styles } from './Layout.styles';

const DRAWER_WIDTH = 232;
const DRAWER_COLLAPSED_WIDTH = 56;

interface LinkItem {
  text: string;
  href: string;
  icon: ElementType;
  submenu?: LinkItem[];
}

/**
 * Menú en el orden del mockup (`shell.js` → NAV). **Sin Importar**.
 * `Resumen` apunta a `/finanzas` (página nueva, ver Fase 2 del plan).
 */
const LINKS: LinkItem[] = [
  { text: 'Tomi', href: '/tomi', icon: FaceOutlinedIcon },
  {
    text: 'Finanzas',
    href: '/finanzas',
    icon: AccountBalanceWalletOutlinedIcon,
    submenu: [
      { text: 'Resumen', href: '/finanzas', icon: DashboardOutlinedIcon },
      { text: 'Movimientos', href: '/finanzas/movimientosDelMes', icon: ReceiptLongOutlinedIcon },
      { text: 'Presupuesto', href: '/finanzas/presupuestoDelMes', icon: BarChartIcon },
      { text: 'Vencimientos', href: '/finanzas/vencimientos', icon: ScheduleIcon },
      { text: 'Buscar', href: '/finanzas/buscarMovimientos', icon: ManageSearchOutlinedIcon },
    ],
  },
  { text: 'Inversiones', href: '/inversiones', icon: ShowChartIcon },
];

/** `NAV_FOOTER` del mockup: Configuración → Categorías / API. */
const FOOTER_LINKS: LinkItem[] = [
  {
    text: 'Configuración',
    href: '/settings',
    icon: SettingsIcon,
    submenu: [
      { text: 'Categorías', href: '/settings/admin', icon: AccountTreeOutlinedIcon },
      { text: 'API', href: '/settings/api', icon: ApiOutlinedIcon },
    ],
  },
];

interface LayoutProps {
  children: ReactNode;
}

const isPathActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

/**
 * De los hijos, el que mejor matchea el pathname actual (el href más largo).
 * Permite que `Resumen` (`/finanzas`) no quede activo en `/finanzas/movimientosDelMes`.
 */
const activeChildHref = (pathname: string, item: LinkItem) => {
  if (!item.submenu?.length) return undefined;
  const matches = item.submenu.filter((child) => isPathActive(pathname, child.href));
  if (!matches.length) return undefined;
  return matches.sort((a, b) => b.href.length - a.href.length)[0].href;
};

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  // Override explícito por item (`true` abierto / `false` cerrado). Sin override,
  // el submenú se auto-abre si hay un hijo activo. El override se limpia al
  // cambiar de ruta para que al entrar a una sección se vea el árbol de nuevo.
  const [submenuState, setSubmenuState] = useState<Record<string, boolean>>({});
  const [lastPathname, setLastPathname] = useState(pathname);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setSubmenuState({});
  }

  const drawerWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const toggleSubmenu = (href: string, open: boolean) => {
    setSubmenuState((current) => ({ ...current, [href]: !open }));
  };

  const renderItem = (item: LinkItem, depth: number, parentActiveChild?: string) => {
    const hasSubmenu = !!item.submenu?.length;
    const childHref = hasSubmenu ? activeChildHref(pathname, item) : undefined;

    // Un padre con hijos nunca queda `is-active`: el activo lo lleva el hijo (como el mockup).
    const isActive =
      depth === 0 ? !hasSubmenu && isPathActive(pathname, item.href) : item.href === parentActiveChild;

    const isParentActive = hasSubmenu && childHref !== undefined;
    // Auto-abierto si hay un hijo activo; el click del usuario manda.
    const open = submenuState[item.href] ?? isParentActive;

    return (
      <Box key={`${depth}-${item.href}-${item.text}`}>
        <Box
          component={Link}
          href={item.href}
          title={collapsed ? item.text : undefined}
          aria-label={collapsed ? item.text : undefined}
          aria-current={isActive ? 'page' : undefined}
          aria-expanded={hasSubmenu ? open : undefined}
          sx={{
            ...styles.navItem,
            ...(depth > 0 && styles.navItemSub),
            ...(isActive && styles.navItemActive),
            ...(depth > 0 && isActive && !collapsed && { '&::before': { left: '-13px' } }),
            ...(isParentActive && styles.navItemParentActive),
            // Overrides de colapsado al final para que ganen sobre los de arriba.
            ...(collapsed && styles.navItemCollapsed),
            ...(collapsed && depth > 0 && styles.navItemSubCollapsed),
            ...(collapsed && depth === 0 && isActive && { '&::before': { left: '-8px' } }),
          }}
        >
          <item.icon className="nav-icon" sx={styles.navIcon} />
          {!collapsed && <Box component="span" sx={styles.navLabel}>{item.text}</Box>}
          {hasSubmenu && (
            <Box
              component="span"
              role="button"
              tabIndex={0}
              aria-label={open ? 'Contraer submenú' : 'Expandir submenú'}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleSubmenu(item.href, open);
              }}
              sx={{
                ...styles.navCaret,
                ...(open && styles.navCaretOpen),
                // Colapsado: ícono + caret tienen que entrar en el riel de 56px.
                ...(collapsed && { marginLeft: 0, width: 14, height: 14, fontSize: '14px' }),
              }}
            >
              <ExpandMoreIcon fontSize="inherit" />
            </Box>
          )}
        </Box>

        {hasSubmenu && open && (
          <Box sx={{ ...styles.navSub, ...(collapsed && styles.navSubCollapsed) }}>
            {item.submenu!.map((child) => renderItem(child, depth + 1, childHref))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <Drawer
        sx={{
          ...styles.drawer,
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            ...(styles.drawerPaper as object),
            width: drawerWidth,
          },
        }}
        variant="permanent"
        anchor="left"
        elevation={0}
      >
        <Box sx={{ ...styles.brand, ...(collapsed && { flexDirection: 'column', gap: '8px', padding: '4px 0 12px' }) }}>
          <Box component={Link} href="/" title="Mis gestiones" sx={styles.brandLink}>
            <Box sx={styles.brandMark}>M</Box>
            {!collapsed && <Box sx={styles.brandName}>Mis gestiones</Box>}
          </Box>
          <IconButton
            size="small"
            onClick={() => setCollapsed((value) => !value)}
            sx={styles.toggle}
            title={collapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
          >
            <ViewSidebarOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box component="nav" sx={styles.nav}>
          {LINKS.map((item) => renderItem(item, 0))}
        </Box>

        <Box component="nav" sx={styles.navFooter}>
          {FOOTER_LINKS.map((item) => renderItem(item, 0))}
        </Box>
      </Drawer>

      <Box component="main" sx={{ ...styles.main, ml: `${drawerWidth}px` }}>
        {children}
      </Box>
    </>
  );
};

export { Layout };
