import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { styles } from './AgregarEditarModal.styles';
import { useMemo, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MovimientoDeVencimiento, Subcategoria, VencimientoUI, ComprobantePagoParaSubir } from '@/lib/definitions';
import { formatDate, toUTC } from '@/lib/helpers';
import { obtenerMovimientosParaVencimientosUI } from '@/components/vencimientos/vencimientosUtils';
import { CrearPagoModal } from './CrearPagoModal';
import {
  ComprobanteState,
  ComprobantesSection,
  crearComprobantesIniciales,
  nombreComprobanteArchivo,
  subpathsDuplicados,
} from './ComprobantesSection';

const isNumber = (value: string) => !isNaN(Number(value)) && value.trim() !== '';

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const prefijoAnioMes = (fecha: dayjs.Dayjs | null) => (fecha ? `${fecha.year()}/${MESES[fecha.month()]}` : '');

const formatBytes = (bytes: number) =>
  bytes >= 1000000 ? `${(bytes / 1000000).toFixed(1)} MB` : `${Math.ceil(bytes / 1000)} KB`;

dayjs.extend(utc);

interface FormState {
  id: string | undefined;
  fecha: dayjs.Dayjs | null;
  tipo: Subcategoria | null;
  pagoId?: string | null;
  monto: string;
  anual: boolean;
  fechaConfirmada: boolean;
  comentarios: string;
}

const defaultState: FormState = {
  id: undefined,
  fecha: dayjs(),
  tipo: null,
  monto: '',
  anual: false,
  fechaConfirmada: false,
  pagoId: null,
  comentarios: '',
};

const mapVencimientoToForm = (tiposDeVencimiento: Subcategoria[], vencimiento?: VencimientoUI): FormState =>
  vencimiento
    ? {
        id: vencimiento.id,
        fecha: dayjs.utc(vencimiento.fecha),
        tipo: tiposDeVencimiento.find(({ id }) => id == vencimiento.subcategoria.id) || null,
        monto: vencimiento.monto.toString(),
        anual: vencimiento.esAnual,
        fechaConfirmada: vencimiento.fechaConfirmada === undefined ? false : vencimiento.fechaConfirmada,
        comentarios: vencimiento.comentarios,
        pagoId: vencimiento.pago?.id || null,
      }
    : defaultState;

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

interface AgregarEditarModalProps {
  tiposDeVencimiento: Subcategoria[];
  pagos?: MovimientoDeVencimiento[];
  open: boolean;
  onClose: () => void;
  onGuardar: (vencimiento: VencimientoUI, comprobantes: ComprobantePagoParaSubir[]) => void;
  onNotificarError: (mensaje: string) => void;
  maxUploadBytes: number | null;
  vencimiento?: VencimientoUI;
}

