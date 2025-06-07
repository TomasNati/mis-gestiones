import {
  CategoriaUIMovimiento,
  MovimientoGastoGrilla,
  TipoDeMovimientoGasto,
  ResultadoAPI,
  GrupoMovimiento,
} from '@/lib/definitions';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiContext,
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
import { Concepto, conceptoOperators } from './editores/Concepto/Concepto';
import { useEffect, useState } from 'react';
import { obtenerCategoriasDeMovimientos } from '@/lib/orm/data';
import { GrillaToolbar } from './GrillaToolbar';
import { FechaEditInputCell, fechaOperators } from './editores/Fecha/Fecha';
import { focusOnField, mapearSubcategoriasATiposDeConceptoExcel, transformNumberToCurrenty } from '@/lib/helpers';
import { renderMontoEditInputCell } from './editores/Monto/Monto';

const TipoDePagoEditInputCell = (props: GridRenderCellParams<any, TipoDeMovimientoGasto>) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (newValue: TipoDeMovimientoGasto) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
      <TipoDePagoEdicion
        onTipoDePagoChange={handleChange}
        tipoDepagoInicial={value as TipoDeMovimientoGasto}
        onTabPressed={() => focusOnField(id as string, 'monto')}
      />
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
  onMovimientoActualizado: (movimiento: MovimientoGastoGrilla) => Promise<MovimientoGastoGrilla>;
  onMovimientosEliminados: (resultado: ResultadoAPI) => void;
  onRefrescarMovimientos: () => void;
  onCrearGrupoMovimientos: (grupoMovimiento: GrupoMovimiento) => void;
  mes: number;
  anio: number;
  totalMensualEstimado: number;
}

const MovimientosDelMesGrilla = ({
  movimientos,
  mes,
  anio,
  totalMensualEstimado,
  onMovimientoActualizado,
  onMovimientosEliminados,
  onRefrescarMovimientos,
  onCrearGrupoMovimientos,
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
      filterOperators: fechaOperators,
      renderEditCell: (params: GridRenderEditCellParams) => {
        const fechaDefault = new Date(anio, mes, 1);
        if (!params.value) {
          params.value = fechaDefault;
        }
        return <FechaEditInputCell {...params} />;
      },
      valueFormatter: (params: Date) => params?.getDate(),
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
          size="grid"
          categoriasMovimiento={categoriasMovimiento}
          conceptoInicial={params.value}
          onTabPressed={() => focusOnField(params.id as string, 'tipoDeGasto', 'button')}
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
      filterOperators: conceptoOperators,
      valueFormatter: (params: CategoriaUIMovimiento) => {
        const [concepto] = mapearSubcategoriasATiposDeConceptoExcel(params?.subcategoriaId);
        return concepto;
      },
      renderCell: ({ value }) => <span>{value?.nombre}</span>,
    },
    {
      field: 'tipoDeGasto',
      headerName: 'Tipo De Pago',
      width: 130,
      renderEditCell: renderTipoDePagoEditInputCell,
      renderCell: renderTipoDePago,
      valueFormatter: (params: string) => {
        switch (params) {
          case 'Debito':
            return 'Débito';
          case 'Credito':
            return 'Crédito';
          default:
            return 'Efectivo';
        }
      },
      editable: true,
    },
    {
      field: 'monto',
      headerName: 'Monto',
      type: 'number',
      editable: true,
      width: 120,
      renderEditCell: renderMontoEditInputCell,
      renderCell: ({ value }) => <span>{transformNumberToCurrenty(value)}</span>,
      valueFormatter: (params) => params,
    },
    {
      field: 'comentarios',
      headerName: 'Detalle',
      editable: true,
      flex: 1,
      valueFormatter: (value: string, row: MovimientoGastoGrilla) => {
        const [concepto, comentarios] = mapearSubcategoriasATiposDeConceptoExcel(row.concepto?.subcategoriaId);
        return concepto === 'Servicios' ? comentarios : value;
      },
      renderCell: ({ value }) => <span>{value}</span>,
    },
  ];

  const processRowUpdate = async (newRow: GridRowModel, originalRow: GridRowModel) => {
    const { id, fecha, concepto, tipoDeGasto, monto, isNew } = newRow;
    const valido = id && fecha && !!concepto && tipoDeGasto !== null && monto && monto > 0.01;
    if (valido) {
      const movimientoActualizado = await onMovimientoActualizado(newRow as MovimientoGastoGrilla);
      const updatedRow = { ...newRow, isNew: false, id: movimientoActualizado.id };
      setRows(rows.map((row) => (row.id === id ? updatedRow : row)));
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
    if (
      params.reason === GridRowEditStopReasons.rowFocusOut ||
      (params.reason === GridRowEditStopReasons.enterKeyDown && params.field === 'concepto')
    ) {
      event.defaultMuiPrevented = true;
    } else if (params.reason === GridRowEditStopReasons.escapeKeyDown && params.row.isNew === true) {
      setRows((oldRows) => oldRows.filter((row) => row.id !== params.id));
    }
  };

  const handleSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const movimientosElegidos = rows.filter((row) => rowSelectionModel.includes(row.id as GridRowId));
    setMovimientosElegidos(movimientosElegidos as MovimientoGastoGrilla[]);
  };

  const sumaTotalDelMes = rows.reduce((acc, movimiento) => acc + movimiento.monto!, 0);

  return (
    <Box sx={{ width: '100%', minWidth: 650 }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-main': {
            height: 'calc(99vh - 255px)',
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
            sumaTotalDelMes,
            totalMensualEstimado,
            onMovimientosEliminados,
            onRefrescarMovimientos,
            categoriasMovimiento,
            onGuardarGrupoMovimiento: onCrearGrupoMovimientos,
          },
        }}
      />
    </Box>
  );
};

export { MovimientosDelMesGrilla };
