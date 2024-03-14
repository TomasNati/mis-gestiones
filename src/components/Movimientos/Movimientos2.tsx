import { CategoriaUIMovimiento, MovimientoGasto, TipoDeMovimientoGasto } from '@/lib/definitions';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams, useGridApiContext } from '@mui/x-data-grid';
import { TipoDePagoEdicion, TipoDePagoVista } from './editores/TipoDePago/TipoDePago';
import { useEffect, useState } from 'react';
import { obtenerCategoriasDeMovimientos } from '@/lib/orm/data';

const TipoDePagoEditInputCell = (props: GridRenderCellParams<any, TipoDeMovimientoGasto>) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (newValue: TipoDeMovimientoGasto) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
      <TipoDePagoEdicion onTipoDePagoChange={handleChange} tipoDepagoInicial={value as TipoDeMovimientoGasto} />
    </Box>
  );
};

const renderTipoDePagoEditInputCell: GridColDef['renderCell'] = (params) => {
  return <TipoDePagoEditInputCell {...params} />;
};

const renderTipoDePago = (params: GridRenderCellParams<any, TipoDeMovimientoGasto>) => {
  return <TipoDePagoVista tipoDePago={params.value as TipoDeMovimientoGasto} />;
};

const renderConceptoEditInputCell: GridColDef['renderCell'] = (params) => {
  return <></>;
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
    renderCell: renderTipoDePago,
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
  const [categoriasMovimiento, setCategoriasMovimiento] = useState<CategoriaUIMovimiento[]>([]);

  useEffect(() => {
    const fetchConceptos = async () => {
      const categoriasMovimiento = await obtenerCategoriasDeMovimientos();
      //sort subcategorias by categoria
      categoriasMovimiento.sort((a, b) => {
        if (a.categoriaNombre < b.categoriaNombre) {
          return -1;
        }
        if (a.categoriaNombre > b.categoriaNombre) {
          return 1;
        }
        return 0;
      });
      setCategoriasMovimiento(categoriasMovimiento);
    };
    fetchConceptos();
  }, []);

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
