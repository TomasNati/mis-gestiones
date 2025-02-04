import React from 'react';
import { LinearProgress, Box, Tooltip } from '@mui/material';
import { EventoSuenio, TipoEventoSuenio } from '@/lib/definitions';
// export type TipoEventoSuenio = 'Despierto' | 'Dormido';

// export interface EventoSuenio {
//   id: string;
//   hora: string;
//   comentarios?: string;
//   tipo: TipoEventoSuenio;
// }

interface ResultSegment {
  tipo: TipoEventoSuenio;
  start: number;
  end: number;
}

const timeStringToMinutes = (time: string): number => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const transformSegments = (segments: EventoSuenio[]): ResultSegment[] => {
  let start = 0;
  const result: ResultSegment[] = [];

  segments.forEach((segment, index) => {
    const end = timeStringToMinutes(segment.hora);
    result.push({ tipo: index === 0 ? 'Despierto' : segments[index - 1].tipo, start, end });
    start = end;
  });

  // Add the last segment
  result.push({ tipo: segments[segments.length - 1].tipo, start, end: timeStringToMinutes('23:59:59') + 1 });

  return result;
};

type Props = {
  data: EventoSuenio[];
};

const BarraSuenio: React.FC<Props> = ({ data }) => {
  const segmentos = transformSegments(data);
  return (
    <Box sx={{ display: 'flex', width: '100%', height: '30px' }}>
      {segmentos.map((segment, index) => (
        <Box key={index} width={`${((segment.end - segment.start) / 1440) * 100}%`}>
          <LinearProgress
            variant="determinate"
            value={100}
            sx={{
              height: '22px',
              borderRadius: segment.start === 0 ? '5px 0 0 5px' : segment.end === 1440 ? '0 5px 5px 0' : '0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: segment.tipo === 'Despierto' ? '#4caf50' : '#28749a',
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default BarraSuenio;
