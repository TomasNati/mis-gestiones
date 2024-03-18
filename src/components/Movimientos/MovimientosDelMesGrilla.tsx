import {
  CategoriaUIMovimiento,
  MovimientoGastoGrilla,
  TipoDeMovimientoGasto,
  MovimientoGastoGrillaNullable,
} from '@/lib/definitions';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
  useGridApiContext,
  GridEditCellProps,
  GridRowId,
  GridApi,
  useGridApiRef,
} from '@mui/x-data-grid';
import { TipoDePagoEdicion, TipoDePagoVista } from './editores/TipoDePago/TipoDePago';
import { Concepto } from './editores/Concepto/Concepto';
import { useEffect, useRef, useState } from 'react';
import { obtenerCategoriasDeMovimientos } from '@/lib/orm/data';
import { generateUUID } from '@/lib/helpers';
import { Button } from '@mui/material';
import { GrillaToolbar } from './GrillaToolbar';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

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

interface MovimientosDelMesGrillaProps {
  movimientos: MovimientoGastoGrilla[];
  mes: number;
  anio: number;
}

const MovimientosDelMesGrilla = ({ movimientos, mes, anio }: MovimientosDelMesGrillaProps) => {
  const [categoriasMovimiento, setCategoriasMovimiento] = useState<CategoriaUIMovimiento[]>([]);
  const [movimientosGrilla, setMovimientosGrilla] = useState<MovimientoGastoGrillaNullable[]>(movimientos);
  const [nuevaFilaId, setNuevaFilaId] = useState<string | null>(null);
  const gridRef = useGridApiRef();

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
      valueFormatter: (params: GridValueFormatterParams<Date>) => params.value?.getDate(),
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
      valueFormatter: (params: GridValueFormatterParams<CategoriaUIMovimiento>) => params.value?.nombre,
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
      valueFormatter: (params) => params.value?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
    },
    {
      field: 'comentarios',
      headerName: 'Detalle',
      editable: true,
      flex: 1,
    },
  ];

  const onMovimientoActualizado = (movimiento: MovimientoGastoGrillaNullable) => {
    console.log('Movimiento actualizado', movimiento);
    return movimiento;
  };

  const handleProcesarMovimientoUpdateError = (params: any) => {
    console.error('Error al actualizar el movimiento', params);
  };

  const onNuevoMovimiento = () => {
    const nuevoMovimiento: MovimientoGastoGrillaNullable = {
      id: generateUUID(),
      esNuevo: true,
      fecha: new Date(anio, mes, new Date().getDate()),
      concepto: null,
      monto: null,
      categoria: null,
      tipoDeGasto: null,
    };
    setMovimientosGrilla([nuevoMovimiento, ...movimientosGrilla]);
    setNuevaFilaId(nuevoMovimiento.id);
  };

  useEffect(() => {
    if (nuevaFilaId) {
      gridRef.current?.startRowEditMode({ id: nuevaFilaId as GridRowId });
      setNuevaFilaId(null);
    }
  }, [nuevaFilaId, gridRef]);

  return (
    <Box sx={{ width: '100%', minWidth: 650 }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-main': {
            height: 'calc(99vh - 253px)',
          },
        }}
        apiRef={gridRef}
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
          toolbar: GrillaToolbar,
        }}
        slotProps={{
          toolbar: { onNuevoMovimiento },
        }}
      />
    </Box>
  );
};

export { MovimientosDelMesGrilla };
