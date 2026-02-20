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
  background: '#27343b',
  hoverBackground: '#234655',
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
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#1a252b',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#3d5a6b',
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: '#4a6d7f',
      },
    },
    '&::-webkit-scrollbar-corner': {
      backgroundColor: '#1a252b',
    },
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
