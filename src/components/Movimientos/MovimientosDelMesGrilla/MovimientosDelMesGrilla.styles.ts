import { SxProps } from '@mui/system';

interface MovimientosDelMesGrillaStyles {
  gridContainer: SxProps;
  dataGrid: SxProps;
  tipoDePagoEditCell: SxProps;
}

export const styles: MovimientosDelMesGrillaStyles = {
  gridContainer: {
    width: '100%',
    minWidth: 650,
  },
  dataGrid: {
    border: 'none',
    '--DataGrid-toolbarBackground': 'var(--bg-page)',
    '--DataGrid-rowHoverBackground': 'var(--bg-row-hover)',
    '& .MuiDataGrid-main': {
      height: 'calc(99vh - 310px)',
    },
    '& .MuiDataGrid-virtualScroller': {
      background: 'var(--bg-page)',
    },
    '& .MuiDataGrid-columnHeaders': {
      background: 'var(--bg-page)',
      borderBottom: '1px solid var(--border-soft)',
    },
    '& .MuiDataGrid-columnHeader': {
      fontSize: '11.5px',
      fontWeight: 500,
      color: 'var(--text-tertiary)',
    },
    '& .MuiDataGrid-cell': {
      fontSize: '13.5px',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-soft)',
    },
    '& .MuiDataGrid-row': {
      '&:hover': {
        backgroundColor: 'var(--bg-row-hover) !important',
      },
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: '1px solid var(--border-soft)',
      background: 'var(--bg-page)',
    },
    '& .MuiDataGrid-toolbar': {
      background: 'var(--bg-page)',
    },
    '& .MuiDataGrid-selectedRowCount': {
      color: 'var(--text-secondary)',
    },
    '& .MuiCheckbox-root': {
      color: 'var(--text-tertiary)',
      '&.Mui-checked': {
        color: 'var(--accent)',
      },
    },
  },
  tipoDePagoEditCell: {
    display: 'flex',
    alignItems: 'center',
    pr: 2,
  },
};
