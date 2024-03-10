import { MovimientoGasto } from '@/lib/definitions';
import { formatDate } from '@/lib/helpers';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  {
    field: 'fecha',
    headerName: 'Fecha',
    valueFormatter: (params) => formatDate(params.value),
  },
  {
    field: 'concepto',
    headerName: 'Concepto',
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
    width: 110,
  },
  {
    field: 'monto',
    headerName: 'Monto',
    type: 'number',
  },
  {
    field: 'comentarios',
    headerName: 'Detalle',
  },
];

const Movimientos2 = ({ movimientos }: { movimientos: MovimientoGasto[] }) => {
  return (
    <Box sx={{ height: 400, width: '100%', minWidth: 650 }}>
      <DataGrid
        rows={movimientos}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 15,
            },
          },
        }}
        pageSizeOptions={[15]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export { Movimientos2 };
