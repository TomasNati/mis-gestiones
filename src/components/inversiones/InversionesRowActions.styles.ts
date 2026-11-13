interface InversionesRowActionsStyles {
  container: Record<string, unknown>;
  iconButton: Record<string, unknown>;
  danger: Record<string, unknown>;
}

/**
 * Acciones de fila de Inversiones (`.table .row-actions .icon-btn`):
 * botones de 24px (`.icon-btn.xs`), neutros por defecto y rojo al hover el de
 * eliminar (`.icon-btn.danger`). La visibilidad al hover la maneja `mrtTable`.
 */
export const styles: InversionesRowActionsStyles = {
  container: {
    display: 'inline-flex',
    gap: '2px',
    whiteSpace: 'nowrap',
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: '24px',
    height: '24px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    '&:hover': {
      backgroundColor: 'var(--bg-row-hover)',
      color: 'var(--text-primary)',
    },
    '& .MuiSvgIcon-root': { fontSize: '16px' },
  },
  danger: {
    '&:hover': {
      backgroundColor: 'var(--danger-soft)',
      color: 'var(--danger)',
    },
  },
};
