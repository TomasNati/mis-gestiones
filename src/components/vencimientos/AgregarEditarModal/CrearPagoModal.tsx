import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { styles } from './AgregarEditarModal.styles';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { MovimientoDeVencimiento, MovimientoUI, TipoDeMovimientoGasto } from '@/lib/definitions';
import { toUTC } from '@/lib/helpers';
import { crearMovimiento } from '@/lib/orm/actions';

const isNumber = (value: string) => !isNaN(Number(value)) && value.trim() !== '';

interface CrearPagoModalProps {
  open: boolean;
  tipoNombre: string;
  subcategoriaId: string;
  fechaInicial: dayjs.Dayjs | null;
  montoInicial: string;
  comentarios: string;
  onClose: () => void;
  onPagoCreado: (pago: MovimientoDeVencimiento) => void;
}

export const CrearPagoModal = ({
  open,
  tipoNombre,
  subcategoriaId,
  fechaInicial,
  montoInicial,
  comentarios,
  onClose,
  onPagoCreado,
}: CrearPagoModalProps) => {
  const [tipoDePago, setTipoDePago] = useState<TipoDeMovimientoGasto>(TipoDeMovimientoGasto.Debito);
  const [fecha, setFecha] = useState<dayjs.Dayjs | null>(fechaInicial);
  const [monto, setMonto] = useState<string>(montoInicial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCrear = async () => {
    setError(null);
    if (!fecha || !isNumber(monto) || Number(monto) <= 0) {
      setError('Fecha y monto son requeridos');
      return;
    }
    setLoading(true);
    const fechaUTC = toUTC(fecha.toDate());
    const montoNum = Number(monto);
    const nuevoMovimiento: MovimientoUI = {
      fecha: fechaUTC,
      subcategoriaId,
      tipoDeGasto: tipoDePago,
      monto: montoNum,
      comentarios: comentarios || undefined,
      valido: true,
      filaId: 0,
    };
    const resultado = await crearMovimiento(nuevoMovimiento);
    setLoading(false);
    if (resultado.id) {
      onPagoCreado({
        id: resultado.id,
        fecha: fechaUTC,
        monto: montoNum,
        comentarios: comentarios || undefined,
      });
    } else {
      setError(resultado.error || 'Error al crear el movimiento');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear movimiento de pago</DialogTitle>
      <DialogContent sx={{ width: 340 }}>
        <Box display="flex" flexDirection="column" gap={1.5} paddingTop="5px">
          <TextField
            label="Tipo"
            value={tipoNombre}
            size="small"
            slotProps={{ input: { readOnly: true } }}
          />
          <DatePicker
            label="Fecha"
            value={fecha}
            onChange={(date) => setFecha(date)}
            slotProps={{ textField: { fullWidth: true } }}
            sx={styles.datePicker}
            format="DD/MM/YYYY"
          />
          <TextField
            label="Monto"
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            fullWidth
            size="small"
          />
          <Box>
            <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Tipo de pago
            </Box>
            <Box>
              <IconButton
                color={tipoDePago === TipoDeMovimientoGasto.Efectivo ? 'primary' : 'default'}
                aria-label="Efectivo"
                onClick={() => setTipoDePago(TipoDeMovimientoGasto.Efectivo)}
              >
                <LocalAtmIcon />
              </IconButton>
              <IconButton
                color={tipoDePago === TipoDeMovimientoGasto.Debito ? 'primary' : 'default'}
                aria-label="Débito"
                onClick={() => setTipoDePago(TipoDeMovimientoGasto.Debito)}
              >
                <AccountBalanceIcon />
              </IconButton>
              <IconButton
                color={tipoDePago === TipoDeMovimientoGasto.Credito ? 'primary' : 'default'}
                aria-label="Crédito"
                onClick={() => setTipoDePago(TipoDeMovimientoGasto.Credito)}
              >
                <CreditCardIcon />
              </IconButton>
            </Box>
          </Box>
          {error && (
            <Box sx={{ color: 'error.main', fontSize: '0.875rem' }}>{error}</Box>
          )}
        </Box>
      </DialogContent>
      <Box display="flex" justifyContent="center" sx={styles.buttonBar} gap={2}>
        <Button
          onClick={handleCrear}
          color="primary"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          Crear
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
      </Box>
    </Dialog>
  );
};
