interface PillStyles {
  base: Record<string, unknown>;
  icon: Record<string, unknown>;
  dot: Record<string, unknown>;
  outline: Record<string, unknown>;
  method: Record<string, unknown>;
}

/** Etiqueta de estado/tipo del mockup (`.pill`). */
export const styles: PillStyles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    height: '20px',
    padding: '0 8px',
    borderRadius: 'var(--radius-pill)',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    border: '1px solid var(--neutral-border)',
    background: 'var(--neutral-soft)',
    color: 'var(--text-secondary)',
  },
  icon: {
    width: 12,
    height: 12,
    fontSize: '12px',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'currentColor',
  },
  /** `.pill.outline`: conserva el color del tono pero sin fondo. */
  outline: {
    background: 'transparent',
  },
  /** `.method` (settings): ancho fijo + mono para métodos HTTP. */
  method: {
    minWidth: 62,
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '.02em',
  },
};

/** Tono del pill (`.pill.{variant}`): color de texto, borde y fondo. */
export const toneStyles: Record<string, Record<string, unknown>> = {
  success: {
    color: 'var(--success)',
    borderColor: 'var(--success-border)',
    background: 'var(--success-soft)',
  },
  attention: {
    color: 'var(--attention)',
    borderColor: 'var(--attention-border)',
    background: 'var(--attention-soft)',
  },
  severe: {
    color: 'var(--severe)',
    borderColor: 'var(--severe-border)',
    background: 'var(--severe-soft)',
  },
  danger: {
    color: 'var(--danger)',
    borderColor: 'var(--danger-border)',
    background: 'var(--danger-soft)',
  },
  done: {
    color: 'var(--done)',
    borderColor: 'var(--done-border)',
    background: 'var(--done-soft)',
  },
  accent: {
    color: 'var(--accent)',
    borderColor: 'rgba(68, 147, 248, 0.4)',
    background: 'var(--accent-soft)',
  },
};
