import { SxProps } from '@mui/system';

interface MovimientosDelMesGrillaMRTStyles {
  tablePaper: SxProps;
  tableContainer: SxProps;
  tableHead: SxProps;
  tableBody: SxProps;
  tableBodyRow: SxProps;
  editActionCell: SxProps;
  editTrigger: SxProps;
  filaPanel: SxProps;
  topToolbar: SxProps;
  bottomToolbar: SxProps;
  toolbar: SxProps;
  toolbarAlertBanner: SxProps;
  toolBtn: SxProps;
  spacer: SxProps;
  sumaLabel: SxProps;
  sumaValue: SxProps;
  skeleton: SxProps;
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
    '& .edit-trigger': {
      opacity: 0,
      transition: 'opacity 150ms ease, color 150ms ease, border-color 150ms ease',
    },
    '& .MuiTableRow-root:hover .edit-trigger': {
      opacity: 1,
    },
  },
  tableBodyRow: {
    backgroundColor: colors.background,
  },
  editActionCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    p: 0,
  },
  editTrigger: {
    color: 'var(--text-tertiary)',
    '&:hover': {
      color: 'var(--text-primary)',
      backgroundColor: 'transparent',
    },
  },
  filaPanel: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '12px',
    p: '12px 16px',
    backgroundColor: 'var(--accent-soft)',
  },
  topToolbar: {
    backgroundColor: colors.background,
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    px: '28px',
    py: '16px',
    borderBottom: '1px solid var(--border-soft)',
    '& > .MuiBox-root': {
      p: 0,
      alignItems: 'center',
    },
  },
  bottomToolbar: {
    backgroundColor: colors.background,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
  },
  toolbarAlertBanner: {
    '& .MuiAlert-root': {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
    },
    '& .MuiAlert-message': {
      p: 0,
    },
    '& .MuiStack-root': {
      fontSize: '13px',
    },
    '& span': {
      fontSize: '13px',
    },
    '& .MuiChip-root': {
      backgroundColor: 'var(--bg-elevated)',
      color: 'var(--text-primary)',
      fontSize: '13px',
      height: '24px',
      '& .MuiChip-label': {
        fontSize: '13px',
      },
      '& .MuiChip-deleteIcon': {
        fontSize: '16px',
        color: 'var(--text-tertiary)',
      },
    },
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
  skeleton: {
    opacity: 0.6,
  },
};
