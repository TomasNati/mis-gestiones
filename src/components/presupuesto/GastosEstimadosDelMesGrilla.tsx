import {
  GastoEstimadoAnual,
  GastoEstimadoAnualUI,
  GastoEstimadoDB,
  GastoEstimadoItemDelMes,
  months,
} from '@/lib/definitions';
import { cloneObject, transformNumberToCurrenty } from '@/lib/helpers';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridRowId,
  GridCellParams,
  GridValidRowModel,
  DataGridProps,
  useGridApiRef,
} from '@mui/x-data-grid';
import { useEffect, useState, useRef, useCallback, MouseEvent } from 'react';
import { GrillaToolbar } from './GrillaToolbar';
import { IconButton, SxProps } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { renderGastoEstimadoEditInputCell } from './editores/GastoEstimadoDelMes';
import { persistirGastoEstimado } from '@/lib/orm/actions';
import { AnioConMeses } from '../comun/seleccionadorPeriodoHelper';
// import { HTMLButtonElement}

interface GastosEstimadosDelMesGrillaProps {
  gastos: GastoEstimadoAnualUI[];
  aniosYMesesAMostrar: AnioConMeses[];
  mesesElegidos: string[];
  onTieneCambiosPendientesChanged: (tieneCambiosPendientes: boolean) => void;
}