export const AgregarEditarModal = ({
  tiposDeVencimiento,
  pagos = [],
  open,
  vencimiento,
  onClose,
  onGuardar,
  onNotificarError,
  maxUploadBytes,
}: AgregarEditarModalProps) => {
  const [errors, setErrors] = useState<string[]>(validateForm(mapVencimientoToForm(tiposDeVencimiento, vencimiento)));
  const [posiblesPagos, setPosiblesPagos] = useState<MovimientoDeVencimiento[]>(pagos);
  const [form, setForm] = useState<FormState>(mapVencimientoToForm(tiposDeVencimiento, vencimiento));
  const [showCrearPago, setShowCrearPago] = useState(false);
  const [comprobantes, setComprobantes] = useState<ComprobanteState[]>(crearComprobantesIniciales);

  const prefijo = prefijoAnioMes(form.fecha);

  const duplicados = useMemo(() => subpathsDuplicados(comprobantes, prefijo), [comprobantes, prefijo]);

  const validarArchivo = (archivo: File): boolean => {
    if (maxUploadBytes && archivo.size > maxUploadBytes) {
      onNotificarError(
        `"${archivo.name}" supera el tamaño máximo permitido (${formatBytes(archivo.size)} de ${formatBytes(
          maxUploadBytes,
        )})`,
      );
      return false;
    }
    return true;
  };

  const avisarDuplicados = (comprobantesNuevos: ComprobanteState[]) => {
    const repetidos = subpathsDuplicados(comprobantesNuevos, prefijo);
    if (repetidos.length) {
      onNotificarError(
        `Ya hay otro comprobante que se guardaría como "${repetidos[0]}". Modificá un comentario para que tengan nombres distintos.`,
      );
    }
  };

  const handleArchivoSeleccionado = (indice: number, archivo: File | null) => {
    if (archivo && !validarArchivo(archivo)) {
      return;
    }
    const nuevos = comprobantes.map((item, i) => (i === indice ? { archivo, comentario: '' } : item));
    setComprobantes(nuevos);
    avisarDuplicados(nuevos);
  };

  const handleComentarioChanged = (indice: number, comentario: string) => {
    const nuevos = comprobantes.map((item, i) => (i === indice ? { ...item, comentario } : item));
    setComprobantes(nuevos);
    avisarDuplicados(nuevos);
  };

  const handleEliminarArchivo = (indice: number) => {
    setComprobantes(comprobantes.map((item, i) => (i === indice ? { archivo: null, comentario: '' } : item)));
  };

  const handlePagoChanged = (pago: MovimientoDeVencimiento | null) => {
    handleChangeSimple('pagoId', pago ? pago.id : null);
  };

  const handleTipoChanged = async (tipo: Subcategoria | null) => {
    if (!tipo) {
      handleChangeSimple('tipo', tipo);
      return;
    }
    const posiblesMovimientos = await obtenerMovimientosParaVencimientosUI(tipo.id);
    setPosiblesPagos(posiblesMovimientos);
    handleChange([
      ['tipo', tipo],
      ['pagoId', posiblesMovimientos?.[0]?.id || null],
    ]);
  };

  const handleChangeSimple = <K extends keyof FormState>(key: K, value: FormState[K]) => handleChange([[key, value]]);

  const handleChange = <K extends keyof FormState>(changes: [key: K, value: FormState[K]][]) => {
    let newForm = { ...form };
    changes.forEach(([key, value]) => (newForm = { ...newForm, [key]: value }));
    const errorsFound = validateForm(newForm);
    setErrors(errorsFound);
    setForm(newForm);
  };

  const handleGuardar = () => {
    if (!errors.length) {
      const comprobantesParaSubir: ComprobantePagoParaSubir[] = comprobantes
        .map((comprobante) => comprobante)
        .filter((comprobante) => Boolean(comprobante.archivo))
        .map((comprobante) => ({
          archivo: comprobante.archivo as File,
          subpath: nombreComprobanteArchivo(prefijo, comprobante),
        }));

      const vencimiento: VencimientoUI = {
        id: form.id,
        fecha: toUTC(form.fecha?.toDate() || new Date()),
        monto: Number(form.monto),
        comentarios: form.comentarios,
        esAnual: form.anual,
        subcategoria: {
          id: form.tipo?.id || '',
          descripcion: '',
          comprobantesPath: form.tipo?.comprobantesPath || null,
        },
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
      onGuardar(vencimiento, comprobantesParaSubir);
    }
  };

  const handlePagoCreado = (pago: MovimientoDeVencimiento) => {
    setPosiblesPagos((prev) => [pago, ...prev]);
    handleChangeSimple('pagoId', pago.id);
    setShowCrearPago(false);
  };

  const canCrearPago = form.tipo && form.monto && isNumber(form.monto) && Number(form.monto) > 0;

  const handleClose = (reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      onClose();
    }
  };

  return (
    <Dialog onClose={(_, reason) => handleClose(reason)} open={open}>
      <DialogTitle>Agregar vencimiento</DialogTitle>
      <DialogContent sx={{ width: 420 }}>
        <Box display="flex" flexDirection="column" gap={1.5} maxWidth={350} paddingTop={'5px'}>
          <DatePicker
            label="Fecha"
            value={dayjs.utc(form.fecha)}
            onChange={(date) => handleChangeSimple('fecha', date)}
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
          <Box display="flex" gap={0.5} alignItems="center">
            <Autocomplete
              options={posiblesPagos}
              getOptionLabel={(option: MovimientoDeVencimiento) =>
                `${formatDate(option.fecha, false, { timeZone: 'UTC' })} - $${option.monto}`
              }
              value={posiblesPagos.find((pago) => pago.id === form.pagoId) || null}
              renderInput={(params) => <TextField {...params} label="Pago relacionado" />}
              onChange={(_, value) => handlePagoChanged(value)}
              getOptionKey={(option: MovimientoDeVencimiento) => option.id}
              size="small"
              sx={{ flex: 1 }}
            />
            <Tooltip title={canCrearPago ? 'Crear movimiento de pago' : 'Completar tipo y monto primero'}>
              <span>
                <IconButton
                  color="primary"
                  onClick={() => setShowCrearPago(true)}
                  disabled={!canCrearPago}
                  size="small"
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <ComprobantesSection
            comprobantes={comprobantes}
            prefijo={prefijo}
            duplicados={duplicados}
            onArchivoSeleccionado={handleArchivoSeleccionado}
            onComentarioChanged={handleComentarioChanged}
            onEliminarArchivo={handleEliminarArchivo}
          />
          {showCrearPago && (
            <CrearPagoModal
              open={showCrearPago}
              tipoNombre={form.tipo?.nombre || ''}
              subcategoriaId={form.tipo?.id || ''}
              fechaInicial={form.fecha}
              montoInicial={form.monto}
              comentarios={form.comentarios}
              onClose={() => setShowCrearPago(false)}
              onPagoCreado={handlePagoCreado}
            />
          )}
          <TextField
            label="Monto"
            type="number"
            value={form.monto}
            onChange={(e) => handleChangeSimple('monto', e.target.value)}
            fullWidth
            size="small"
          />
          <FormControlLabel
            control={<Checkbox checked={form.anual} onChange={(e) => handleChangeSimple('anual', e.target.checked)} />}
            label="Anual"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.fechaConfirmada}
                onChange={(e) => handleChangeSimple('fechaConfirmada', e.target.checked)}
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
            onChange={(e) => handleChangeSimple('comentarios', e.target.value)}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <Box display="flex" justifyContent="center" sx={styles.buttonBar} gap={2}>
        <Button
          onClick={handleGuardar}
          color="primary"
          variant="contained"
          disabled={errors.length > 0 || duplicados.length > 0}
        >
          Guardar
        </Button>
        <Button onClick={() => handleClose('')} color="secondary">
          Cancelar
        </Button>
      </Box>
    </Dialog>
  );
};
