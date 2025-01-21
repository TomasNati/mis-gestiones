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

const borderDefinitions = [
  { borderStyle: 'none', borderProps: {} },
  {
    borderStyle: 'solid',
    borderProps: {
      border: '1px solid rgba(255, 255, 255, 0.23)',
      borderRadius: '5px',
    },
  },
];

interface TipoDePagoEdicionProps {
  tipoDepagoInicial?: TipoDeMovimientoGasto;
  onTipoDePagoChange: (tipoDePago: TipoDeMovimientoGasto) => void;
  onTabPressed: () => void;
  borderStyle?: 'none' | 'solid';
}

const TipoDePagoEdicion = ({
  tipoDepagoInicial,
  onTipoDePagoChange,
  onTabPressed,
  borderStyle,
}: TipoDePagoEdicionProps) => {
  const [tipoDePago, setTipoDePago] = useState<TipoDeMovimientoGasto | undefined>(tipoDepagoInicial);

  const colorEfectivo = tipoDePago === TipoDeMovimientoGasto.Efectivo ? 'primary' : 'default';
  const colorDebito = tipoDePago === TipoDeMovimientoGasto.Debito ? 'primary' : 'default';
  const colorCredito = tipoDePago === TipoDeMovimientoGasto.Credito ? 'primary' : 'default';

  const borderStyles = borderDefinitions.find((border) => border.borderStyle === borderStyle) || borderDefinitions[0];

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
    } else if (event.key === 'Tab') {
      onTabPressed();
    }
  };

  return (
    <Box sx={{ ...borderStyles.borderProps }}>
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
