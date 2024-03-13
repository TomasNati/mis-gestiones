import { MovimientoGasto, TipoDeMovimientoGasto } from '@/lib/definitions';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams, useGridApiContext } from '@mui/x-data-grid';
import { TipoDePago } from './TipoDePago/TipoDePago';

const TipoDePagoEditInputCell = (props: GridRenderCellParams<any, TipoDeMovimientoGasto>) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (newValue: TipoDeMovimientoGasto) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
      <TipoDePago onTipoDePagoChange={handleChange} tipoDepagoInicial={value as TipoDeMovimientoGasto} />
    </Box>
  );
};

const renderTipoDePagoEditInputCell: GridColDef['renderCell'] = (params) => {
  return <TipoDePagoEditInputCell {...params} />;
};

const columns: GridColDef[] = [
  {
    field: 'fecha',
    headerName: 'Fecha',
    type: 'date',
    valueFormatter: (params) => (params.value as Date).getDate(),
    width: 100,
    editable: true,
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
    width: 130,
    renderEditCell: renderTipoDePagoEditInputCell,
    editable: true,
  },
  {
    field: 'monto',
    headerName: 'Monto',
    type: 'number',
    editable: true,
    width: 120,
    valueFormatter: (params) => params.value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
  },
  {
    field: 'comentarios',
    headerName: 'Detalle',
    editable: true,
    flex: 1,
  },
];

const Movimientos2 = ({ movimientos }: { movimientos: MovimientoGasto[] }) => {
  const onMovimientoActualizado = (movimiento: MovimientoGasto) => {
    console.log('Movimiento actualizado', movimiento);
    return movimiento;
  };

  const handleProcesarMovimientoUpdateError = (params: any) => {
    console.error('Error al actualizar el movimiento', params);
  };

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
        editMode="row"
        processRowUpdate={(updatedRow, _originalrow) => onMovimientoActualizado(updatedRow)}
        onProcessRowUpdateError={handleProcesarMovimientoUpdateError}
      />
    </Box>
  );
};

export { Movimientos2 };
