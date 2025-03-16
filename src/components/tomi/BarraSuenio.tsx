import React from 'react';
import { LinearProgress, Box, Typography, duration } from '@mui/material';
import { EventoSuenio, TipoEventoSuenio } from '@/lib/definitions';
import { timeStringToMinutes, minutesToTimeString } from '@/lib/helpers';

interface ResultSegment {
  tipo: TipoEventoSuenio;
  start: number;
  end: number;
  hora: string;
}

const transformSegments = (segments: EventoSuenio[], estadoSuenioPrevio: TipoEventoSuenio): ResultSegment[] => {
  if (segments.length === 0) return [];

  let start = 0;
  const result: ResultSegment[] = [];

  segments.forEach((segment, index) => {
    const end = timeStringToMinutes(segment.hora);
    result.push({
      tipo: index === 0 ? estadoSuenioPrevio : segments[index - 1].tipo,
      start,
      end,
      hora: segment.hora.slice(0, 5),
    });
    start = end;
  });

  // Add the last segment
  result.push({
    tipo: segments[segments.length - 1].tipo,
    start,
    end: timeStringToMinutes('23:59:59') + 1,
    hora: segments[segments.length - 1].hora.slice(0, 5),
  });

  return result;
};

const LinearProgressWithLabel = ({ tipo, start, end, hora }: ResultSegment) => {
  const showLabel = end < 1440;

  let durationLabel = null;
  if (tipo === 'Dormido') {
    const durationMinutes = end - start;
    durationLabel = minutesToTimeString(durationMinutes);
  }

  return (
    <Box position="relative" display="flex" alignItems="center" flexDirection="column">
      <Box width="100%" mr={1}>
        <LinearProgress
          variant="determinate"
          value={100}
          sx={{
            height: '22px',
            borderRadius: start === 0 ? '5px 0 0 5px' : end === 1440 ? '0 5px 5px 0' : '0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: tipo === 'Despierto' ? '#4caf50' : '#28749a',
            },
          }}
        />
      </Box>
      {showLabel ? (
        <Box position="absolute" right="-10px" top="-20px">
          <Typography variant="caption" color="textSecondary">
            {hora}
          </Typography>
        </Box>
      ) : null}
      {durationLabel ? (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="caption" color="textPrimary">
            {durationLabel}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

type Props = {
  data: EventoSuenio[];
  estadoSuenioPrevio: TipoEventoSuenio;
};

const BarraSuenio: React.FC<Props> = ({ data, estadoSuenioPrevio }) => {
  const segmentos = transformSegments(data, estadoSuenioPrevio);

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '30px' }}>
      {segmentos.map((segment, index) => (
        <Box key={index} width={`${((segment.end - segment.start) / 1440) * 100}%`}>
          <LinearProgressWithLabel {...segment} />
        </Box>
      ))}
    </Box>
  );
};

export default BarraSuenio;
