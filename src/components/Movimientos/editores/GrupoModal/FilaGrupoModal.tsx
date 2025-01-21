import { CategoriaUIMovimiento, InfoFilaMovimientoGrupo } from '@/lib/definitions';
import { Box, TextField, Autocomplete, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { NumberInput } from '@/components/Movimientos/editores/Monto/Monto';
import { Concepto } from '../Concepto/Concepto';

interface FilaGrupoModalProps {
  fila: InfoFilaMovimientoGrupo;
  onDeleteClick: (id: string) => void;
  categoriasMovimiento: CategoriaUIMovimiento[];
}
const FilaGrupoModal = ({ fila, onDeleteClick, categoriasMovimiento }: FilaGrupoModalProps) => {
  return (
    <Box display="flex" alignItems="center" sx={{ paddingTop: '5px', paddingBottom: '3px', gap: '3px' }}>
      <Box width={'113px'}>
        <NumberInput onBlur={() => {}} valorInicial={fila.monto.toString()} size="small" label="Monto" />
      </Box>
      <Concepto
        categoriasMovimiento={categoriasMovimiento}
        //conceptoInicial={params.value}
        onTabPressed={() => {}}
        onConceptoModificado={(nuevoConcepto) => {}}
        label="Concepto"
        size="small"
      />
      <TextField label="Comentarios" variant="outlined" size="small" />
      <Button
        sx={{ minWidth: '0px', padding: '5px', '& span': { marginLeft: '3px', marginRight: '0px' } }}
        startIcon={<DeleteIcon />}
        onClick={() => onDeleteClick(fila.id)}
      />
    </Box>
  );
};

export { FilaGrupoModal };
