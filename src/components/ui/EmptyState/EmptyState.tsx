'use client';

import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { styles } from './EmptyState.styles';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Acción principal (botón) debajo del texto. */
  action?: ReactNode;
}

/** Bloque vacío (`.empty` del mockup): ícono, título, texto y acción opcional. */
const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <Box sx={styles.container}>
      {icon && <Box sx={styles.icon}>{icon}</Box>}
      <Box component="h3" sx={styles.title}>
        {title}
      </Box>
      {description && <Box component="p" sx={styles.description}>{description}</Box>}
      {action && <Box sx={styles.action}>{action}</Box>}
    </Box>
  );
};

export { EmptyState };
