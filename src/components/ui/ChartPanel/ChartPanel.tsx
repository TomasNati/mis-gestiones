'use client';

import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { styles } from './ChartPanel.styles';

export interface ChartPanelProps {
  title: ReactNode;
  /** Texto secundario junto al título (`.panel-header .hint`). */
  hint?: ReactNode;
  /** Contenido a la derecha del header (leyenda u otra pista). */
  aside?: ReactNode;
  /** Gráfico o contenido del cuerpo del panel. */
  children: ReactNode;
}

/**
 * Panel de gráfico (`.panel` del mockup): header con título/hint/aside y cuerpo
 * con padding. La profundidad va por borde y el fondo `--bg-panel`, sin sombra.
 */
const ChartPanel = ({ title, hint, aside, children }: ChartPanelProps) => (
  <Box component="section" sx={styles.panel}>
    <Box sx={styles.header}>
      <Box component="h3" sx={styles.title}>
        {title}
        {hint && <Box component="span" sx={styles.hint}>{hint}</Box>}
      </Box>
      {aside && <Box sx={styles.aside}>{aside}</Box>}
    </Box>
    <Box sx={styles.body}>{children}</Box>
  </Box>
);

export { ChartPanel };
