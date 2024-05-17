import { GastosEstimado } from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridRowModesModel,
  GridRowSelectionModel,
  GridRowId,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { GrillaToolbar } from './GrillaToolbar';

interface GastosEstimadosDelMesGrillaProps {
  gastos: GastosEstimado[];
  mes: number;
  anio: number;
}

const GastosEstimadosDelMesGrilla = ({ gastos, mes, anio }: GastosEstimadosDelMesGrillaProps) => {
  const [rows, setRows] = useState<GridRowsProp>(gastos);
  const [gastosEstimadosElegidos, setGastosEstimadosElegidos] = useState<GastosEstimado[]>([]);

  useEffect(() => {
    setRows(gastos);
  }, [gastos]);

  const columns: GridColDef[] = [
    {
      field: 'categoria',
      headerName: 'Categoría',
      width: 150,
    },
    {
      field: 'subcategoria',
      headerName: 'Subcategoria',
      width: 200,
    },
    {
      field: 'monto',
      headerName: 'Monto',
      type: 'number',
      editable: true,
      width: 120,
      renderCell: ({ value }) => <span>{transformNumberToCurrenty(value)}</span>,
      valueFormatter: (params) => params.value,
    },
  ];

  const handleSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const gastosElegidos = rows.filter((row) => rowSelectionModel.includes(row.id as GridRowId));
    setGastosEstimadosElegidos(gastosElegidos as GastosEstimado[]);
  };

  const sumaTotalDelMes = gastos.reduce((acc, movimiento) => acc + movimiento.monto, 0);

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
