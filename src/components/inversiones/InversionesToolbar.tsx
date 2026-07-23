import { Box, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  INSTRUMENTO_MONEDA,
  InstrumentoMoneda,
  TIPO_DOLAR,
  TIPO_DOLAR_LABEL,
  TipoDolar,
} from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';

interface InversionesToolbarProps {
  moneda: InstrumentoMoneda;
  tipoDolar: TipoDolar;
  total: string;
  dolarVenta: number | null;
  onNuevaInversion: () => void;
  onMonedaChange: (
    event: React.MouseEvent<HTMLElement>,
    nuevaMoneda: InstrumentoMoneda | null,
  ) => void;
  onTipoDolarChange: (
    event: React.MouseEvent<HTMLElement>,
    nuevoTipoDolar: TipoDolar | null,
  ) => void;
}

export const InversionesToolbar = ({
  moneda,
  tipoDolar,
  total,
  dolarVenta,
  onNuevaInversion,
  onMonedaChange,
  onTipoDolarChange,
}: InversionesToolbarProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5, flexWrap: 'wrap', gap: 1 }}>
    <Button variant="contained" size="small" onClick={onNuevaInversion} sx={{ py: 0.5 }}>
      Nueva Inversión
    </Button>
    <ToggleButtonGroup exclusive size="small" value={moneda} onChange={onMonedaChange} sx={{ mx: 2 }}>
      <ToggleButton value={INSTRUMENTO_MONEDA.PESO} sx={{ py: 0.5 }}>
        Peso
      </ToggleButton>
      <ToggleButton value={INSTRUMENTO_MONEDA.DOLAR} sx={{ py: 0.5 }}>
        Dólar
      </ToggleButton>
    </ToggleButtonGroup>
    <ToggleButtonGroup exclusive size="small" value={tipoDolar} onChange={onTipoDolarChange}>
      <ToggleButton value={TIPO_DOLAR.MEP} sx={{ py: 0.5 }}>
        {TIPO_DOLAR_LABEL[TIPO_DOLAR.MEP]}
      </ToggleButton>
      <ToggleButton value={TIPO_DOLAR.OFICIAL} sx={{ py: 0.5 }}>
        {TIPO_DOLAR_LABEL[TIPO_DOLAR.OFICIAL]}
      </ToggleButton>
      <ToggleButton value={TIPO_DOLAR.CCL} sx={{ py: 0.5 }}>
        {TIPO_DOLAR_LABEL[TIPO_DOLAR.CCL]}
      </ToggleButton>
    </ToggleButtonGroup>
    <Box sx={{ fontWeight: 500, whiteSpace: 'nowrap', ml: 2 }}>Total: {total}</Box>
    {dolarVenta != null && (
      <Box sx={{ ml: 2, color: 'text.secondary', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
        Dólar {TIPO_DOLAR_LABEL[tipoDolar]}: $ {transformNumberToCurrenty(dolarVenta)}
      </Box>
    )}
  </Box>
);