const GastosEstimadosDelMesGrilla = ({
  gastos,
  aniosYMesesAMostrar,
  mesesElegidos,
  onTieneCambiosPendientesChanged,
}: GastosEstimadosDelMesGrillaProps) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [gastosEstimadosElegidos, setGastosEstimadosElegidos] = useState<GastoEstimadoAnual[]>([]);
  const [mesesVisibles, setMesesVisibles] = useState<string[]>(aniosYMesesAMostrar.flatMap(({ meses }) => meses));

  const [hasUnsavedRows, setHasUnsavedRows] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const unsavedChangesRef = useRef<{
    unsavedRows: Record<GridRowId, GridValidRowModel>;
    rowsBeforeChange: Record<GridRowId, GridValidRowModel>;
  }>({
    unsavedRows: {},
    rowsBeforeChange: {},
  });

  const apiRef = useGridApiRef();

  useEffect(() => {
    const categoriasColapsadasIds = gastos.filter(({ colapsado }) => colapsado).map(({ id }) => id);
    const rowsFiltered = gastos.filter((r) => !r.categoriaId || !categoriasColapsadasIds.includes(r.categoriaId));
    setRows([...rowsFiltered]);
  }, [gastos]);

  useEffect(() => {
    if (aniosYMesesAMostrar.length > 0) {
      const mesesAMostrar = aniosYMesesAMostrar.flatMap(({ meses }) => meses);
      setMesesVisibles(mesesAMostrar);
    }
  }, [aniosYMesesAMostrar]);

  const mesesColumns: GridColDef[] = mesesElegidos.map((month) => ({
    field: month,
    headerName: month,
    editable: true,
    width: 125,
    renderEditCell: renderGastoEstimadoEditInputCell,
    renderCell: ({ row }: GridCellParams<GastoEstimadoAnualUI>) => {
      const { estimado, real } = row[month] as GastoEstimadoItemDelMes;
      const gastoRealColor = estimado >= real ? '#40b040' : '#ea5e5e';
      const containerStyles: SxProps = {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '7px',
        paddingBottom: '7px',
        fontSize: row.dbId?.startsWith('categoria') ? '0.875rem' : '0.8rem',
        fontWeight: row.dbId?.startsWith('categoria') ? '800' : '400',
      };

      return (
        <Box sx={containerStyles}>
          <Box sx={{ color: '#72a2df' }}>{transformNumberToCurrenty(estimado)}</Box>
          {real > 0 ? <Box sx={{ color: gastoRealColor }}>{transformNumberToCurrenty(real)}</Box> : null}
        </Box>
      );
    },
    valueFormatter: (value: GastoEstimadoItemDelMes) => value.estimado,
  }));

  const onHasUnsavedRowsChanged = (hasUnsavedRows: boolean) => {
    setHasUnsavedRows(hasUnsavedRows);
    onTieneCambiosPendientesChanged(hasUnsavedRows);
  };

  const onToggleSubcategoriesVisibility = (event: MouseEvent<HTMLButtonElement>, row: GastoEstimadoAnualUI) => {
    event.stopPropagation();
    const nuevoValorColapsado = !row.colapsado;

    if (nuevoValorColapsado) {
      row.colapsado = true;
      const rowsFiltered = rows.filter((r) => !r.categoriaId || !(r.categoriaId === row.id));
      setRows([...rowsFiltered]);
    } else {
      const newRows = gastos.filter((filaGasto) => {
        const esSubcategoriaDeCategoria = filaGasto.categoriaId === row.id;
        const yaVisible = rows.find((r) => r.id === filaGasto.id);
        return esSubcategoriaDeCategoria || yaVisible;
      });

      const rowCategoria = newRows.find((r) => r.dbId === row.dbId);
      rowCategoria && (rowCategoria.colapsado = false);
      setRows([...newRows]);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: ({ row }: GridCellParams<GastoEstimadoAnualUI>) => {
        if (!row.dbId?.startsWith('categoria')) return null;
        return (
          <IconButton aria-label="delete" onClick={(event) => onToggleSubcategoriesVisibility(event, row)}>
            {row.colapsado ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        );
      },
    },
    {
      field: 'descripcion',
      headerName: 'Descripcion',
      width: 250,
    },
    ...mesesColumns,
  ];

  const handleSelectionChange = () => {
    const modelRowsSelected = Array.from(apiRef.current.getSelectedRows().values());
    setGastosEstimadosElegidos(modelRowsSelected as GastoEstimadoAnual[]);
  };

  const actualizarGastosEstimadosDeCategoria = (mes: string, newRow: GridValidRowModel) => {
    const rowValues = Array.from(apiRef.current.getRowModels().values());
    const gastosEstimadosDelMesYCategorias = rowValues
      .filter((gasto) => gasto.categoriaId === newRow.categoriaId)
      .map((gasto) => (gasto.id == newRow.id ? newRow[mes].estimado : gasto[mes].estimado || 0));

    const total = gastosEstimadosDelMesYCategorias.reduce((acc, gasto) => acc + gasto, 0);
    const categoriaRow = rowValues.find((gasto) => gasto.id === newRow.categoriaId);
    categoriaRow && (categoriaRow[mes].estimado = total);

    return categoriaRow;
  };

  const persistRowUpdates = async (unsavedRows: Record<GridRowId, GridValidRowModel>, mesesAPersistir: string[]) => {
    let gastoEstimadoDB: GastoEstimadoDB | null = null;
    const gastosEstimadosDB: GastoEstimadoDB[] = [];

    const updatedRows = await Promise.all(
      Object.entries(unsavedRows).map(async ([rowId, newRow]) => {
        const originalRow = unsavedChangesRef.current.rowsBeforeChange[rowId];

        for (const month of mesesAPersistir) {
          const anioAUsar = aniosYMesesAMostrar.find(({ meses }) => meses.includes(month));
          if (newRow[month].modificado && anioAUsar) {
            gastoEstimadoDB = {
              anio: anioAUsar.anio,
              mes: months.indexOf(month),
              subcategoriaId: newRow.id as string,
              monto: newRow[month]?.estimado as number,
              id: originalRow[month]?.gastoEstimadoDBId as string,
            };
            gastosEstimadosDB.push(gastoEstimadoDB);
            newRow[month].modificado = false;
            break;
          }
        }
        if (!gastoEstimadoDB) return originalRow;
        const resultado = await persistirGastoEstimado(gastoEstimadoDB);
        return resultado;
      }),
    );

    return updatedRows;
  };

  const actualizarGastosCategorias = (rowsToConsider: GridValidRowModel[]) => {
    for (const month of mesesElegidos) {
      for (const newRow of rowsToConsider) {
        const categoriaRowActualizada = actualizarGastosEstimadosDeCategoria(month, newRow);
        if (categoriaRowActualizada) apiRef.current.updateRows([categoriaRowActualizada]);
      }
    }
  };

  const processRowUpdate = useCallback<NonNullable<DataGridProps['processRowUpdate']>>(
    (newRow: GridValidRowModel, oldRow: GridValidRowModel) => {
      try {
        const rowId = newRow.id;
        unsavedChangesRef.current.unsavedRows[rowId] = newRow;
        if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
          unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
        }
        onHasUnsavedRowsChanged(true);
        actualizarGastosCategorias([newRow]);
        return newRow;
      } catch (error) {
        console.log(error);
      }
    },
    [mesesElegidos],
  );

  const discardChanges = useCallback(() => {
    onHasUnsavedRowsChanged(false);
    Object.values(unsavedChangesRef.current.rowsBeforeChange).forEach((row) => {
      apiRef.current.updateRows([row]);
    });
    actualizarGastosCategorias(Object.values(unsavedChangesRef.current.rowsBeforeChange));
    unsavedChangesRef.current = {
      unsavedRows: {},
      rowsBeforeChange: {},
    };
  }, [apiRef]);

  const saveChanges = useCallback(async () => {
    try {
      // Persist updates in the database
      setIsSaving(true);
      await persistRowUpdates(unsavedChangesRef.current.unsavedRows, mesesElegidos);
      setIsSaving(false);
      onHasUnsavedRowsChanged(false);
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {},
      };
    } catch {
      setIsSaving(false);
    }
  }, [apiRef, mesesElegidos]);

  const gastosActualizadosPorPorcentaje = useCallback(
    (gastosActualizados: GastoEstimadoAnualUI[]) => {
      for (const gasto of gastosActualizados) {
        const rowUpdated = gasto as GridValidRowModel;
        const rowId = rowUpdated.id;
        const oldRow = gastosEstimadosElegidos.find((r) => r.id === rowId);
        unsavedChangesRef.current.unsavedRows[rowId] = rowUpdated;
        if (!unsavedChangesRef.current.rowsBeforeChange[rowId] && oldRow) {
          unsavedChangesRef.current.rowsBeforeChange[rowId] = cloneObject(oldRow);
        }
      }

      Object.values(unsavedChangesRef.current.unsavedRows).forEach((row) => {
        apiRef.current.updateRows([row]);
      });
      actualizarGastosCategorias([unsavedChangesRef.current.unsavedRows]);
      onHasUnsavedRowsChanged(true);
    },
    [apiRef, gastosEstimadosElegidos],
  );

  const sumaTotalDelMes = 0; // gastos.reduce((acc, movimiento) => acc + movimiento.monto, 0);

  const toolbarProps = {
    gastosEstimadosElegidos,
    gastosEstimados: rows as GastoEstimadoAnualUI[],
    mesesVisibles,
    sumaTotalDelMes,
    hasUnsavedRows,
    saveChanges,
    discardChanges,
    gastosIncreasedByPercentage: gastosActualizadosPorPorcentaje,
  };

  return (
    <Box sx={{ width: '100%', minWidth: 650 }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-main': {
            height: 'calc(99vh - 255px)',
          },
        }}
        apiRef={apiRef}
        getRowHeight={() => 'auto'}
        getEstimatedRowHeight={() => 70}
        rows={rows}
        columns={columns}
        density="compact"
        checkboxSelection
        isCellEditable={(params) => !params.row.dbId?.startsWith('categoria')}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        loading={isSaving}
        pageSizeOptions={[25, 50, 100]}
        onRowSelectionModelChange={handleSelectionChange}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: GrillaToolbar,
        }}
        slotProps={{
          toolbar: toolbarProps,
        }}
      />
    </Box>
  );
};

export { GastosEstimadosDelMesGrilla };
