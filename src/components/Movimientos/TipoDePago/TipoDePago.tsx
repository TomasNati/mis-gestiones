import { TipoDeMovimientoGasto } from '@/lib/definitions';
import { useState } from 'react';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Box, IconButton } from '@mui/material';

interface TipoDePagoProps {
  tipoDepagoInicial?: TipoDeMovimientoGasto;
  onTipoDePagoChange: (tipoDePago: TipoDeMovimientoGasto) => void;
}

const TipoDePago = ({ tipoDepagoInicial, onTipoDePagoChange }: TipoDePagoProps) => {
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

export { TipoDePago };
