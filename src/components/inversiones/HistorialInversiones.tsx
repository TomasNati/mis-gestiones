import { useState, type MouseEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';
import { obtenerHistorialInversiones } from '@/lib/api';
import type { HistorialInversionesPayload, InstrumentoMoneda, TipoDolar } from '@/lib/definitions';
import type { ValorInversion } from '@/lib/definitions';
import { INSTRUMENTO_MONEDA, TIPO_DOLAR, TIPO_DOLAR_LABEL } from '@/lib/definitions';
import { HistorialInversionesGrafico } from '@/components/inversiones/HistorialInversionesGrafico';
import { ChartPanel } from '@/components/ui';
import { styles } from './HistorialInversiones.styles';
import { dateFieldSx } from './dateField.styles';

export const RANGO_HISTORIAL = {
  TRES_MESES: '3_MESES',
  SEIS_MESES: '6_MESES',
  UN_ANIO: '1_ANIO',
  OTRO: 'OTRO',
} as const;

export type RangoHistorial = (typeof RANGO_HISTORIAL)[keyof typeof RANGO_HISTORIAL];

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

const crearSolicitud = (desde: Dayjs, hasta: Dayjs): HistorialInversionesPayload => ({
  desde: desde.toISOString(),
  hasta: hasta.toISOString(),
});

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
  const [solicitado, setSolicitado] = useState<HistorialInversionesPayload | null>(() => {
    const inicio = desdePreset(RANGO_INICIAL, maxFecha);
    return inicio ? crearSolicitud(inicio, maxFecha) : null;
  });

  const historicoQuery = useQuery({
    queryKey: ['inversionesHistorico', solicitado],
    queryFn: () => obtenerHistorialInversiones(solicitado as HistorialInversionesPayload),
    enabled: solicitado != null,
  });

  const rangoEsPersonalizado = rango === RANGO_HISTORIAL.OTRO;

  const handleRangoChange = (_event: MouseEvent<HTMLElement>, nuevoRango: RangoHistorial | null) => {
    if (!nuevoRango) return;
    setRango(nuevoRango);

    // Los presets buscan al instante; "Otro" espera a que se confirme el rango.
    if (nuevoRango === RANGO_HISTORIAL.OTRO) return;

    const inicio = desdePreset(nuevoRango, maxFecha);
    if (!inicio) return;
    setDesde(inicio);
    setHasta(maxFecha);
    setSolicitado(crearSolicitud(inicio, maxFecha));
  };

  const handleAplicar = () => {
    if (desde && hasta) setSolicitado(crearSolicitud(desde, hasta));
  };

  const monedaValor = monedaDelValor(moneda, tipoDolar);
  const simbolo = moneda === INSTRUMENTO_MONEDA.PESO ? '$' : 'US$';
  const unidad = moneda === INSTRUMENTO_MONEDA.PESO ? 'Peso' : `Dólar ${TIPO_DOLAR_LABEL[tipoDolar]}`;

  return (
    <ChartPanel
      title="Evolución por broker"
      hint={unidad}
      aside={
        <ToggleButtonGroup
          exclusive
          size="small"
          value={rango}
          onChange={handleRangoChange}
          aria-label="Rango del historial"
          sx={styles.segmented}
        >
          <ToggleButton value={RANGO_HISTORIAL.TRES_MESES}>3 m</ToggleButton>
          <ToggleButton value={RANGO_HISTORIAL.SEIS_MESES}>6 m</ToggleButton>
          <ToggleButton value={RANGO_HISTORIAL.UN_ANIO}>1 a</ToggleButton>
          <ToggleButton value={RANGO_HISTORIAL.OTRO}>
            <CalendarMonthOutlinedIcon sx={{ fontSize: 14 }} />
            Otro
          </ToggleButton>
        </ToggleButtonGroup>
      }
    >
      {rangoEsPersonalizado && (
        <Box sx={styles.rangoPersonalizado}>
          <DatePicker
            label="Desde"
            value={desde}
            onChange={(nuevaFecha) => setDesde(nuevaFecha)}
            maxDate={hasta ?? maxFecha}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: 'small',
                sx: dateFieldSx,
                inputProps: { 'aria-label': 'Desde' },
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
          <DatePicker
            label="Hasta"
            value={hasta}
            onChange={(nuevaFecha) => setHasta(nuevaFecha)}
            minDate={desde ?? undefined}
            maxDate={maxFecha}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: 'small',
                sx: dateFieldSx,
                inputProps: { 'aria-label': 'Hasta' },
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
          <Button variant="contained" size="small" onClick={handleAplicar} disabled={!desde || !hasta}>
            Aplicar
          </Button>
        </Box>
      )}

      <Box sx={styles.grafico}>
        {historicoQuery.isPending ? (
          <Box sx={styles.placeholder}>
            <CircularProgress size={22} />
          </Box>
        ) : historicoQuery.isError ? (
          <Box sx={styles.placeholder}>
            <Typography variant="body2" color="text.secondary">
              No se pudo cargar el historial.
            </Typography>
          </Box>
        ) : historicoQuery.data ? (
          <HistorialInversionesGrafico data={historicoQuery.data} moneda={monedaValor} simbolo={simbolo} />
        ) : (
          <Box sx={styles.placeholder}>
            <Typography variant="body2" color="text.secondary">
              Sin datos para mostrar.
            </Typography>
          </Box>
        )}
      </Box>
    </ChartPanel>
  );
};
