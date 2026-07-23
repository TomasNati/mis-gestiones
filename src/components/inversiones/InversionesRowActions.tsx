import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MRT_Row, MRT_TableInstance } from 'material-react-table';
import { Inversion } from '@/lib/definitions';

interface InversionesRowActionsProps {
  row: MRT_Row<Inversion>;
  table: MRT_TableInstance<Inversion>;
  onDelete: (row: MRT_Row<Inversion>) => void;
}

export const InversionesRowActions = ({ row, table, onDelete }: InversionesRowActionsProps) => (
  <Box sx={{ display: 'flex', gap: 0, whiteSpace: 'nowrap' }}>
    <Tooltip title="Edit">
      <IconButton onClick={() => table.setEditingRow(row)}>
        <EditIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Delete">
      <IconButton color="error" onClick={() => onDelete(row)}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  </Box>
);
