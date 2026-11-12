import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MRT_Row, MRT_TableInstance } from 'material-react-table';
import { Inversion } from '@/lib/definitions';
import { styles } from './InversionesRowActions.styles';

interface InversionesRowActionsProps {
  row: MRT_Row<Inversion>;
  table: MRT_TableInstance<Inversion>;
  onDelete: (row: MRT_Row<Inversion>) => void;
}

export const InversionesRowActions = ({ row, table, onDelete }: InversionesRowActionsProps) => {
  if (row.getIsGrouped()) return null;

  return (
    <Box className="row-actions" sx={styles.container}>
      <Tooltip title="Editar cantidad">
        <IconButton aria-label="Editar cantidad" sx={styles.iconButton} onClick={() => table.setEditingRow(row)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Eliminar">
        <IconButton aria-label="Eliminar" sx={[styles.iconButton, styles.danger]} onClick={() => onDelete(row)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
