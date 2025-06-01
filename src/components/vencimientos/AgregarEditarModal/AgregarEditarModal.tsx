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
import { useEffect, useState } from 'react';
import { DatePicker, validateDate } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Subcategoria, TipoDeGasto, VencimientoUI } from '@/lib/definitions';
import { toUTC } from '@/lib/helpers';
import { vencimiento } from '@/lib/orm/tables';

const isNumber = (value: string) => !isNaN(Number(value)) && value.trim() !== '';

interface FormState {
  id: string | undefined;
  fecha: dayjs.Dayjs | null;
  tipo: Subcategoria | null;
  monto: string;
  anual: boolean;
  estricto: boolean;
  fechaConfirmada: boolean;
  comentarios: string;
}

const defaultState: FormState = {
  id: undefined,
  fecha: dayjs(),
  tipo: null,
  monto: '',
  anual: false,
  estricto: false,
  fechaConfirmada: false,
  comentarios: '',
};

interface AgregarEditarModalProps {
  tiposDeVencimiento: Subcategoria[];
  open: boolean;
  onClose: () => void;
  onGuardar: (vencimiento: VencimientoUI) => void;
  vencimiento?: VencimientoUI;
}

export const AgregarEditarModal = ({
  tiposDeVencimiento,
  open,
  vencimiento,
  onClose,
  onGuardar,
}: AgregarEditarModalProps) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>(
    vencimiento
      ? {
          id: vencimiento.id,
          fecha: dayjs(vencimiento.fecha),
          tipo: tiposDeVencimiento.find(({ id }) => id == vencimiento.subcategoria.id) || null,
          monto: vencimiento.monto.toString(),
          anual: vencimiento.esAnual,
          estricto: vencimiento.estricto === undefined ? false : vencimiento.estricto,
          fechaConfirmada: vencimiento.fechaConfirmada === undefined ? false : vencimiento.fechaConfirmada,
          comentarios: vencimiento.comentarios,
        }
      : defaultState,
  );

  useEffect(() => {
    setErrors(validateForm(form));
  }, []);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const newForm = { ...form, [key]: value };
    const errorsFound = validateForm(newForm);
    setErrors(errorsFound);
    setForm(newForm);
  };

  const handleGuardar = () => {
    if (!errors.length) {
      const vencimiento: VencimientoUI = {
        id: form.id,
        fecha: toUTC(form.fecha?.toDate() || new Date()),
        monto: Number(form.monto),
        comentarios: form.comentarios,
        esAnual: form.anual,
        subcategoria: {
          id: form.tipo?.id || '',
          descripcion: '',
        },
        estricto: form.estricto,
        fechaConfirmada: form.fechaConfirmada,
      };
      onGuardar(vencimiento);
    }
  };

  const handleClose = (reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      onClose();
    }
  };

  const validateForm = (form: FormState) => {
    const errorsFound = [];
    if (!form.fecha) {
      errorsFound.push('La fecha es requerida');
    }
    if (!form.tipo) {
      errorsFound.push('El tipo de vencimiento es requerido');
    }
    if (!isNumber(form.monto)) {
      errorsFound.push('El monto es inválido');
    }
    return errorsFound;
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
            getOptionKey={(option: Subcategoria) => option.id}
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
          <TextField
            label="Comentarios"
            fullWidth
            multiline
            rows={3}
            value={form.comentarios || ''}
            onChange={(e) => handleChange('comentarios', e.target.value)}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <Box display="flex" justifyContent="center" sx={styles.buttonBar} gap={2}>
        <Button onClick={handleGuardar} color="primary" variant="contained" disabled={errors.length > 0}>
          Guardar
        </Button>
        <Button onClick={() => handleClose('')} color="secondary">
          Cancelar
        </Button>
      </Box>
    </Dialog>
  );
};
