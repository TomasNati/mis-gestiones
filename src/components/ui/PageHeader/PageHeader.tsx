'use client';

import { Box } from '@mui/material';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { styles } from './PageHeader.styles';

export interface Breadcrumb {
  label: ReactNode;
  /** Sin `href` se renderiza como la página actual (`strong`). */
  href?: string;
}

export interface PageHeaderProps {
  crumbs: Breadcrumb[];
  /** Acciones a la derecha (`.topbar-actions`). */
  actions?: ReactNode;
  subtitle?: ReactNode;
}

/**
 * Topbar de página (`.topbar` del mockup): breadcrumb a la izquierda y
 * acciones a la derecha. La última miga sin `href` se marca como actual.
 */
const PageHeader = ({ crumbs, actions, subtitle }: PageHeaderProps) => {
  return (
    <Box component="header" sx={styles.topbar}>
      <Box sx={styles.left}>
        <Box sx={styles.breadcrumb}>
          {crumbs.map((crumb, index) => (
            <Box key={index} sx={{ display: 'contents' }}>
              {index > 0 && (
                <Box component="span" sx={styles.sep}>
                  /
                </Box>
              )}
              {crumb.href ? (
                <Box component={Link} href={crumb.href} sx={styles.crumbLink}>
                  {crumb.label}
                </Box>
              ) : (
                <Box component="strong" sx={styles.current}>
                  {crumb.label}
                </Box>
              )}
            </Box>
          ))}
        </Box>
        {subtitle && <Box sx={styles.subtitle}>{subtitle}</Box>}
      </Box>

      {actions && <Box sx={styles.actions}>{actions}</Box>}
    </Box>
  );
};

export { PageHeader };
