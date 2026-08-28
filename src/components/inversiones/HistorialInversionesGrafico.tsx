import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Box, Typography } from '@mui/material';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import type { HistorialInversionesResponse, ValorInversion } from '@/lib/definitions';

type MonedaDelValor = keyof ValorInversion;

const PALETA = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];

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

interface HistorialInversionesGraficoProps {
  data: HistorialInversionesResponse | undefined;
  moneda: MonedaDelValor;
  simbolo: string;
}

const HistorialInversionesGrafico = ({ data, moneda, simbolo }: HistorialInversionesGraficoProps) => {
  const { brokers, dataset } = useMemo(() => {
    const porFecha = data?.por_fecha ?? [];
    const brokers = Array.from(
      new Set(porFecha.flatMap((pf) => pf.inversiones.map((inv) => inv.inversion.broker))),
    ).sort();

    const dataset = porFecha
      .slice()
      .reverse()
      .map((pf) => {
        const fila: Record<string, string | number> = { fecha: dayjs(pf.fecha).format('DD/MM') };
        let total = 0;
        for (const broker of brokers) {
          const subtotal = pf.inversiones
            .filter((inv) => inv.inversion.broker === broker)
            .reduce((acc, inv) => acc + inv.valor[moneda], 0);
          fila[broker] = subtotal;
          total += subtotal;
        }
        fila.total = total;
        return fila;
      });

    return { brokers, dataset };
  }, [data, moneda]);

  if (dataset.length === 0 || brokers.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, inlineSize: 560 }}>
        <Typography variant="body2" color="text.secondary">
          Sin datos para mostrar
        </Typography>
      </Box>
    );
  }

  const prefijo = simbolo === 'US$' ? '' : `${simbolo} `;

  const series = [
    ...brokers.map((broker, i) => ({
      type: 'bar' as const,
      id: `bar-${broker}`,
      label: broker,
      dataKey: broker,
      stack: 'total',
      color: PALETA[i % PALETA.length],
      valueFormatter: (value: number | null) =>
        `$ ${Math.round(value ?? 0).toLocaleString('es-AR')}`,
    })),
    {
      type: 'line' as const,
      id: 'line-total',
      label: 'Total',
      dataKey: 'total',
      color: '#222831',
      markerHeight: 5,
      valueFormatter: (value: number | null) =>
        `$ ${Math.round(value ?? 0).toLocaleString('es-AR')}`,
    },
  ];

  return (
    <Box sx={{ inlineSize: '100%', minInlineSize: 480 }}>
      <ChartContainer
        width={560}
        height={320}
        series={series}
        dataset={dataset}
        xAxis={[{ id: 'fechas', dataKey: 'fecha', scaleType: 'band' }]}
        yAxis={[
          {
            id: 'montos',
            valueFormatter: (value: number | null) =>
              formatearMonto(value, prefijo),
          },
        ]}
        margin={{ top: 30, right: 20, left: 60, bottom: 50 }}
        sx={{
          '& .MuiMarkElement-root': {
            outline: 'none',
          },
        }}
      >
        <ChartsGrid vertical={false} horizontal />
        <BarPlot />
        <LinePlot />
        <ChartsXAxis />
        <ChartsYAxis />
        <ChartsLegend />
        <ChartsTooltip trigger="axis" />
      </ChartContainer>
    </Box>
  );
};

export { HistorialInversionesGrafico };
