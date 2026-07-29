import { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';

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

interface HistorialInversionesProps {
  maxFecha: Dayjs;
}

export const HistorialInversiones = ({ maxFecha }: HistorialInversionesProps) => {
  const [rango, setRango] = useState<RangoHistorial>(RANGO_INICIAL);
  const [desde, setDesde] = useState<Dayjs | null>(() => desdePreset(RANGO_INICIAL, maxFecha));
  const [hasta, setHasta] = useState<Dayjs | null>(maxFecha);

  const rangoEsPersonalizado = rango === RANGO_HISTORIAL.OTRO;

  const handleRangoChange = (event: SelectChangeEvent<RangoHistorial>) => {
    const nuevoRango = event.target.value as RangoHistorial;
    setRango(nuevoRango);

    // A preset owns both dates; Otro keeps the ones already shown so they become the
    // starting point the user edits.
    const nuevoDesde = desdePreset(nuevoRango, maxFecha);
    if (nuevoDesde) {
      setDesde(nuevoDesde);
      setHasta(maxFecha);
    }
  };

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
      </Box>
      <Button variant="contained" size="small">
        Mostrar
      </Button>
    </Box>
  );
};
