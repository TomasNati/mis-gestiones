interface SkeletonRowsStyles {
  container: Record<string, unknown>;
  row: Record<string, unknown>;
  bar: Record<string, unknown>;
}

/** Estado de carga del mockup (`.skeleton` + `@keyframes shimmer`). */
export const styles: SkeletonRowsStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '16px var(--gutter)',
  },
  row: {
    display: 'grid',
    gap: '16px',
  },
  bar: {
    display: 'inline-block',
    height: '12px',
    borderRadius: '4px',
    background:
      'linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-emphasis) 50%, var(--bg-elevated) 75%)',
    backgroundSize: '400% 100%',
    animation: 'shimmer 1.4s ease infinite',
  },
};

/** Anchos variables por columna para que el esqueleto no parezca una grilla rígida. */
export const barWidths = ['100%', '62%', '80%', '48%', '90%', '70%'];
