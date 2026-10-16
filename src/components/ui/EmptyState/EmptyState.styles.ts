interface EmptyStateStyles {
  container: Record<string, unknown>;
  icon: Record<string, unknown>;
  title: Record<string, unknown>;
  description: Record<string, unknown>;
  action: Record<string, unknown>;
}

/** Bloque vacío del mockup (`.empty`). */
export const styles: EmptyStateStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '8px',
    padding: '48px 24px',
    color: 'var(--text-secondary)',
  },
  icon: {
    width: 28,
    height: 28,
    fontSize: '28px',
    color: 'var(--text-tertiary)',
  },
  title: {
    fontSize: '14px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
  },
  description: {
    fontSize: '13px',
    maxWidth: '36ch',
  },
  action: {
    marginTop: '8px',
  },
};
