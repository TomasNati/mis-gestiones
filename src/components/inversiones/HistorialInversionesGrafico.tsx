import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Box, Typography } from '@mui/material';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import type { HistorialInversionesResponse, ValorInversion } from '@/lib/definitions';

type MonedaDelValor = keyof ValorInversion;

// Colores literales que espejan los tokens (`--series-1`, `--success`,
// `--danger`): MUI X Charts pierde los `var()` al hacer hover.
const COLOR_TOTAL = '#4493f8';
const COLOR_GANANCIA = '#3fb950';
const COLOR_PERDIDA = '#f85149';
const COLOR_CERO = '#3d444d';

const formatearMonto = (valor: number | null, prefijo: string): string => {
  const n = Math.round(valor ?? 0);
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    return `${prefijo}${(n / 1_000_000).toLocaleString('es-AR', { maximumFractionDigits: 2 })} M`;
  }
  if (abs >= 1_000) {
    return `${prefijo}${(n / 1_000).toLocaleString('es-AR', { maximumFractionDigits: 1 })} mil`;
  }
  return `${prefijo}${n.toLocaleString('es-AR')}`;
};

const formatearDelta = (valor: number | null, prefijo: string): string => {
  const n = Math.round(valor ?? 0);
  if (n === 0) return formatearMonto(0, prefijo);
  return `${n > 0 ? '+' : '−'}${formatearMonto(Math.abs(n), prefijo)}`;
};

interface HistorialInversionesGraficoProps {
  data: HistorialInversionesResponse | undefined;
  moneda: MonedaDelValor;
  simbolo: string;
}

const HistorialInversionesGrafico = ({ data, moneda, simbolo }: HistorialInversionesGraficoProps) => {
  const { dataset, dominioTotal, dominioDelta } = useMemo(() => {
    const porFecha = data?.por_fecha ?? [];

    const filas = porFecha
      .slice()
      .reverse()
      .map((pf) => ({
        fecha: dayjs(pf.fecha).format('DD/MM'),
        total: pf.inversiones.reduce((acc, inv) => acc + inv.valor[moneda], 0),
      }));

    const deltas = filas.map((fila, i) => (i === 0 ? null : fila.total - filas[i - 1].total));

    const dataset = filas.map((fila, i) => {
      const delta = deltas[i];
      return {
        fecha: fila.fecha,
        total: fila.total,
        ganancia: delta != null && delta > 0 ? delta : null,
        perdida: delta != null && delta < 0 ? delta : null,
      };
    });

    // Total: eje ajustado al rango real (con aire) para que la tendencia se lea.
    const totales = filas.map((fila) => fila.total);
    const minTotal = totales.length > 0 ? Math.min(...totales) : 0;
    const maxTotal = totales.length > 0 ? Math.max(...totales) : 1;
    const rangoTotal = maxTotal - minTotal;
    const padTotal = rangoTotal > 0 ? rangoTotal * 0.1 : Math.max(Math.abs(maxTotal) * 0.05, 1);

    // Variación: barras desde cero, con lugar para ganancias y pérdidas.
    const deltasValidos = deltas.filter((delta): delta is number => delta != null);
    const minDelta = Math.min(0, ...deltasValidos);
    const maxDelta = Math.max(0, ...deltasValidos);
    const rangoDelta = maxDelta - minDelta;
    const padDelta = rangoDelta > 0 ? rangoDelta * 0.15 : 1;

    return {
      dataset,
      dominioTotal: {
        min: Math.max(0, minTotal - padTotal),
        max: maxTotal + padTotal,
      },
      dominioDelta: {
        min: minDelta - (minDelta < 0 ? padDelta : 0),
        max: maxDelta + (maxDelta > 0 ? padDelta : 0),
      },
    };
  }, [data, moneda]);

  if (dataset.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, inlineSize: 560 }}>
        <Typography variant="body2" color="text.secondary">
          Sin datos para mostrar
        </Typography>
      </Box>
    );
  }

  const prefijo = simbolo === 'US$' ? '' : `${simbolo} `;

  const seriesTotal = [
    {
      type: 'line' as const,
      id: 'total',
      label: 'Total',
      dataKey: 'total',
      color: COLOR_TOTAL,
      curve: 'monotoneX' as const,
      showMark: dataset.length <= 40,
      valueFormatter: (value: number | null) => `${simbolo} ${Math.round(value ?? 0).toLocaleString('es-AR')}`,
    },
  ];

  // Dos series apiladas en el mismo grupo: cada período tiene una sola barra,
  // verde si sube y roja si baja respecto del período anterior.
  const seriesDelta = [
    {
      type: 'bar' as const,
      id: 'ganancia',
      label: 'Ganancia',
      dataKey: 'ganancia',
      stack: 'variacion',
      color: COLOR_GANANCIA,
      valueFormatter: (value: number | null) => formatearDelta(value, prefijo),
    },
    {
      type: 'bar' as const,
      id: 'perdida',
      label: 'Pérdida',
      dataKey: 'perdida',
      stack: 'variacion',
      color: COLOR_PERDIDA,
      valueFormatter: (value: number | null) => formatearDelta(value, prefijo),
    },
  ];

  const ejeX = { id: 'fechas', dataKey: 'fecha', scaleType: 'band' as const };
  const margen = { right: 20, left: 60 };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        inlineSize: '100%',
        minInlineSize: 480,
      }}
    >
      <ChartContainer
        width={560}
        height={200}
        series={seriesTotal}
        dataset={dataset}
        xAxis={[ejeX]}
        yAxis={[
          {
            id: 'total',
            min: dominioTotal.min,
            max: dominioTotal.max,
            valueFormatter: (value: number | null) => formatearMonto(value, prefijo),
          },
        ]}
        margin={{ ...margen, top: 12, bottom: 4 }}
        sx={{ '& .MuiMarkElement-root': { outline: 'none' } }}
      >
        <ChartsGrid vertical={false} horizontal />
        <LinePlot />
        <ChartsYAxis />
        <ChartsTooltip trigger="axis" />
      </ChartContainer>

      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', paddingInlineStart: '60px', marginBlockEnd: '4px' }}
        >
          Variación vs. período anterior
        </Typography>
        <ChartContainer
          width={560}
          height={150}
          series={seriesDelta}
          dataset={dataset}
          xAxis={[ejeX]}
          yAxis={[
            {
              id: 'variacion',
              min: dominioDelta.min,
              max: dominioDelta.max,
              valueFormatter: (value: number | null) => formatearDelta(value, prefijo),
            },
          ]}
          margin={{ ...margen, top: 8, bottom: 24 }}
          sx={{ '& .MuiBarElement-root': { outline: 'none' } }}
        >
          <ChartsGrid vertical={false} horizontal />
          <BarPlot />
          <ChartsXAxis />
          <ChartsYAxis />
          <ChartsReferenceLine y={0} lineStyle={{ stroke: COLOR_CERO }} />
          <ChartsTooltip trigger="item" />
        </ChartContainer>
      </Box>
    </Box>
  );
};

export { HistorialInversionesGrafico };
