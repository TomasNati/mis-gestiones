import { SxProps } from '@mui/system';

interface MovimientosDelMesGrillaMRTStyles {
  tablePaper: SxProps;
  tableContainer: SxProps;
  tableHead: SxProps;
  tableBody: SxProps;
  tableBodyRow: SxProps;
  topToolbar: SxProps;
  bottomToolbar: SxProps;
  toolbar: SxProps;
  toolBtn: SxProps;
  spacer: SxProps;
  sumaLabel: SxProps;
  sumaValue: SxProps;
}

const colors = {
  background: 'var(--bg-page)',
  panelBackground: 'var(--bg-panel)',
  hoverBackground: 'var(--bg-row-hover)',
  scrollbarColor: 'var(--border-strong)',
  scrollbarTrackColor: 'var(--bg-page)',
  scrollbarThumbHoverColor: 'var(--text-tertiary)',
};

export const styles: MovimientosDelMesGrillaMRTStyles = {
  tablePaper: {
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
    overflow: 'auto',
    flex: 1,
    backgroundColor: colors.background,
    border: 'none',
  },
  tableContainer: {
    '&::-webkit-scrollbar': { width: '8px', height: '8px' },
    '&::-webkit-scrollbar-track': { backgroundColor: colors.scrollbarTrackColor },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: colors.scrollbarColor,
      borderRadius: '4px',
      '&:hover': { backgroundColor: colors.scrollbarThumbHoverColor },
    },
    '&::-webkit-scrollbar-corner': { backgroundColor: colors.scrollbarTrackColor },
    scrollbarWidth: 'thin',
    scrollbarColor: `${colors.scrollbarColor} ${colors.scrollbarTrackColor}`,
  },
  tableHead: {
    '& .MuiTableCell-root': {
      backgroundColor: colors.background,
      fontSize: '11.5px',
      fontWeight: 500,
      color: 'var(--text-tertiary)',
      borderBottom: '1px solid var(--border-soft)',
    },
  },
  tableBody: {
    backgroundColor: colors.background,
    '& .MuiTableRow-root': {
      backgroundColor: colors.background,
      transition: 'none',
      borderBottom: '1px solid var(--border-soft)',
      '&:hover': {
        backgroundColor: colors.hoverBackground,
        transition: 'none',
      },
    },
    '& .MuiTableCell-root': {
      fontSize: '13.5px',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-soft)',
    },
  },
  tableBodyRow: {
    backgroundColor: colors.background,
  },
  topToolbar: {
    backgroundColor: colors.background,
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    px: '28px',
    py: '16px',
    borderBottom: '1px solid var(--border-soft)',
  },
  bottomToolbar: {
    backgroundColor: colors.background,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
  },
  toolBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  spacer: { flex: 1 },
  sumaLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  sumaValue: { color: 'var(--text-primary)' },
};
