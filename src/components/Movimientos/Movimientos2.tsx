import { CategoriaUIMovimiento, MovimientoGastoGrilla, TipoDeMovimientoGasto } from '@/lib/definitions';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
  useGridApiContext,
  GridEditCellProps,
  GridRowsProp,
  GridRowModesModel,
  GridToolbarContainer,
  GridRowModes,
} from '@mui/x-data-grid';
import { TipoDePagoEdicion, TipoDePagoVista } from './editores/TipoDePago/TipoDePago';
import { Concepto } from './editores/Concepto/Concepto';
import { useEffect, useState } from 'react';
import { obtenerCategoriasDeMovimientos } from '@/lib/orm/data';
import { generateUUID } from '@/lib/helpers';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

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

interface ToolbarProps {
  onNuevoMovimiento: () => void;
}
const Toolbar = ({ onNuevoMovimiento }: ToolbarProps) => {
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={() => onNuevoMovimiento()}>
        Agregar movimiento
      </Button>
    </GridToolbarContainer>
  );
};

const Movimientos2 = ({ movimientos }: { movimientos: MovimientoGastoGrilla[] }) => {
  const [categoriasMovimiento, setCategoriasMovimiento] = useState<CategoriaUIMovimiento[]>([]);
  const [movimientosGrilla, setMovimientosGrilla] = useState(movimientos);

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

  useEffect(() => {
    setMovimientosGrilla(movimientos);
  }, [movimientos]);

  const columns: GridColDef[] = [
    {
      field: 'fecha',
      headerName: 'Fecha',
      type: 'date',
      valueFormatter: (params: GridValueFormatterParams<Date>) => params.value.getDate(),
      width: 100,
      editable: true,
    },
    {
      field: 'categoria',
      headerName: 'Categoría',
      width: 100,
    },
    {
      field: 'concepto',
      headerName: 'Concepto',
      width: 250,
      renderEditCell: (params: GridEditCellProps) => (
        <Concepto
          categoriasMovimiento={categoriasMovimiento}
          conceptoInicial={params.value}
          onConceptoModificado={async (nuevoConcepto) => {
            await params.api?.setEditCellValue({ id: params.id, field: params.field, value: nuevoConcepto });
            await params.api?.setEditCellValue({
              id: params.id,
              field: 'categoria',
              value: nuevoConcepto.categoriaNombre,
            });
          }}
        />
      ),
      editable: true,
      valueFormatter: (params: GridValueFormatterParams<CategoriaUIMovimiento>) => params.value.nombre,
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

  const onMovimientoActualizado = (movimiento: MovimientoGastoGrilla) => {
    console.log('Movimiento actualizado', movimiento);
    return movimiento;
  };

  const handleProcesarMovimientoUpdateError = (params: any) => {
    console.error('Error al actualizar el movimiento', params);
  };

  const onNuevoMovimiento = () => {
    const nuevoMovimiento: MovimientoGastoGrilla = {
      id: generateUUID(),
      categoria: categoriasMovimiento[0].categoriaNombre,
      concepto: categoriasMovimiento[0],
      fecha: new Date(),
      monto: 0,
      tipoDeGasto: TipoDeMovimientoGasto.Efectivo,
      esNuevo: true,
    };
    setMovimientosGrilla([nuevoMovimiento, ...movimientosGrilla]);
  };

  return (
    <Box sx={{ width: '100%', minWidth: 650 }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-main': {
            height: 'calc(99vh - 253px)',
          },
        }}
        rows={movimientosGrilla}
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
        slots={{
          toolbar: Toolbar,
        }}
        slotProps={{
          toolbar: { onNuevoMovimiento },
        }}
      />
    </Box>
  );
};

export { Movimientos2 };
