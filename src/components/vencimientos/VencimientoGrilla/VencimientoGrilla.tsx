import { VencimientoPago, VencimientoUI } from '@/lib/definitions';
import { formatDate, transformNumberToCurrenty } from '@/lib/helpers';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowSelectionModel,
  GridRowsProp,
} from '@mui/x-data-grid';
import { Box, styled } from '@mui/material';
import { Toolbar } from './Toolbar/Toolbar';
import { useState } from 'react';
import dayjs from 'dayjs';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .row-pagado': {
    backgroundColor: theme.palette.success.dark,
    '&:hover': {
      backgroundColor: theme.palette.success.main,
    },
  },
  '& .row-warning': {
    backgroundColor: theme.palette.warning.dark,
    '&:hover': {
      backgroundColor: theme.palette.warning.main,
    },
  },
  '& .row-danger': {
    backgroundColor: theme.palette.error.dark,
    '&:hover': {
      backgroundColor: theme.palette.error.main,
    },
  },
}));

interface VencimientosGrillaProps {
  vencimientos: VencimientoUI[];
  isLoading?: boolean;
  onEdit: (vencimiento: VencimientoUI) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onCopy: (ids: string[]) => void;
}

export const VencimientosGrilla = ({
  vencimientos,
  isLoading,
  onDelete,
  onEdit,
  onAdd,
  onCopy,
}: VencimientosGrillaProps) => {
  const [vencimientosElegidos, setVencimientosElegidos] = useState<VencimientoUI[]>([]);
  const rows: GridRowsProp = vencimientos;

  const formatPagoRealizado = (pago: VencimientoPago | null, vencimiento: VencimientoUI) => {
    if (!pago) return '';

    const { fecha, monto: montoPagado } = pago;
    const fechaFormateada = formatDate(fecha, false, { timeZone: 'UTC' });

    if (vencimiento.monto !== montoPagado) {
      return `${fechaFormateada} - ${transformNumberToCurrenty(montoPagado)}`;
    }
    return `${fechaFormateada}`;
  };

  const columns: GridColDef[] = [
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 110,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id.toString())}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id.toString())}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: 'subcategoria',
      headerName: 'Subcategoría',
      width: 250,
      valueGetter: (row: { descripcion: string }) => row.descripcion,
    },
    {
      field: 'fecha',
      headerName: 'Fecha',
      width: 150,
      valueFormatter: (fecha: Date, row: VencimientoUI) => {
        const formattedDate = formatDate(fecha, false, { timeZone: 'UTC' });
        const questionMark = !row.fechaConfirmada ? ' (?)' : '';
        return `${formattedDate}${questionMark}`;
      },
    },
    {
      field: 'monto',
      headerName: 'Monto',
      width: 150,
      type: 'number',
      valueFormatter: (monto: number) => transformNumberToCurrenty(monto),
    },
    {
      field: 'esAnual',
      headerName: 'Anual',
      width: 100,
      type: 'boolean',
      valueGetter: (esAnual: boolean) => esAnual,
    },
    {
      field: 'pago',
      headerName: 'Pago',
      width: 200,
      valueFormatter: (pago: VencimientoPago | null, row: VencimientoUI) => formatPagoRealizado(pago, row),
    },
    {
      field: 'comentarios',
      headerName: 'Comentarios',
      flex: 1,
    },
  ];

  const handleEditClick = (id: string) => () => {
    const vencimiento = vencimientos.find((v) => v.id === id);
    if (vencimiento) {
      onEdit(vencimiento);
    }
  };

  const handleDeleteClick = (id: string) => () => {
    onDelete(id);
  };

  const handleCopyClick = (ids: string[]) => onCopy(ids);

  const handleSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const vencimentosElegidos = rows.filter(({ id }) => rowSelectionModel.includes(id as GridRowId));
    setVencimientosElegidos(vencimentosElegidos as VencimientoUI[]);
  };

  const getRowClassName = (params: any) => {
    const { pago, fecha } = params.row;
    if (pago) return 'row-pagado';

    const fechaDate = dayjs(fecha);
    const now = dayjs();

    if (fechaDate.isSame(now, 'day') || fechaDate.isBefore(now, 'day')) {
      return 'row-danger';
    }
    const diff = fechaDate.diff(now, 'day');
    if (diff >= 1 && diff <= 3) {
      return 'row-warning';
    }
    return '';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        }}
        sortModel={[{ field: 'fecha', sort: 'asc' }]}
        pageSizeOptions={[50, 100, 200]}
        checkboxSelection
        density="compact"
        disableRowSelectionOnClick
        loading={isLoading}
        onRowSelectionModelChange={handleSelectionChange}
        getRowClassName={getRowClassName}
        slots={{ toolbar: Toolbar }}
        slotProps={{
          toolbar: {
            handleAddClick: onAdd,
            handleCopyClick,
            vencimientosElegidos,
          },
        }}
      />
    </Box>
  );
};
