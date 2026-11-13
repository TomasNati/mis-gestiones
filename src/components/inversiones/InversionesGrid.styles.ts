import type { SxProps } from '@mui/system';

interface InversionesGridStyles {
  instrumentoPrincipal: SxProps;
  instrumentoSecundario: SxProps;
  moneda: SxProps;
  grupoTitulo: SxProps;
  grupoMeta: SxProps;
  subtotal: SxProps;
  subtotalValor: SxProps;
  gridToolbar: SxProps;
  groupByField: SxProps;
  groupByMenuItem: SxProps;
  emptyRows: SxProps;
  selectionChip: SxProps;
  selectionChipCount: SxProps;
  selectionChipSum: SxProps;
  bottomToolbar: SxProps;
  bottomToolbarSummary: SxProps;
  bottomToolbarNum: SxProps;
  pageSizeSelect: SxProps;
  pageSizeMenu: SxProps;
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
  /** Primera toolbar de la grilla (`.toolbar`): agrupar por + chip de selección. */
  gridToolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    minHeight: '56px',
    padding: '12px var(--gutter)',
    borderBottom: '1px solid var(--border-soft)',
  },
  groupByField: {
    minWidth: 90,
    '& .MuiOutlinedInput-root': {
      height: 'var(--control-h-sm)',
      backgroundColor: 'var(--bg-inset)',
      fontSize: '13px',
      fontFamily: 'var(--font-body)',
      '& fieldset': { borderColor: 'var(--border-soft)' },
      '&:hover fieldset': { borderColor: 'var(--border-strong)' },
      '&.Mui-focused fieldset': { borderColor: 'var(--accent-emphasis)' },
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 0,
      paddingBottom: 0,
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      color: 'var(--text-primary)',
    },
    '& .MuiInputLabel-root': {
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      color: 'var(--text-tertiary)',
      '&.Mui-focused': { color: 'var(--accent)' },
    },
    '& .MuiInputLabel-shrink': { fontSize: '12px' },
    '& .MuiSvgIcon-root': { color: 'var(--text-tertiary)', fontSize: '18px' },
  },
  groupByMenuItem: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    '&.Mui-selected': { color: 'var(--text-primary)' },
  },
  emptyRows: {
    padding: '24px 12px',
    textAlign: 'center',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--text-tertiary)',
  },
  /**
   * Chip de selección (`.bulk-actions` del mockup): muestra el total de las
   * filas tildadas. No altera la tira de stats ni los gráficos, que siempre
   * se calculan sobre toda la cartera.
   */
  selectionChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    height: 'var(--control-h-sm)',
    padding: '0 12px',
    border: '1px solid var(--border-soft)',
    backgroundColor: 'var(--accent-soft)',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
  },
  selectionChipCount: {
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  selectionChipSum: {
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums',
    color: 'var(--text-primary)',
  },
  bottomToolbar: {
    minHeight: 'unset',
    padding: '10px var(--gutter)',
    borderTop: '1px solid var(--border-soft)',
    boxShadow: 'none',
    fontSize: '12.5px',
    color: 'var(--text-secondary)',
    // Sin banner de selección/agrupación en el pie (el mockup no lo muestra).
    '& .MuiAlert-root': { display: 'none' },
    '& > :last-child': { padding: 0, alignItems: 'center' },
    '& .MuiTablePagination-root': { margin: 0, padding: 0, gap: '12px', flexWrap: 'nowrap' },
    '& .MuiTablePagination-root .MuiInputLabel-root': {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: '12.5px',
      color: 'var(--text-secondary)',
    },
    '& .MuiPagination-ul': { gap: '4px' },
    '& .MuiPaginationItem-root': {
      width: 26,
      height: 26,
      minWidth: 26,
      margin: 0,
      border: 0,
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
      color: 'var(--text-secondary)',
      '&:hover': { backgroundColor: 'var(--bg-row-hover)' },
      '&.Mui-selected': { backgroundColor: 'var(--accent-emphasis)', color: '#fff' },
    },
  },
  bottomToolbarSummary: {
    fontFamily: 'var(--font-body)',
    fontSize: '12.5px',
    color: 'var(--text-secondary)',
  },
  bottomToolbarNum: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
  },
  pageSizeSelect: {
    height: 'var(--control-h-sm)',
    minWidth: 64,
    margin: 0,
    backgroundColor: 'var(--bg-inset)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--text-primary)',
    '&:hover': { borderColor: 'var(--border-strong)' },
    '&::before, &::after': { display: 'none' },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      padding: '0 24px 0 8px',
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
    },
    '& .MuiSvgIcon-root': { right: 6, color: 'var(--text-tertiary)', fontSize: '18px' },
  },
  pageSizeMenu: {
    '& .MuiMenuItem-root': {
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      color: 'var(--text-secondary)',
      '&.Mui-selected': { color: 'var(--text-primary)' },
    },
  },
};
