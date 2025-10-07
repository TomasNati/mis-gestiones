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
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MovimientoDeVencimiento, Subcategoria, VencimientoUI } from '@/lib/definitions';
import { formatDate, toUTC } from '@/lib/helpers';
import { obtenerMovimientosParaVencimientos } from '@/lib/orm/data';

const isNumber = (value: string) => !isNaN(Number(value)) && value.trim() !== '';

dayjs.extend(utc);

interface FormState {
  id: string | undefined;
  fecha: dayjs.Dayjs | null;
  tipo: Subcategoria | null;
  pagoId?: string | null;
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
  pagoId: null,
  comentarios: '',
};

interface AgregarEditarModalProps {
  tiposDeVencimiento: Subcategoria[];
  pagos?: MovimientoDeVencimiento[];
  open: boolean;
  onClose: () => void;
  onGuardar: (vencimiento: VencimientoUI) => void;
  vencimiento?: VencimientoUI;
}

export const AgregarEditarModal = ({
  tiposDeVencimiento,
  pagos = [],
  open,
  vencimiento,
  onClose,
  onGuardar,
}: AgregarEditarModalProps) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [posiblesPagos, setPosiblesPagos] = useState<MovimientoDeVencimiento[]>(pagos);

  const [form, setForm] = useState<FormState>(
    vencimiento
      ? {
          id: vencimiento.id,
          fecha: dayjs.utc(vencimiento.fecha),
          tipo: tiposDeVencimiento.find(({ id }) => id == vencimiento.subcategoria.id) || null,
          monto: vencimiento.monto.toString(),
          anual: vencimiento.esAnual,
          estricto: vencimiento.estricto === undefined ? false : vencimiento.estricto,
          fechaConfirmada: vencimiento.fechaConfirmada === undefined ? false : vencimiento.fechaConfirmada,
          comentarios: vencimiento.comentarios,
          pagoId: vencimiento.pago?.id || null,
        }
      : defaultState,
  );

  useEffect(() => {
    setErrors(validateForm(form));
  }, []);

  const handleTipoChanged = async (tipo: Subcategoria | null) => {
    handleChange('tipo', tipo);
    if (!tipo) {
      return;
    }
    const posiblesMovimientos = await obtenerMovimientosParaVencimientos(tipo.id);
    setPosiblesPagos(posiblesMovimientos);
    handleChange('pagoId', posiblesMovimientos?.[0].id || null);
  };

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
        pago: form.pagoId
          ? {
              id: form.pagoId,
              fecha: new Date(),
              monto: 0,
              comentarios: '',
            }
          : undefined,
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
      <DialogContent sx={{ width: 380 }}>
        <Box display="flex" flexDirection="column" gap={1.5} maxWidth={350} paddingTop={'5px'}>
          <DatePicker
            label="Fecha"
            value={dayjs.utc(form.fecha)}
            onChange={(date) => handleChange('fecha', date)}
            slotProps={{ textField: { fullWidth: true } }}
            sx={styles.datePicker}
            format="DD/MM/YYYY"
          />
          <Autocomplete
            options={tiposDeVencimiento}
            getOptionLabel={(option: Subcategoria) => option.nombre}
            value={form.tipo}
            renderInput={(params) => <TextField {...params} label="Tipo" />}
            onChange={(_, value) => handleTipoChanged(value)}
            getOptionKey={(option: Subcategoria) => option.id}
            size="small"
          />
          <Autocomplete
            options={posiblesPagos}
            getOptionLabel={(option: MovimientoDeVencimiento) =>
              `${formatDate(option.fecha, false, { timeZone: 'UTC' })} - $${option.monto}`
            }
            value={posiblesPagos.find((pago) => pago.id === form.pagoId) || null}
            renderInput={(params) => <TextField {...params} label="Pago relacionado" />}
            onChange={(_, value) => handleChange('pagoId', value ? value.id : null)}
            getOptionKey={(option: MovimientoDeVencimiento) => option.id}
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
