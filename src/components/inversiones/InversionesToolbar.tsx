import { Box, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { INSTRUMENTO_MONEDA, InstrumentoMoneda } from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';

interface InversionesToolbarProps {
  moneda: InstrumentoMoneda;
  total: string;
  dolarVenta: number | null;
  onNuevaInversion: () => void;
  onMonedaChange: (
    event: React.MouseEvent<HTMLElement>,
    nuevaMoneda: InstrumentoMoneda | null,
  ) => void;
}

export const InversionesToolbar = ({
  moneda,
  total,
  dolarVenta,
  onNuevaInversion,
  onMonedaChange,
}: InversionesToolbarProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
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
    <Box sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>Total: {total}</Box>
    {dolarVenta != null && (
      <Box sx={{ ml: 2, color: 'text.secondary', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
        Dólar oficial: $ {transformNumberToCurrenty(dolarVenta)}
      </Box>
    )}
  </Box>
);
