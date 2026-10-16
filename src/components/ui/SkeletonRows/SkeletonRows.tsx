'use client';

import { Box } from '@mui/material';
import { barWidths, styles } from './SkeletonRows.styles';

export interface SkeletonRowsProps {
  rows?: number;
  columns?: number;
}

/**
 * Estado de carga consistente (`.skeleton` del mockup).
 * El `@keyframes shimmer` vive en `globals.css`.
 */
const SkeletonRows = ({ rows = 6, columns = 4 }: SkeletonRowsProps) => {
  return (
    <Box aria-busy="true" aria-live="polite" sx={styles.container}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{ ...styles.row, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((__, colIndex) => (
            <Box
              key={colIndex}
              sx={{ ...styles.bar, width: barWidths[(rowIndex + colIndex) % barWidths.length] }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export { SkeletonRows };
