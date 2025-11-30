import { CategoriaUIMovimiento, InfoFilaMovimientoGrupo } from '@/lib/definitions';
import { Box, TextField, Button, Checkbox, FormControl, FormLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { NumberInput } from '@/components/Movimientos/editores/Monto/Monto';
import { Concepto } from '../Concepto/Concepto';
import { ChangeEvent } from 'react';

interface FilaGrupoModalProps {
  fila: InfoFilaMovimientoGrupo;
  onDeleteClick: (id: string) => void;
  onFilaEditada: (fila: InfoFilaMovimientoGrupo) => void;
  categoriasMovimiento: CategoriaUIMovimiento[];
  totalMonto?: number;
  parcialMonto: number;
  restoEnabled?: boolean;
}
const FilaGrupoModal = ({
  fila,
  onDeleteClick,
  onFilaEditada,
  categoriasMovimiento,
  totalMonto,
  parcialMonto,
  restoEnabled,
}: FilaGrupoModalProps) => {
  const handleRestoChecked = (event: ChangeEvent<HTMLInputElement>) => {
    const filaEditada: InfoFilaMovimientoGrupo = {
      ...fila,
      esRestoDelMonto: event.target.checked,
    };

    if (filaEditada.esRestoDelMonto) {
      filaEditada.monto = totalMonto ? totalMonto - parcialMonto : undefined;
    }
    onFilaEditada(filaEditada);
  };

  const onMontoChanged = (nuevoMonto?: number) => {
    const filaEditada: InfoFilaMovimientoGrupo = {
      ...fila,
      monto: nuevoMonto,
    };

    onFilaEditada(filaEditada);
  };

  const onConceptoChanged = (nuevoConcepto?: CategoriaUIMovimiento) => {
    const filaEditada: InfoFilaMovimientoGrupo = {
      ...fila,
      concepto: nuevoConcepto,
    };

    onFilaEditada(filaEditada);
  };

  const onComentariosChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const filaEditada: InfoFilaMovimientoGrupo = {
      ...fila,
      comentario: event.target.value,
    };
    onFilaEditada(filaEditada);
  };

  return (
    <Box display="flex" alignItems="center" sx={{ paddingTop: '7px', paddingBottom: '3px', gap: '3px' }}>
      <Box width={'150px'} display="flex" alignItems="center">
        <NumberInput
          onBlur={onMontoChanged}
          valorInicial={fila.esRestoDelMonto ? fila.monto?.toFixed(2) : fila.monto?.toString()}
          size="small"
          label="Monto"
          disabled={fila.esRestoDelMonto}
        />
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
            checked={fila.esRestoDelMonto}
            onChange={handleRestoChecked}
            disabled={!fila.esRestoDelMonto && !restoEnabled}
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
        conceptoInicial={fila.concepto || null}
        onTabPressed={() => {}}
        onConceptoModificado={onConceptoChanged}
        label="Concepto"
        size="small"
      />
      <TextField label="Comentarios" variant="outlined" size="small" onChange={onComentariosChanged} />
      <Button
        sx={{ minWidth: '0px', padding: '5px', '& span': { marginLeft: '3px', marginRight: '0px' } }}
        startIcon={<DeleteIcon />}
        onClick={() => onDeleteClick(fila.id)}
      />
    </Box>
  );
};

export { FilaGrupoModal };
