import type { SxProps } from '@mui/system';

interface EvolucionInversionesStyles {
  segmented: SxProps;
  separadorHeader: SxProps;
  rangoPersonalizado: SxProps;
  filtrosAplicados: SxProps;
  filtrosAplicadosTitulo: SxProps;
  subhead: SxProps;
  subheadTitle: SxProps;
  subheadHint: SxProps;
  spacer: SxProps;
  divider: SxProps;
  caption: SxProps;
  priceChartWrap: SxProps;
  priceLegend: SxProps;
  priceLegendItem: SxProps;
  priceSwatch: SxProps;
  priceLegendTipo: SxProps;
  priceLegendValor: SxProps;
  emptyInline: SxProps;
  filtrosButton: SxProps;
  countBadge: SxProps;
  popover: SxProps;
  popoverHeader: SxProps;
  popoverClear: SxProps;
  popoverGrupo: SxProps;
  popoverGrupoTitulo: SxProps;
  popoverGrupoCheck: SxProps;
  popoverTipoDot: SxProps;
  popoverGrupoCount: SxProps;
  popoverOpciones: SxProps;
  popoverOpcion: SxProps;
  popoverLinea: SxProps;
  popoverTick: SxProps;
  popoverNombre: SxProps;
  popoverFooter: SxProps;
  placeholder: SxProps;
}

export const styles: EvolucionInversionesStyles = {
  segmented: {
    backgroundColor: 'var(--bg-inset)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius)',
    padding: '2px',
    height: 'var(--control-h-sm)',
    '& .MuiToggleButtonGroup-grouped': {
      margin: 0,
      border: 0,
      borderRadius: '4px',
      height: '100%',
      padding: '0 8px',
      gap: '6px',
      fontSize: '12px',
      fontWeight: 500,
      color: 'var(--text-secondary)',
      '&:hover': {
        color: 'var(--text-primary)',
        backgroundColor: 'transparent',
      },
      '&.Mui-selected': {
        backgroundColor: 'var(--bg-emphasis)',
        color: 'var(--text-primary)',
      },
      '&.Mui-selected:hover': {
        backgroundColor: 'var(--bg-emphasis)',
      },
    },
  },
  separadorHeader: {
    width: '1px',
    height: '18px',
    backgroundColor: 'var(--border-soft)',
  },
  rangoPersonalizado: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
    padding: '8px 12px',
    backgroundColor: 'var(--bg-inset)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius)',
  },
  filtrosAplicados: {
    alignSelf: 'flex-start',
    marginBottom: '4px',
  },
  filtrosAplicadosTitulo: {
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  subhead: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '6px',
    inlineSize: '100%',
  },
  subheadTitle: {
    margin: 0,
    fontFamily: 'var(--font-display)',
    fontSize: '12.5px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  subheadHint: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
  },
  spacer: {
    flex: 1,
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-muted)',
    margin: '18px 0 16px',
    inlineSize: '100%',
  },
  caption: {
    marginBottom: '6px',
    fontSize: '11.5px',
    color: 'var(--text-tertiary)',
  },
  priceChartWrap: {
    inlineSize: '100%',
    minInlineSize: 480,
  },
  priceLegend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px 16px',
    marginTop: '12px',
  },
  priceLegendItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
  },
  priceSwatch: {
    display: 'inline-block',
    width: '14px',
    height: '2px',
    borderRadius: '1px',
  },
  priceLegendTipo: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10.5px',
    color: 'var(--text-tertiary)',
  },
  priceLegendValor: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
  },
  emptyInline: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 220,
    border: '1px dashed var(--border-soft)',
    borderRadius: 'var(--radius)',
    fontSize: '13px',
    color: 'var(--text-tertiary)',
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
  popover: {
    marginTop: '4px',
    minWidth: 400,
    maxWidth: 440,
    maxHeight: 'min(70vh, 480px)',
    overflowY: 'auto',
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
  popoverGrupo: {
    padding: '8px 12px',
    '& + &': { borderTop: '1px solid var(--border-muted)' },
  },
  popoverGrupoTitulo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px',
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
  },
  popoverGrupoCheck: {
    padding: '2px 4px 2px 0',
    color: 'var(--text-tertiary)',
    '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: 'var(--accent)' },
  },
  popoverTipoDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '2px',
  },
  popoverGrupoCount: {
    marginLeft: 'auto',
    fontFamily: 'var(--font-mono)',
    fontSize: '10.5px',
  },
  popoverOpciones: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  popoverOpcion: {
    margin: 0,
    '& .MuiFormControlLabel-label': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      minWidth: 0,
      fontFamily: 'var(--font-body)',
      fontSize: '12.5px',
      color: 'var(--text-secondary)',
    },
    '& .MuiCheckbox-root': {
      padding: '2px 4px 2px 0',
      color: 'var(--text-tertiary)',
      '&.Mui-checked': { color: 'var(--accent)' },
    },
  },
  popoverLinea: {
    display: 'inline-block',
    width: '14px',
    height: '2px',
    borderRadius: '1px',
    flexShrink: 0,
  },
  popoverTick: {
    minWidth: 118,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
  },
  popoverNombre: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 160,
    color: 'var(--text-tertiary)',
    fontSize: '11px',
  },
  popoverFooter: {
    position: 'sticky',
    bottom: 0,
    padding: '8px 12px',
    borderTop: '1px solid var(--border-muted)',
    backgroundColor: 'var(--bg-overlay)',
    fontFamily: 'var(--font-body)',
    fontSize: '11.5px',
    color: 'var(--text-tertiary)',
  },
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px 0',
    inlineSize: '100%',
  },
};
