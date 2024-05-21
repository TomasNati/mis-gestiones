import { GastoEstimadoAnual, months } from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowsProp, GridRowSelectionModel, GridRowId } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { GrillaToolbar } from './GrillaToolbar';

interface GastosEstimadosDelMesGrillaProps {
  gastos: GastoEstimadoAnual[];
  anio: number;
}

const GastosEstimadosDelMesGrilla = ({ gastos }: GastosEstimadosDelMesGrillaProps) => {
  const [rows, setRows] = useState<GridRowsProp>(gastos);
  const [gastosEstimadosElegidos, setGastosEstimadosElegidos] = useState<GastoEstimadoAnual[]>([]);

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

  const columns: GridColDef[] = [
    {
      field: 'descripcion',
      headerName: 'Descripcion',
      width: 250,
    },
    ...mesesColumns,
  ];

  const handleSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const gastosElegidos = rows.filter((row) => rowSelectionModel.includes(row.id as GridRowId));
    setGastosEstimadosElegidos(gastosElegidos as GastoEstimadoAnual[]);
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
