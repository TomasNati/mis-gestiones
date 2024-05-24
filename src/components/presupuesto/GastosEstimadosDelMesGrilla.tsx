import { GastoEstimadoAnual, GastoEstimadoAnualUI, months } from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowsProp, GridRowSelectionModel, GridRowId, GridCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { GrillaToolbar } from './GrillaToolbar';
import { IconButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface GastosEstimadosDelMesGrillaProps {
  gastos: GastoEstimadoAnualUI[];
  anio: number;
}

const GastosEstimadosDelMesGrilla = ({ gastos }: GastosEstimadosDelMesGrillaProps) => {
  const [rows, setRows] = useState<GridRowsProp>(gastos);
  const [gastosEstimadosElegidos, setGastosEstimadosElegidos] = useState<GastoEstimadoAnualUI[]>([]);

  useEffect(() => {
    setRows(gastos);
  }, [gastos]);

  const mesesColumns: GridColDef[] = months.map((month) => ({
    field: month,
    headerName: month,
    type: 'number',
    editable: true,
    width: 120,
    renderCell: ({ value }) => <span>{transformNumberToCurrenty(value)}</span>,
    valueFormatter: (params) => params.value,
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
        if (!row.dbId.startsWith('categoria')) return null;
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

  const sumaTotalDelMes = 0; // gastos.reduce((acc, movimiento) => acc + movimiento.monto, 0);

  return (
    <Box sx={{ width: '100%', minWidth: 650 }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-main': {
            height: 'calc(99vh - 250px)',
          },
        }}
        rows={rows}
        columns={columns}
        density="compact"
        checkboxSelection
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        onRowSelectionModelChange={handleSelectionChange}
        slots={{
          toolbar: GrillaToolbar,
        }}
        slotProps={{
          toolbar: {
            gastosEstimadosElegidos,
            sumaTotalDelMes,
          },
        }}
      />
    </Box>
  );
};

export { GastosEstimadosDelMesGrilla };
