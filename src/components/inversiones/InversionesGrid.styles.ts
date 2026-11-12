import type { SxProps } from '@mui/system';

interface InversionesGridStyles {
  instrumentoPrincipal: SxProps;
  instrumentoSecundario: SxProps;
  moneda: SxProps;
  grupoTitulo: SxProps;
  grupoMeta: SxProps;
  subtotal: SxProps;
  subtotalValor: SxProps;
}

/**
 * Celdas de la tabla de Inversiones según el mockup
 * (`.cell-primary`/`.cell-secondary`, `.num .cur`, `.row-group`, `.subtotal`).
 */
export const styles: InversionesGridStyles = {
  instrumentoPrincipal: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
  },
  instrumentoSecundario: {
    display: 'block',
    marginTop: '1px',
    fontSize: '12px',
    color: 'var(--text-tertiary)',
  },
  moneda: {
    marginRight: '3px',
    color: 'var(--text-tertiary)',
  },
  grupoTitulo: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  grupoMeta: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
  },
  subtotal: {
    textAlign: 'right',
    fontFamily: 'var(--font-mono)',
    fontSize: '12.5px',
    fontVariantNumeric: 'tabular-nums',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
  },
  subtotalValor: {
    color: 'var(--text-primary)',
    fontWeight: 500,
  },
};
