import { CategoriaUIMovimiento, MovimientoGastoGrilla, TipoDeMovimientoGasto, ResultadoAPI } from '@/lib/definitions';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
  useGridApiContext,
  GridEditCellProps,
  GridRowId,
  GridRowsProp,
  GridRowModesModel,
  GridRowModel,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowSelectionModel,
  GridRenderEditCellParams,
} from '@mui/x-data-grid';
import { TipoDePagoEdicion, TipoDePagoVista } from './editores/TipoDePago/TipoDePago';
import { Concepto } from './editores/Concepto/Concepto';
import { useEffect, useState } from 'react';
import { obtenerCategoriasDeMovimientos } from '@/lib/orm/data';
import { GrillaToolbar } from './GrillaToolbar';
import { FechaEditInputCell } from './editores/Fecha/Fecha';

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

const renderFechaEditInputCell: GridColDef['renderCell'] = (params) => <FechaEditInputCell {...params} />;

const renderTipoDePago = (params: GridRenderCellParams<any, TipoDeMovimientoGasto>) => {
  return <TipoDePagoVista tipoDePago={params.value as TipoDeMovimientoGasto} />;
};

interface MovimientosDelMesGrillaProps {
  movimientos: MovimientoGastoGrilla[];
  onMovimientoActualizado: (movimiento: MovimientoGastoGrilla) => void;
  onMovimientosEliminados: (resultado: ResultadoAPI) => void;
  mes: number;
  anio: number;
}

const MovimientosDelMesGrilla = ({
  movimientos,
  mes,
  anio,
  onMovimientoActualizado,
  onMovimientosEliminados,
}: MovimientosDelMesGrillaProps) => {
  const [categoriasMovimiento, setCategoriasMovimiento] = useState<CategoriaUIMovimiento[]>([]);
  const [rows, setRows] = useState<GridRowsProp>(movimientos);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [movimientosElegidos, setMovimientosElegidos] = useState<MovimientoGastoGrilla[]>([]);

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
    setRows(movimientos);
  }, [movimientos]);

  const columns: GridColDef[] = [
    {
      field: 'fecha',
      headerName: 'Fecha',
      renderEditCell: renderFechaEditInputCell,
      valueFormatter: (params: GridValueFormatterParams<Date>) => params.value?.getDate(),
      width: 100,
      editable: true,
    },
    {
      field: 'categoria',
      headerName: 'Categoría',
      width: 100,
      disableExport: true,
    },
    {
      field: 'concepto',
      headerName: 'Concepto',
      width: 250,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <Concepto
          categoriasMovimiento={categoriasMovimiento}
          conceptoInicial={params.value}
          hasFocus={params.hasFocus}
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
      renderCell: ({ value }) => <span>{value?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</span>,
      valueFormatter: (params) => params.value,
    },
    {
      field: 'comentarios',
      headerName: 'Detalle',
      editable: true,
      flex: 1,
    },
  ];

  const handleProcesarMovimientoUpdateError = (params: any) => {
    console.error('Error al actualizar el movimiento', params);
  };

  const processRowUpdate = (newRow: GridRowModel, originalRow: GridRowModel) => {
    const { id, fecha, concepto, tipoDeGasto, monto, isNew } = newRow;
    const valido = id && fecha && !!concepto && tipoDeGasto !== null && monto && monto > 0.01;
    if (valido) {
      onMovimientoActualizado(newRow as MovimientoGastoGrilla);
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    } else {
      const newRows = isNew
        ? rows.filter((row) => row.id !== newRow.id)
        : rows.map((row) => (row.id === newRow.id ? originalRow : row));
      setRows(newRows);
      return originalRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    } else if (params.reason === GridRowEditStopReasons.escapeKeyDown && params.row.isNew === true) {
      setRows((oldRows) => oldRows.filter((row) => row.id !== params.id));
    }
  };

  const handleSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const movimientosElegidos = rows.filter((row) => rowSelectionModel.includes(row.id as GridRowId));
    setMovimientosElegidos(movimientosElegidos as MovimientoGastoGrilla[]);
  };

  return (
    <Box sx={{ width: '100%', minWidth: 650 }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-main': {
            height: 'calc(99vh - 215px)',
          },
        }}
        rows={rows}
        columns={columns}
        density="compact"
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        checkboxSelection
        disableRowSelectionOnClick
        editMode="row"
        // onProcessRowUpdateError={handleProcesarMovimientoUpdateError}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        onRowSelectionModelChange={handleSelectionChange}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: GrillaToolbar,
        }}
        slotProps={{
          toolbar: {
            setRows,
            setRowModesModel,
            anio,
            mes,
            movimientosElegidos,
            onMovimientosEliminados,
          },
        }}
      />
    </Box>
  );
};

export { MovimientosDelMesGrilla };
