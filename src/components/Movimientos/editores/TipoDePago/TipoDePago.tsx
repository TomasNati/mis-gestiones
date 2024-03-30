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
        <Tooltip title="Efectivo" placement="right-start">
          <LocalAtmIcon color="primary" />
        </Tooltip>
      )}
      {tipoDePago === TipoDeMovimientoGasto.Debito && (
        <Tooltip title="Débito" placement="right-start">
          <AccountBalanceIcon color="warning" />
        </Tooltip>
      )}
      {tipoDePago === TipoDeMovimientoGasto.Credito && (
        <Tooltip title="Crédito" placement="right-start">
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key.toLowerCase() === 'e') {
      onTipoDePagoModificado(TipoDeMovimientoGasto.Efectivo);
    } else if (event.key.toLowerCase() === 'd') {
      onTipoDePagoModificado(TipoDeMovimientoGasto.Debito);
    } else if (event.key.toLowerCase() === 'c') {
      onTipoDePagoModificado(TipoDeMovimientoGasto.Credito);
    }
  };

  return (
    <Box>
      <IconButton
        onKeyDown={handleKeyDown}
        color={colorEfectivo}
        aria-label="Efectivo"
        onClick={() => onTipoDePagoModificado(TipoDeMovimientoGasto.Efectivo)}
      >
        <LocalAtmIcon />
      </IconButton>
      <IconButton
        onKeyDown={handleKeyDown}
        color={colorDebito}
        aria-label="Débito"
        onClick={() => onTipoDePagoModificado(TipoDeMovimientoGasto.Debito)}
      >
        <AccountBalanceIcon />
      </IconButton>
      <IconButton
        onKeyDown={handleKeyDown}
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
