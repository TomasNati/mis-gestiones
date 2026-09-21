import { SxProps } from '@mui/system';

interface BuscarMovimientosResultadosMRTStyles {
  tablePaper: SxProps;
  tableContainer: SxProps;
  tableHead: SxProps;
  tableBody: SxProps;
  tableRow: SxProps;
  topToolbar: SxProps;
  bottomToolbar: SxProps;
  pagination: SxProps;
  skeleton: SxProps;
}

const colors = {
  background: 'var(--bg-panel)',
  hoverBackground: 'var(--bg-row-hover)',
  scrollbarColor: 'var(--border-strong)',
  scrollbarTrackColor: 'var(--bg-page)',
  scrollbarThumbHoverColor: 'var(--text-tertiary)',
};

export const styles: BuscarMovimientosResultadosMRTStyles = {
  tablePaper: {
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
    overflow: 'auto',
    flex: 1,
    backgroundColor: colors.background,
  },
  tableContainer: {
    //backgroundColor: 'background.default',
    // WebKit (Chrome, Safari, Edge)
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: colors.scrollbarTrackColor,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: colors.scrollbarColor,
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: colors.scrollbarThumbHoverColor,
      },
    },
    '&::-webkit-scrollbar-corner': {
      backgroundColor: colors.scrollbarTrackColor,
    },
    // Firefox
    scrollbarWidth: 'thin',
    scrollbarColor: `${colors.scrollbarColor} ${colors.scrollbarTrackColor}`,
  },
  tableHead: {
    // backgroundColor: 'primary.light',
    '& .MuiTableCell-root': {
      backgroundColor: colors.background,
      // fontWeight: 600,
    },
  },
  tableBody: {
    backgroundColor: colors.background,
    '& .MuiTableRow-root': {
      backgroundColor: colors.background,
      transition: 'none',
      '&:hover': {
        backgroundColor: colors.hoverBackground,
        // Transition for hover (when mouse enters)
        transition: 'none',
      },
      '&:nth-of-type(odd)': {
        // backgroundColor: 'action.selected',
      },
    },
  },
  tableRow: {
    backgroundColor: colors.background,
  },
  topToolbar: {
    backgroundColor: colors.background,
    '& .MuiIconButton-root': {
      // color: 'primary.main',
    },
  },
  bottomToolbar: {
    backgroundColor: colors.background,
  },
  pagination: {
    backgroundColor: colors.background,
    '& .MuiTablePagination-root': {
      // color: 'text.primary',
    },
    '& .MuiIconButton-root': {
      // color: 'primary.main',
    },
  },
  skeleton: {
    backgroundColor: colors.background,
  },
};
