import { GastoEstimadoAnualUI, GastoEstimadoDB, GastoEstimadoItemDelMes, months } from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridRowSelectionModel,
  GridRowId,
  GridCellParams,
  GridRowModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { GrillaToolbar } from './GrillaToolbar';
import { IconButton, SxProps } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { renderGastoEstimadoEditInputCell } from './editores/GastoEstimadoDelMes';
import { persistirGastoEstimado } from '@/lib/orm/actions';
import { GridCsvExportOptions, GridToolbarExport } from '@mui/x-data-grid';

interface GastosEstimadosDelMesGrillaProps {
  gastos: GastoEstimadoAnualUI[];
  mesesAMostrar?: string[];
  anio: number;
}

const GastosEstimadosDelMesGrilla = ({ gastos, mesesAMostrar, anio }: GastosEstimadosDelMesGrillaProps) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [gastosEstimadosElegidos, setGastosEstimadosElegidos] = useState<GastoEstimadoAnualUI[]>([]);
  const [mesesVisibles, setMesesVisibles] = useState<string[]>(months);

  useEffect(() => {
    const categoriasColapsadasIds = gastos.filter(({ colapsado }) => colapsado).map(({ id }) => id);
    const rowsFiltered = gastos.filter((r) => !r.categoriaId || !categoriasColapsadasIds.includes(r.categoriaId));
    setRows([...rowsFiltered]);
  }, [gastos]);

  useEffect(() => {
    if (mesesAMostrar) {
      setMesesVisibles(mesesAMostrar?.sort((a, b) => months.indexOf(a) - months.indexOf(b)));
    }
  }, [mesesAMostrar]);

  const mesesColumns: GridColDef[] = mesesVisibles.map((month) => ({
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
    valueFormatter: (params) => (params.value as GastoEstimadoItemDelMes).estimado,
  }));

  const onToggleSubcategoriesVisibility = (event: React.MouseEvent<HTMLButtonElement>, row: GastoEstimadoAnualUI) => {
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

  const handleSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const gastosElegidos = rows.filter((row) => rowSelectionModel.includes(row.id as GridRowId));
    setGastosEstimadosElegidos(gastosElegidos as GastoEstimadoAnualUI[]);
  };

  const actualizarGastosEstimadosDeCategoria = (mes: string, newRow: GridValidRowModel) => {
    const gastosEstimadosDelMesYCategorias = rows
      .filter((gasto) => gasto.categoriaId === newRow.categoriaId)
      .map((gasto) => (gasto.id == newRow.id ? newRow[mes].estimado : gasto[mes].estimado));

    const total = gastosEstimadosDelMesYCategorias.reduce((acc, gasto) => acc + gasto, 0);
    const categoriaRow = rows.find((gasto) => gasto.id === newRow.categoriaId);
    categoriaRow && (categoriaRow[mes].estimado = total);

    return categoriaRow;
  };

  const processRowUpdate = async (newRow: GridRowModel, originalRow: GridRowModel) => {
    let gastoEstimadoDB: GastoEstimadoDB | null = null;
    let nombreMes: string = '';

    for (const month of mesesVisibles) {
      if (newRow[month].modificado) {
        gastoEstimadoDB = {
          anio,
          mes: months.indexOf(month),
          subcategoriaId: newRow.id as string,
          monto: newRow[month]?.estimado as number,
          id: originalRow[month]?.gastoEstimadoDBId as string,
        };
        newRow[month].modificado = false;
        nombreMes = month;
        break;
      }
    }

    if (!gastoEstimadoDB) return originalRow;

    const resultado = await persistirGastoEstimado(gastoEstimadoDB);

    if (resultado) {
      newRow[nombreMes] = {
        ...newRow[nombreMes],
        estimado: gastoEstimadoDB.monto,
        modificado: false,
        gastoEstimadoDBId: resultado.id,
      };

      const categoriaRowActualizada = actualizarGastosEstimadosDeCategoria(nombreMes, newRow);

      // update the rows array with the new versions for categoriaRowActualizada and newRow
      const updatedRows = rows.map((row) => {
        if (categoriaRowActualizada && row.id === categoriaRowActualizada?.id) return categoriaRowActualizada;
        if (row.id === newRow.id) return newRow;
        return row;
      });
      setRows(updatedRows);
      return newRow;
    } else {
      return originalRow;
    }
  };

  const sumaTotalDelMes = 0; // gastos.reduce((acc, movimiento) => acc + movimiento.monto, 0);

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
        checkboxSelection
        isCellEditable={(params) => !params.row.dbId?.startsWith('categoria')}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        onRowSelectionModelChange={handleSelectionChange}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: GrillaToolbar,
        }}
        slotProps={{
          toolbar: {
            gastosEstimadosElegidos,
            gastosEstimados: rows as GastoEstimadoAnualUI[],
            mesesVisibles,
            sumaTotalDelMes,
          },
        }}
      />
    </Box>
  );
};

export { GastosEstimadosDelMesGrilla };
