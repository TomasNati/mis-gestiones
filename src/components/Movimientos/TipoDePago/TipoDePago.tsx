import { TipoDeMovimientoGasto } from '@/lib/definitions';
import { useState } from 'react';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Box, IconButton, Tooltip } from '@mui/material';

const TipoDePagoVista = ({ tipoDePago }: { tipoDePago: TipoDeMovimientoGasto }) => {
  return (
    <Box>
      {tipoDePago === TipoDeMovimientoGasto.Efectivo && (
        <Tooltip title="Efectivo">
          <LocalAtmIcon color="primary" />
        </Tooltip>
      )}
      {tipoDePago === TipoDeMovimientoGasto.Debito && (
        <Tooltip title="Débito">
          <AccountBalanceIcon color="warning" />
        </Tooltip>
      )}
      {tipoDePago === TipoDeMovimientoGasto.Credito && (
        <Tooltip title="Crédito">
          <CreditCardIcon color="success" />
        </Tooltip>
      )}
    </Box>
  );
};

interface TipoDePagoEdicionProps {
  tipoDepagoInicial?: TipoDeMovimientoGasto;
  onTipoDePagoChange: (tipoDePago: TipoDeMovimientoGasto) => void;
}

const TipoDePagoEdicion = ({ tipoDepagoInicial, onTipoDePagoChange }: TipoDePagoEdicionProps) => {
  const [tipoDePago, setTipoDePago] = useState<TipoDeMovimientoGasto | undefined>(tipoDepagoInicial);

  const colorEfectivo = tipoDePago === TipoDeMovimientoGasto.Efectivo ? 'primary' : 'default';
  const colorDebito = tipoDePago === TipoDeMovimientoGasto.Debito ? 'primary' : 'default';
  const colorCredito = tipoDePago === TipoDeMovimientoGasto.Credito ? 'primary' : 'default';

  const onTipoDePagoModificado = (tipoDePago: TipoDeMovimientoGasto) => {
    setTipoDePago(tipoDePago);
    onTipoDePagoChange(tipoDePago);
  };

  return (
    <Box>
      <IconButton
        color={colorEfectivo}
        aria-label="Efectivo"
        onClick={() => onTipoDePagoModificado(TipoDeMovimientoGasto.Efectivo)}
      >
        <LocalAtmIcon />
      </IconButton>
      <IconButton
        color={colorDebito}
        aria-label="Débito"
        onClick={() => onTipoDePagoModificado(TipoDeMovimientoGasto.Debito)}
      >
        <AccountBalanceIcon />
      </IconButton>
      <IconButton
        color={colorCredito}
        aria-label="Crédito"
        onClick={() => onTipoDePagoModificado(TipoDeMovimientoGasto.Credito)}
      >
        <CreditCardIcon />
      </IconButton>
    </Box>
  );
};

export { TipoDePagoEdicion, TipoDePagoVista };
