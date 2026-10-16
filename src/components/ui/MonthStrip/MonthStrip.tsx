'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { styles } from './MonthStrip.styles';

export interface MonthStripItem {
  key: string;
  label: ReactNode;
  /** Año corto (`.yr`), para tiras que cruzan un cambio de año. */
  year?: ReactNode;
  /** Cantidad de movimientos (`.count`): solo se ve en el activo. */
  count?: ReactNode;
  /** `.is-current`: punto del mes actual. */
  current?: boolean;
}

export interface MonthStripNav {
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  prevTitle?: string;
  nextTitle?: string;
}

export interface MonthStripProps {
  items: MonthStripItem[];
  /** Clave activa; acepta varias para el variant `multi` (meses consecutivos). */
  activeKey?: string | string[];
  onSelect?: (key: string) => void;
  /** `underline` (default) o `multi` (tabs tipo chip, `.months--multi`). */
  variant?: 'underline' | 'multi';
  /** Slot a la izquierda del todo (típicamente el botón de año). */
  leading?: ReactNode;
  nav?: MonthStripNav;
  /** Slot a la derecha (`.strip-end`): chips, segmented, switch… */
  end?: ReactNode;
}

const toSet = (activeKey?: string | string[]) => {
  if (!activeKey) return new Set<string>();
  return new Set(Array.isArray(activeKey) ? activeKey : [activeKey]);
};

/**
 * Tira de meses/tabs (`.months` del mockup). Reutilizable como tabs de página
 * (variant `multi`) o como selector de período (default).
 */
const MonthStrip = ({ items, activeKey, onSelect, variant = 'underline', leading, nav, end }: MonthStripProps) => {
  const active = toSet(activeKey);
  const isMulti = variant === 'multi';

  return (
    <Box sx={{ ...styles.months, ...(isMulti && styles.monthsMulti) }}>
      {leading}

      {nav?.onPrev && (
        <Box
          component="button"
          type="button"
          title={nav.prevTitle}
          disabled={nav.prevDisabled}
          onClick={nav.onPrev}
          sx={styles.monthNav}
        >
          <ChevronLeftIcon fontSize="small" />
        </Box>
      )}

      {items.map((item) => {
        const isActive = active.has(item.key);

        return (
          <Box
            component="button"
            type="button"
            key={item.key}
            onClick={() => onSelect?.(item.key)}
            sx={{
              ...styles.monthTab,
              ...(isActive && !isMulti && styles.monthTabActive),
              ...(isActive && isMulti && styles.monthTabActiveMulti),
              ...(item.current && styles.monthTabCurrent),
            }}
          >
            {item.label}
            {item.year && <Box component="span" sx={styles.yr}>{item.year}</Box>}
            {item.count !== undefined && (
              <Box component="span" sx={{ ...styles.count, ...(isActive && styles.countActive) }}>
                {item.count}
              </Box>
            )}
          </Box>
        );
      })}

      {nav?.onNext && (
        <Box
          component="button"
          type="button"
          title={nav.nextTitle}
          disabled={nav.nextDisabled}
          onClick={nav.onNext}
          sx={styles.monthNav}
        >
          <ChevronRightIcon fontSize="small" />
        </Box>
      )}

      <Box sx={styles.spacer} />

      {end && <Box sx={styles.stripEnd}>{end}</Box>}
    </Box>
  );
};

export { MonthStrip };
