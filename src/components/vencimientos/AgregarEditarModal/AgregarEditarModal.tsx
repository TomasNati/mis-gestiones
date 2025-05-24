import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { styles } from './AgregarEditarModal.styles';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Subcategoria } from '@/lib/definitions';

interface FormState {
  fecha: dayjs.Dayjs | null;
  tipo: Subcategoria | null;
  monto: string;
  anual: boolean;
  estricto: boolean;
  fechaConfirmada: boolean;
}

const defaultState: FormState = {
  fecha: dayjs(),
  tipo: null,
  monto: '',
  anual: false,
  estricto: false,
  fechaConfirmada: false,
};

interface AgregarEditarModalProps {
  tiposDeVencimiento: Subcategoria[];
  open: boolean;
  onClose: () => void;
  onGuardar: () => void;
}

export const AgregarEditarModal = ({ tiposDeVencimiento, open, onClose, onGuardar }: AgregarEditarModalProps) => {
  const [form, setForm] = useState<FormState>(defaultState);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = (reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      onClose();
    }
  };

  return (
    <Dialog onClose={(_, reason) => handleClose(reason)} open={open}>
      <DialogTitle>Agregar vencimiento</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={1.5} maxWidth={350} paddingTop={'5px'}>
          <DatePicker
            label="Fecha"
            value={form.fecha}
            onChange={(date) => handleChange('fecha', date)}
            slotProps={{ textField: { fullWidth: true } }}
            sx={styles.datePicker}
          />
          <Autocomplete
            options={tiposDeVencimiento}
            getOptionLabel={(option: Subcategoria) => option.nombre}
            value={form.tipo}
            renderInput={(params) => <TextField {...params} label="Tipo" />}
            onChange={(_, value) => handleChange('tipo', value)}
            size="small"
          />
          <TextField
            label="Monto"
            type="number"
            value={form.monto}
            onChange={(e) => handleChange('monto', e.target.value)}
            fullWidth
            size="small"
          />
          <FormControlLabel
            control={<Checkbox checked={form.anual} onChange={(e) => handleChange('anual', e.target.checked)} />}
            label="Anual"
          />
          <FormControlLabel
            control={<Checkbox checked={form.estricto} onChange={(e) => handleChange('estricto', e.target.checked)} />}
            label="Estricto"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.fechaConfirmada}
                onChange={(e) => handleChange('fechaConfirmada', e.target.checked)}
              />
            }
            label="Fecha Confirmada"
          />
        </Box>
      </DialogContent>
      <Box display="flex" justifyContent="center" sx={styles.buttonBar} gap={2}>
        <Button onClick={onGuardar} color="primary" variant="contained">
          Guardar
        </Button>
        <Button onClick={onClose} color="secondary" sx={{ marginRight: '8px' }}>
          Cancelar
        </Button>
      </Box>
    </Dialog>
  );
};
