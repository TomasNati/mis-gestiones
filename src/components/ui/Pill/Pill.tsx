'use client';

import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { styles, toneStyles } from './Pill.styles';

/** Tono del pill. `neutral` = `.pill` sin clase (gris del sistema). */
export type PillVariant = 'neutral' | 'success' | 'attention' | 'severe' | 'danger' | 'done' | 'accent';

export interface PillProps {
  children: ReactNode;
  variant?: PillVariant;
  /** `.pill.outline`: mismo tono, sin fondo (para listas densas). */
  outline?: boolean;
  /** `.method`: ancho fijo y mono, para métodos HTTP (GET/POST…). */
  method?: boolean;
  /** Punto del color del tono (se usa junto con `outline`). */
  dot?: boolean;
  icon?: ReactNode;
  title?: string;
}

/**
 * Etiqueta de estado/tipo (`.pill` del mockup). Los colores semánticos se usan
 * solo para estado y siempre junto a texto (regla del sistema).
 */
const Pill = ({ children, variant = 'neutral', outline, method, dot, icon, title }: PillProps) => {
  return (
    <Box
      component="span"
      title={title}
      sx={{
        ...styles.base,
        ...(variant !== 'neutral' && toneStyles[variant]),
        ...(outline && styles.outline),
        ...(method && styles.method),
      }}
    >
      {icon && <Box sx={styles.icon}>{icon}</Box>}
      {dot && <Box component="span" sx={styles.dot} />}
      {children}
    </Box>
  );
};

export { Pill };
