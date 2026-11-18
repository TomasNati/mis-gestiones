'use client';

import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Box } from '@mui/material';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import type { HistorialInversionesResponse } from '@/lib/definitions';
import { formatearVariacion, type InstrumentoDelHistorial } from '@/lib/inversiones/historial';

export type MetricaPrecios = 'variacion' | 'precio';

type FilaPrecios = Record<string, string | number | null>;

interface EvolucionPreciosGraficoProps {
  data: HistorialInversionesResponse | undefined;
  instrumentos: InstrumentoDelHistorial[];
  metrica: MetricaPrecios;
  simbolo: string;
}

const formatearPrecio = (valor: number | null, simbolo: string): string =>
  `${simbolo} ${Math.round(valor ?? 0).toLocaleString('es-AR')}`;

const EvolucionPreciosGrafico = ({ data, instrumentos, metrica, simbolo }: EvolucionPreciosGraficoProps) => {
  const { dataset, dominio } = useMemo(() => {
    const porFecha = (data?.por_fecha ?? []).slice().reverse();
    const crudo: FilaPrecios[] = porFecha.map((pf) => {
      const fila: FilaPrecios = { fecha: dayjs(pf.fecha).format('DD/MM') };
      instrumentos.forEach((inst) => {
        fila[inst.id] = pf.inversiones.find((inv) => inv.inversion.instrumento.id === inst.id)?.precio ?? null;
      });
      return fila;
    });

    if (metrica !== 'variacion') {
      const valores = crudo.flatMap((fila) =>
        instrumentos.map((inst) => fila[inst.id]).filter((valor): valor is number => typeof valor === 'number'),
      );
      const min = valores.length > 0 ? Math.min(...valores) : 0;
      const max = valores.length > 0 ? Math.max(...valores) : 1;
      const pad = (max - min) * 0.1 || Math.max(Math.abs(max) * 0.05, 1);
      return {
        dataset: crudo,
        dominio: { min: Math.max(0, min - pad), max: max + pad },
      };
    }

    const bases = new Map<string, number>();
    instrumentos.forEach((inst) => {
      const base = crudo.find((fila) => typeof fila[inst.id] === 'number')?.[inst.id];
      if (typeof base === 'number' && base !== 0) bases.set(inst.id, base);
    });

    const datasetVariacion = crudo.map((fila) => {
      const salida: FilaPrecios = { ...fila };
      instrumentos.forEach((inst) => {
        const precio = fila[inst.id];
        const base = bases.get(inst.id);
        salida[inst.id] = typeof precio === 'number' && base ? (precio / base - 1) * 100 : null;
      });
      return salida;
    });

    const valores = datasetVariacion.flatMap((fila) =>
      instrumentos.map((inst) => fila[inst.id]).filter((valor): valor is number => typeof valor === 'number'),
    );
    const min = Math.min(0, ...valores);
    const max = Math.max(0, ...valores);
    const pad = (max - min) * 0.1 || 1;
    return {
      dataset: datasetVariacion,
      dominio: { min: min - pad, max: max + pad },
    };
  }, [data, instrumentos, metrica]);

  if (dataset.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 220,
          border: '1px dashed var(--border-soft)',
          borderRadius: 'var(--radius)',
        }}
      >
        Sin datos para mostrar
      </Box>
    );
  }

  const series = instrumentos.map((inst) => ({
    type: 'line' as const,
    id: inst.id,
    label: inst.tick,
    dataKey: inst.id,
    color: inst.color,
    curve: 'monotoneX' as const,
    showMark: dataset.length <= 20,
    valueFormatter: (valor: number | null) =>
      metrica === 'variacion' ? formatearVariacion(valor ?? 0) : formatearPrecio(valor, simbolo),
  }));

  return (
    <ChartContainer
      width={560}
      height={260}
      series={series}
      dataset={dataset}
      xAxis={[{ id: 'fechas', dataKey: 'fecha', scaleType: 'band' }]}
      yAxis={[
        {
          id: 'precios',
          min: dominio.min,
          max: dominio.max,
          valueFormatter: (valor: number | null) =>
            metrica === 'variacion' ? formatearVariacion(valor ?? 0) : formatearPrecio(valor, simbolo),
        },
      ]}
      margin={{ right: 20, left: 60, top: 12, bottom: 24 }}
      sx={{ '& .MuiMarkElement-root': { outline: 'none' } }}
    >
      <ChartsGrid vertical={false} horizontal />
      <LinePlot />
      <ChartsXAxis />
      <ChartsYAxis />
      {metrica === 'variacion' && <ChartsReferenceLine y={0} lineStyle={{ stroke: 'var(--border-soft)' }} />}
      <ChartsTooltip trigger="axis" />
    </ChartContainer>
  );
};

export { EvolucionPreciosGrafico };
