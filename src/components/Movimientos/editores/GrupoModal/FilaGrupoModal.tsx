import { InfoFilaMovimientoGrupo } from '@/lib/definitions';
import { Box, TextField, Autocomplete, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface FilaGrupoModalProps {
  fila: InfoFilaMovimientoGrupo;
  onDeleteClick: (id: string) => void;
}
const FilaGrupoModal = ({ fila, onDeleteClick }: FilaGrupoModalProps) => {
  return (
    <Box display="flex" alignItems="center" sx={{ paddingTop: '5px', paddingBottom: '3px', gap: '3px' }}>
      <TextField label="First Textbox" variant="outlined" size="small" />
      <Autocomplete
        options={[]}
        size="small"
        renderInput={(params) => <TextField {...params} label="Autocomplete" variant="outlined" />}
      />
      <TextField label="Second Textbox" variant="outlined" size="small" />
      <Button
        sx={{ minWidth: '0px', padding: '5px', '& span': { marginLeft: '3px', marginRight: '0px' } }}
        startIcon={<DeleteIcon />}
        onClick={() => onDeleteClick(fila.id)}
      />
    </Box>
  );
};

export { FilaGrupoModal };
