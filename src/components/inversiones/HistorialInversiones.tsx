import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';
import { obtenerHistorialInversiones } from '@/lib/api';
import type { HistorialInversionesPayload, InstrumentoMoneda, TipoDolar } from '@/lib/definitions';
import { INSTRUMENTO_MONEDA, TIPO_DOLAR, TIPO_DOLAR_LABEL } from '@/lib/definitions';
import { HistorialInversionesGrafico } from '@/components/inversiones/HistorialInversionesGrafico';
import type { ValorInversion } from '@/lib/definitions';

export const RANGO_HISTORIAL = {
  TRES_MESES: '3_MESES',
  SEIS_MESES: '6_MESES',
  UN_ANIO: '1_ANIO',
  OTRO: 'OTRO',
} as const;

export type RangoHistorial = (typeof RANGO_HISTORIAL)[keyof typeof RANGO_HISTORIAL];

export const RANGO_HISTORIAL_LABEL: Record<RangoHistorial, string> = {
  [RANGO_HISTORIAL.TRES_MESES]: '3 meses',
  [RANGO_HISTORIAL.SEIS_MESES]: '6 meses',
  [RANGO_HISTORIAL.UN_ANIO]: '1 año',
  [RANGO_HISTORIAL.OTRO]: 'Otro',
};

const RANGOS = Object.values(RANGO_HISTORIAL);

const RANGO_INICIAL = RANGO_HISTORIAL.TRES_MESES;

const MESES_POR_RANGO: Record<RangoHistorial, number | null> = {
  [RANGO_HISTORIAL.TRES_MESES]: 3,
  [RANGO_HISTORIAL.SEIS_MESES]: 6,
  [RANGO_HISTORIAL.UN_ANIO]: 12,
  [RANGO_HISTORIAL.OTRO]: null,
};

// Presets end at `hasta` and reach back a fixed number of months. Otro has no offset:
// its dates come from the user.
const desdePreset = (rango: RangoHistorial, hasta: Dayjs): Dayjs | null => {
  const meses = MESES_POR_RANGO[rango];
  return meses == null ? null : hasta.subtract(meses, 'month');
};

const RANGO_SX = { inlineSize: 130 };
const FECHA_SX = { inlineSize: 150 };

const monedaDelValor = (moneda: InstrumentoMoneda, tipoDolar: TipoDolar): keyof ValorInversion => {
  if (moneda === INSTRUMENTO_MONEDA.PESO) return 'peso';
  if (tipoDolar === TIPO_DOLAR.OFICIAL) return 'dolar_oficial';
  if (tipoDolar === TIPO_DOLAR.CCL) return 'dolar_ccl';
  return 'dolar_bolsa';
};

interface HistorialInversionesProps {
  maxFecha: Dayjs;
  moneda: InstrumentoMoneda;
  tipoDolar: TipoDolar;
}

export const HistorialInversiones = ({ maxFecha, moneda, tipoDolar }: HistorialInversionesProps) => {
  const [rango, setRango] = useState<RangoHistorial>(RANGO_INICIAL);
  const [desde, setDesde] = useState<Dayjs | null>(() => desdePreset(RANGO_INICIAL, maxFecha));
  const [hasta, setHasta] = useState<Dayjs | null>(maxFecha);
  const [solicitado, setSolicitado] = useState<HistorialInversionesPayload | null>(null);

  const historicoQuery = useQuery({
    queryKey: ['inversionesHistorico', solicitado],
    queryFn: () => obtenerHistorialInversiones(solicitado as HistorialInversionesPayload),
    enabled: solicitado != null,
  });

  useEffect(() => {
    if (historicoQuery.data) {
      console.log(historicoQuery.data);
    }
  }, [historicoQuery.data]);

  const rangoEsPersonalizado = rango === RANGO_HISTORIAL.OTRO;

  const handleRangoChange = (event: SelectChangeEvent<RangoHistorial>) => {
    const nuevoRango = event.target.value as RangoHistorial;
    setRango(nuevoRango);

    const nuevoDesde = desdePreset(nuevoRango, maxFecha);
    if (nuevoDesde) {
      setDesde(nuevoDesde);
      setHasta(maxFecha);
    }
  };

  const handleMostrarClick = () => {
    if (desde && hasta) {
      setSolicitado({ desde: desde.toISOString(), hasta: hasta.toISOString() });
    }
  };

  const monedaValor = monedaDelValor(moneda, tipoDolar);
  const simbolo = moneda === INSTRUMENTO_MONEDA.PESO ? '$' : 'US$';
  const unidad = moneda === INSTRUMENTO_MONEDA.PESO ? 'Peso' : `Dólar ${TIPO_DOLAR_LABEL[tipoDolar]}`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        Historial:
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <FormControl size="small" sx={RANGO_SX}>
          <InputLabel id="rango-historial-label">Rango</InputLabel>
          <Select labelId="rango-historial-label" label="Rango" value={rango} onChange={handleRangoChange}>
            {RANGOS.map((valor) => (
              <MenuItem key={valor} value={valor}>
                {RANGO_HISTORIAL_LABEL[valor]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DatePicker
          label="Desde"
          value={desde}
          onChange={(nuevaFecha) => setDesde(nuevaFecha)}
          maxDate={hasta ?? maxFecha}
          disabled={!rangoEsPersonalizado}
          slotProps={{ textField: { size: 'small', sx: FECHA_SX } }}
        />
        <DatePicker
          label="Hasta"
          value={hasta}
          onChange={(nuevaFecha) => setHasta(nuevaFecha)}
          minDate={desde ?? undefined}
          maxDate={maxFecha}
          disabled={!rangoEsPersonalizado}
          slotProps={{ textField: { size: 'small', sx: FECHA_SX } }}
        />
        <Button variant="contained" size="small" onClick={handleMostrarClick}>
          Mostrar
        </Button>
      </Box>
      {historicoQuery.data && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, inlineSize: '100%' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Evolución por broker - {unidad}
          </Typography>
          <HistorialInversionesGrafico data={historicoQuery.data} moneda={monedaValor} simbolo={simbolo} />
        </Box>
      )}
    </Box>
  );
};
