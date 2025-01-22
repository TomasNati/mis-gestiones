import { CategoriaUIMovimiento, InfoFilaMovimientoGrupo } from '@/lib/definitions';
import { Box, TextField, Button, FormControlLabel, Checkbox, FormControl, FormLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { NumberInput } from '@/components/Movimientos/editores/Monto/Monto';
import { Concepto } from '../Concepto/Concepto';
import { useState, ChangeEvent } from 'react';

interface FilaGrupoModalProps {
  fila: InfoFilaMovimientoGrupo;
  onDeleteClick: (id: string) => void;
  categoriasMovimiento: CategoriaUIMovimiento[];
}
const FilaGrupoModal = ({ fila, onDeleteClick, categoriasMovimiento }: FilaGrupoModalProps) => {
  const [restoTotalChecked, setRestoTotalChecked] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRestoTotalChecked(event.target.checked);
  };
  return (
    <Box display="flex" alignItems="center" sx={{ paddingTop: '7px', paddingBottom: '3px', gap: '3px' }}>
      <Box width={'150px'} display="flex" alignItems="center">
        <NumberInput onBlur={() => {}} valorInicial={fila.monto.toString()} size="small" label="Monto" />
      </Box>
      <FormControl component="fieldset" sx={{ width: '60px' }}>
        <FormLabel
          component="legend"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            transformOrigin: 'top left',
            position: 'absolute',
            top: '1px',
            transform: 'translate(4px, -10px) scale(0.75)',
            backgroundColor: '#676e70',
            zIndex: 1,
          }}
        >
          Resto
        </FormLabel>
        <Box
          sx={{
            position: 'relative',
            border: '1px solid grey',
            borderRadius: '4px',
          }}
        >
          <Checkbox
            checked={restoTotalChecked}
            onChange={handleChange}
            name="checkedB"
            size="small"
            sx={{
              padding: '9px 5px',
              marginLeft: '3px',
            }}
          />
        </Box>
      </FormControl>
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
