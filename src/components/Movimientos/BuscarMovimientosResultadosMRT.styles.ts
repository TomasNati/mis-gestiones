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
  transitionColor: '#2a3d47', // Fixed color to show during the transition
};

export const styles: BuscarMovimientosResultadosMRTStyles = {
  tablePaper: {
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
    overflow: 'auto',
    flex: 1,
    // Override background color for the paper container
    backgroundColor: colors.background,
  },
  tableContainer: {
    // Override background color for the table container
    //backgroundColor: 'background.default',
  },
  tableHead: {
    // Override background color for the table header
    // backgroundColor: 'primary.light',
    '& .MuiTableCell-root': {
      backgroundColor: colors.background,
      // fontWeight: 600,
    },
  },
  tableBody: {
    // Override background color for the table body
    backgroundColor: colors.background,
    '& .MuiTableRow-root': {
      // Override background color for individual rows
      backgroundColor: colors.background,
      '&:hover': {
        backgroundColor: colors.hoverBackground,
      },
      '&:nth-of-type(odd)': {
        // backgroundColor: 'action.selected',
      },
    },
  },
  tableRow: {
    // Override background color for rows
    backgroundColor: colors.background,
  },
  topToolbar: {
    // Override background color for the top toolbar
    backgroundColor: colors.background,
    '& .MuiIconButton-root': {
      // color: 'primary.main',
    },
  },
  bottomToolbar: {
    // Override background color for the bottom toolbar (includes pagination)
    backgroundColor: colors.background,
  },
  pagination: {
    // Override background color for the pagination component
    backgroundColor: colors.background,
    '& .MuiTablePagination-root': {
      // color: 'text.primary',
    },
    '& .MuiIconButton-root': {
      // color: 'primary.main',
    },
  },
  skeleton: {
    // Override background color for the skeleton loading state
    backgroundColor: colors.background,
  },
};
