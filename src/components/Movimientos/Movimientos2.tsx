import { MovimientoGasto } from '@/lib/definitions';
import { formatDate } from '@/lib/helpers';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  {
    field: 'fecha',
    headerName: 'Fecha',
    valueFormatter: (params) => formatDate(params.value),
    width: 150,
  },
  {
    field: 'concepto',
    headerName: 'Concepto',
    width: 180,
    valueGetter: (params: GridValueGetterParams) => {
      const movimiento = params.row as MovimientoGasto;
      return movimiento.detalleSubcategoria
        ? `(${movimiento.detalleSubcategoria.subcategoria.nombre}) ${movimiento.detalleSubcategoria.nombre}`
        : movimiento.subcategoria.nombre;
    },
  },
  {
    field: 'tipoDeGasto',
    headerName: 'Tipo De Pago',
    width: 180,
  },
  {
    field: 'monto',
    headerName: 'Monto',
    type: 'number',
    width: 120,
    valueFormatter: (params) => params.value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
  },
  {
    field: 'comentarios',
    headerName: 'Detalle',
    flex: 1,
  },
];

const Movimientos2 = ({ movimientos }: { movimientos: MovimientoGasto[] }) => {
  return (
    <Box sx={{ width: '100%', minWidth: 650 }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-main': {
            height: 'calc(99vh - 253px)',
          },
        }}
        rows={movimientos}
        columns={columns}
        density="compact"
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[100]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export { Movimientos2 };
