
import {  VencimientoUI } from '@/lib/definitions';
import { formatDate, transformNumberToCurrenty } from '@/lib/helpers';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import  {Toolbar} from './Toolbar/Toolbar';

interface VencimientosGrillaProps {
  vencimientos: VencimientoUI[];
  isLoading?: boolean;
  onEdit: (vencimiento: VencimientoUI) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onCopy: (vencimiento: VencimientoUI) => void;
}

export const VencimientosGrilla = ({vencimientos, isLoading, onDelete, onEdit, onAdd, onCopy} : VencimientosGrillaProps) => {

  const columns: GridColDef[] = [
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 110,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<ContentCopyIcon />}
            label="Copy"
            onClick={handleCopyClick(id.toString())}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id.toString())}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id.toString())}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: 'subcategoria',
      headerName: 'Subcategoría',
      width: 250,
      valueGetter: (row: { descripcion: string }) => row.descripcion,
    },
    {
      field: 'fecha',
      headerName: 'Fecha',
      width: 150,
      valueFormatter: (fecha: Date) => formatDate(fecha, false, { timeZone: 'UTC' }),
    },
    {
      field: 'monto',
      headerName: 'Monto',
      width: 150,
      type: 'number',
      valueFormatter: (monto: number) => transformNumberToCurrenty(monto),
    },
    {
      field: 'esAnual',
      headerName: 'Es Anual',
      width: 100,
      type: 'boolean',
      valueGetter: (esAnual: boolean) => esAnual,
    },
    {
      field: 'estricto',
      headerName: 'Estricto',
      width: 100,
      type: 'boolean',
      valueGetter: (estricto: boolean) => estricto,
    },
    {
      field: 'comentarios',
      headerName: 'Comentarios',
      flex: 1,
    },
  ];

  const handleEditClick = (id: string) => () => {
    const vencimiento = vencimientos.find((v) => v.id === id);
    if (vencimiento) {
     onEdit(vencimiento);
    }
  };

  const handleDeleteClick = (id: string) => () => {
    onDelete(id);
  };

  const handleCopyClick = (id: string) => () => {
    const vencimiento = vencimientos.find((v) => v.id === id);
    if (vencimiento) {
      onCopy(vencimiento);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={vencimientos}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        }}
        pageSizeOptions={[50, 100, 200]}
        disableRowSelectionOnClick
        loading={isLoading}
        slots={ { toolbar: Toolbar }}
        slotProps={{
          toolbar: {
              handleAddClick: onAdd,
            },
          }
        }
      />
    </Box>
  );
};
