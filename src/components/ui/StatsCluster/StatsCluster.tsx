'use client';

import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { styles } from './StatsCluster.styles';

/** Tono del valor (`.stat > .value.{tone}` en el mockup). */
export type StatValueTone = 'default' | 'accent' | 'danger' | 'success' | 'attention';

/** Tono del delta (`.stat .delta.t-*`). */
export type StatDeltaTone = 'default' | 'success' | 'danger' | 'attention';

/** Tono del meter (`.meter.is-*`): el color pasa de ámbar a rojo a violeta según cuánto se pasa. */
export type StatMeterTone = 'accent' | 'warn' | 'over' | 'far-over';

export interface StatDelta {
  text: ReactNode;
  tone?: StatDeltaTone;
  /** Ícono a la izquierda del texto (`.stat .delta .icon`). */
  icon?: ReactNode;
}

export interface StatMeter {
  /** Porcentaje 0-100. */
  value: number;
  tone?: StatMeterTone;
  /** Leyenda debajo del meter: texto a la izquierda y % a la derecha. */
  legend?: { left?: ReactNode; pct?: ReactNode };
}

export interface StatStackSegment {
  value: number;
  /** Color de la banda; acepta `var(--series-*)` porque se pinta en el DOM. */
  color: string;
  label: ReactNode;
  /** Detalle extra tras el porcentaje, entre paréntesis (p. ej. el monto total). */
  detail?: ReactNode;
}

/** Barra apilada 100 % (`.stack100` del mockup) con leyenda de porcentajes. */
export interface StatStack {
  segments: StatStackSegment[];
  ariaLabel?: string;
}

export interface StatItem {
  label: ReactNode;
  /** Opcional: un stat compuesto (p. ej. `stack`) puede no tener cifra principal. */
  value?: ReactNode;
  tone?: StatValueTone;
  delta?: StatDelta;
  meter?: StatMeter;
  stack?: StatStack;
  /** Ocupa el resto del ancho (`.stat--wide`), para meter/stack con leyenda. */
  wide?: boolean;
}

export interface StatsClusterProps {
  items: StatItem[];
  pt?: string;
  pb?: string;
}

const valueToneSx: Record<Exclude<StatValueTone, 'default'>, Record<string, unknown>> = {
  accent: styles.valueAccent,
  danger: styles.valueDanger,
  success: styles.valueSuccess,
  attention: styles.valueAttention,
};

const deltaToneSx: Record<Exclude<StatDeltaTone, 'default'>, Record<string, unknown>> = {
  success: styles.deltaSuccess,
  danger: styles.deltaDanger,
  attention: styles.deltaAttention,
};

const meterToneSx: Record<StatMeterTone, Record<string, unknown>> = {
  accent: {},
  warn: styles.meterWarn,
  over: styles.meterOver,
  'far-over': styles.meterFarOver,
};

const meterPctToneSx: Record<StatMeterTone, Record<string, unknown>> = {
  accent: {},
  warn: { color: 'var(--attention)' },
  over: { color: 'var(--danger)' },
  'far-over': { color: 'var(--done)' },
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 100);

/** Porcentaje con hasta un decimal (`65,5 %`). */
const formatPct = (value: number) =>
  `${(Math.round(value * 10) / 10).toLocaleString('es-AR', { maximumFractionDigits: 1 })} %`;

/**
 * Tira de stats (`.stats` del mockup): N stats con valor, delta opcional,
 * meter o barra apilada (`.stack100`) con leyenda.
 * Fuente: docs/mockups/assets/app.css + index.html.
 */
const StatsCluster = ({ items, pt, pb }: StatsClusterProps) => {
  return (
    <Box sx={{ ...styles.container, ...(pt !== undefined && { pt }), ...(pb !== undefined && { pb }) }}>
      {items.map(({ label, value, tone, delta, meter, stack, wide }, index) => {
        const isLast = index === items.length - 1;
        const meterTone = meter?.tone ?? 'accent';
        const stackTotal = stack?.segments.reduce((acc, segment) => acc + segment.value, 0) ?? 0;

        return (
          <Box
            key={index}
            sx={{
              ...styles.stat,
              ...(isLast && styles.statLast),
              ...(wide && styles.statWide),
            }}
          >
            <Box sx={styles.label}>{label}</Box>

            {value !== undefined && (
              <Typography sx={{ ...styles.value, ...(tone && tone !== 'default' && valueToneSx[tone]) }}>
                {value}
              </Typography>
            )}

            {delta && (
              <Box sx={{ ...styles.delta, ...(delta.tone && delta.tone !== 'default' && deltaToneSx[delta.tone]) }}>
                {delta.icon && <Box sx={styles.deltaIcon}>{delta.icon}</Box>}
                {delta.text}
              </Box>
            )}

            {meter && (
              <>
                <Box sx={styles.meter}>
                  <Box
                    component="i"
                    sx={{ ...styles.meterFill, ...meterToneSx[meterTone], width: `${clamp(meter.value)}%` }}
                  />
                </Box>
                {meter.legend && (
                  <Box sx={styles.meterLegend}>
                    <Box component="span">{meter.legend.left}</Box>
                    <Box component="span" sx={{ ...styles.meterLegendPct, ...meterPctToneSx[meterTone] }}>
                      {meter.legend.pct}
                    </Box>
                  </Box>
                )}
              </>
            )}

            {stack && stack.segments.length > 0 && (
              <>
                <Box sx={styles.stack} role="img" aria-label={stack.ariaLabel}>
                  {stack.segments.map((segment, segmentIndex) => (
                    <Box
                      component="i"
                      key={segmentIndex}
                      sx={{
                        ...styles.stackSegment,
                        width: `${stackTotal > 0 ? (segment.value / stackTotal) * 100 : 0}%`,
                        backgroundColor: segment.color,
                        ...(segmentIndex === 0 && styles.stackSegmentFirst),
                        ...(segmentIndex === stack.segments.length - 1 && styles.stackSegmentLast),
                      }}
                    />
                  ))}
                </Box>
                <Box sx={styles.stackLegend}>
                  {stack.segments.map((segment, segmentIndex) => (
                    <Box component="span" key={segmentIndex} sx={styles.stackLegendItem}>
                      <Box component="span" sx={{ ...styles.stackSwatch, backgroundColor: segment.color }} />
                      {segment.label}
                      <Box component="span" sx={styles.stackPct}>
                        {formatPct(stackTotal > 0 ? (segment.value / stackTotal) * 100 : 0)}
                        {segment.detail !== undefined && <> ({segment.detail})</>}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export { StatsCluster };
