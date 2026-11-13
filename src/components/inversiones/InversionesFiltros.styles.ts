import type { SxProps } from '@mui/system';

interface InversionesFiltrosStyles {
  bar: SxProps;
  filtrosButton: SxProps;
  countBadge: SxProps;
  chips: SxProps;
  chip: SxProps;
  chipFacet: SxProps;
  spacer: SxProps;
  search: SxProps;
  popover: SxProps;
  popoverHeader: SxProps;
  popoverClear: SxProps;
  grupo: SxProps;
  grupoTitulo: SxProps;
  opciones: SxProps;
  opcion: SxProps;
}

/**
 * Barra de filtros de Inversiones, según `.toolbar.filters-bar`, `.popover`,
 * `.chips` y `.badge` del mockup (`docs/mockups/inversiones.html`).
 */
export const styles: InversionesFiltrosStyles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    minHeight: '48px',
    padding: '8px var(--gutter)',
    borderBottom: '1px solid var(--border-soft)',
  },
  filtrosButton: {
    height: 'var(--control-h-sm)',
    padding: '0 10px',
    gap: '6px',
    textTransform: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    borderColor: 'var(--border-soft)',
    backgroundColor: 'transparent',
    '&:hover': {
      color: 'var(--text-primary)',
      borderColor: 'var(--border-strong)',
      backgroundColor: 'var(--bg-row-hover)',
    },
    '& .MuiSvgIcon-root': { fontSize: 18 },
  },
  countBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 18,
    height: 18,
    padding: '0 6px',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: 'var(--accent-emphasis)',
    color: '#fff',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 500,
    lineHeight: 1,
  },
  chips: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '4px',
    minWidth: 0,
  },
  chip: {
    height: 22,
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border-soft)',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--text-primary)',
    '& .MuiChip-label': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '0 8px',
    },
    '& .MuiChip-deleteIcon': {
      margin: '0 4px 0 -2px',
      fontSize: 14,
      color: 'var(--text-tertiary)',
      '&:hover': { color: 'var(--text-primary)' },
    },
  },
  chipFacet: {
    color: 'var(--text-tertiary)',
  },
  spacer: {
    flex: 1,
  },
  search: {
    width: 260,
    maxWidth: '100%',
    '& .MuiOutlinedInput-root': {
      height: 'var(--control-h-sm)',
      padding: '0 8px 0 10px',
      backgroundColor: 'var(--bg-inset)',
      borderRadius: 'var(--radius)',
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      '& fieldset': { borderColor: 'var(--border-soft)' },
      '&:hover fieldset': { borderColor: 'var(--border-strong)' },
      '&.Mui-focused fieldset': { borderColor: 'var(--accent-emphasis)' },
    },
    '& .MuiInputBase-input': {
      height: '100%',
      padding: 0,
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      color: 'var(--text-primary)',
      '&::placeholder': { color: 'var(--text-tertiary)', opacity: 1 },
    },
    '& .MuiInputAdornment-root': {
      marginRight: '6px',
      color: 'var(--text-tertiary)',
    },
    '& .MuiIconButton-root': { padding: '2px', color: 'var(--text-tertiary)' },
  },
  popover: {
    marginTop: '4px',
    minWidth: 320,
    maxWidth: 360,
    backgroundColor: 'var(--bg-overlay)',
    backgroundImage: 'none',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-overlay)',
  },
  popoverHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    padding: '8px 12px',
    borderBottom: '1px solid var(--border-muted)',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    '& b': { color: 'var(--text-primary)', fontWeight: 500 },
  },
  popoverClear: {
    minWidth: 0,
    padding: '2px 4px',
    textTransform: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--accent)',
  },
  grupo: {
    padding: '8px 12px',
    '& + &': { borderTop: '1px solid var(--border-muted)' },
  },
  grupoTitulo: {
    marginBottom: '6px',
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
  },
  opciones: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px 14px',
  },
  opcion: {
    margin: 0,
    '& .MuiFormControlLabel-label': {
      fontFamily: 'var(--font-body)',
      fontSize: '12.5px',
      color: 'var(--text-secondary)',
    },
    '& .MuiCheckbox-root': {
      padding: '4px 6px 4px 0',
      color: 'var(--text-tertiary)',
      '&.Mui-checked': { color: 'var(--accent)' },
    },
  },
};
