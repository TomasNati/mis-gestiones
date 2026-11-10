import React, { Fragment } from 'react';
import { Box } from '@mui/material';
import { EventoSuenio, TipoEventoSuenio } from '@/lib/definitions';
import { timeStringToMinutes, minutesToTimeString } from '@/lib/helpers';

const DIA_EN_MINUTOS = 24 * 60;
const POSICIONES_TICK = [25, 50, 75];

/**
 * Duración mínima (en minutos) para escribir la duración dentro del tramo.
 * Los tramos cortos (p. ej. una siesta) no la llevan, como en el mockup.
 */
const DURACION_MINIMA_LABEL = 120;

interface Tramo {
  tipo: TipoEventoSuenio;
  inicio: number;
  fin: number;
}

/**
 * Convierte los eventos (cambios de estado) en tramos continuos.
 * El primer tramo arranca con el estado con el que venía el día anterior.
 */
const transformSegments = (segmentos: EventoSuenio[], estadoSuenioPrevio: TipoEventoSuenio): Tramo[] => {
  if (segmentos.length === 0) return [];

  let inicio = 0;
  const resultado: Tramo[] = [];

  segmentos.forEach((segmento, index) => {
    const fin = timeStringToMinutes(segmento.hora);
    resultado.push({
      tipo: index === 0 ? estadoSuenioPrevio : segmentos[index - 1].tipo,
      inicio,
      fin,
    });
    inicio = fin;
  });

  // Tramo final: del último evento al final del día.
  resultado.push({
    tipo: segmentos[segmentos.length - 1].tipo,
    inicio,
    fin: DIA_EN_MINUTOS,
  });

  return resultado;
};

const aPorcentaje = (minutos: number) => (minutos / DIA_EN_MINUTOS) * 100;

const minutosAHora = (minutos: number) => {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const estilos = {
  timeline: {
    position: 'relative',
    height: '22px',
    borderRadius: '4px',
    backgroundColor: 'var(--bg-elevated)',
    overflow: 'visible',
  },
  timelineVacio: {
    position: 'relative',
    height: '22px',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    border: '1px dashed var(--border-soft)',
    overflow: 'visible',
  },
  tick: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '1px',
    backgroundColor: 'var(--border-soft)',
  },
  segment: {
    position: 'absolute',
    top: 0,
    height: '100%',
    borderRadius: '3px',
    backgroundColor: 'var(--series-1)',
  },
  duration: {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: '#fff',
    overflow: 'hidden',
    padding: '0 4px',
  },
  mark: {
    position: 'absolute',
    top: '-15px',
    transform: 'translateX(-50%)',
    fontFamily: 'var(--font-mono)',
    fontSize: '10.5px',
    color: 'var(--text-tertiary)',
    whiteSpace: 'nowrap',
  },
  emptyLabel: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '11.5px',
    color: 'var(--text-tertiary)',
  },
} as const;

type Props = {
  data: EventoSuenio[];
  estadoSuenioPrevio: TipoEventoSuenio;
};

const BarraSuenio: React.FC<Props> = ({ data, estadoSuenioPrevio }) => {
  const tramosDormidos = transformSegments(data, estadoSuenioPrevio).filter((tramo) => tramo.tipo === 'Dormido');
  const estaVacio = tramosDormidos.length === 0;

  return (
    <Box sx={estaVacio ? estilos.timelineVacio : estilos.timeline}>
      {POSICIONES_TICK.map((posicion) => (
        <Box key={posicion} sx={{ ...estilos.tick, left: `${posicion}%`, opacity: estaVacio ? 0.35 : 0.6 }} />
      ))}

      {estaVacio && (
        <Box component="span" sx={estilos.emptyLabel}>
          Sin registro
        </Box>
      )}

      {tramosDormidos.map((tramo) => {
        const duracion = tramo.fin - tramo.inicio;
        return (
          <Box
            key={`tramo-${tramo.inicio}`}
            title={`Dormido ${minutosAHora(tramo.inicio)} → ${minutosAHora(tramo.fin)}`}
            sx={{ ...estilos.segment, left: `${aPorcentaje(tramo.inicio)}%`, width: `${aPorcentaje(duracion)}%` }}
          >
            {duracion >= DURACION_MINIMA_LABEL && (
              <Box component="span" sx={estilos.duration}>
                {minutesToTimeString(duracion)}
              </Box>
            )}
          </Box>
        );
      })}

      {tramosDormidos.map((tramo) => (
        <Fragment key={`marcas-${tramo.inicio}`}>
          <Box component="span" sx={{ ...estilos.mark, left: `${aPorcentaje(tramo.inicio)}%` }}>
            {minutosAHora(tramo.inicio)}
          </Box>
          <Box component="span" sx={{ ...estilos.mark, left: `${aPorcentaje(tramo.fin)}%` }}>
            {minutosAHora(tramo.fin)}
          </Box>
        </Fragment>
      ))}
    </Box>
  );
};

export default BarraSuenio;
