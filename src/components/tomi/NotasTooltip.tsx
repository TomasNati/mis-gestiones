'use client';

import { Tooltip, Box, SxProps } from '@mui/material';
import { AgendaTomiNota } from '@/lib/definitions';
import theme from '@/components/ThemeRegistry/theme';

const colorMapNotas: Record<string, string> = {
  General: '#1976d2',
  Orina: '#f9a825',
  'Cambio de medicación': '#e53935',
  Crisis: '#6a1b9a',
  Malhumor: '#ef6c00',
};

const tipoNotaStyles = (tipo: string): SxProps => {
  const color = colorMapNotas[tipo] || '#888';
  return {
    bgcolor: color,
    color: '#fff',
    borderRadius: '3px',
    px: 0.5,
    fontSize: '0.75rem',
    fontWeight: 700,
    lineHeight: '1.2',
  }
};

interface NotasTooltipProps {
  notas: AgendaTomiNota[];
}

export const NotasTooltip = ({ notas }: NotasTooltipProps) => {
  const tiposUnicos = Array.from(new Set(notas.map((n) => n.tipo)));

  return (
    <Tooltip
      title={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {notas.map((nota) => {
            const prefijo = nota.tipo.slice(0, 2).toUpperCase();
            return (
              <Box key={nota.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                <Box sx={tipoNotaStyles(nota.tipo)}>{prefijo}</Box>
                <span>{nota.comentarios}</span>
              </Box>
            );
          })}
        </Box>
      }
    >
      <Box
        sx={{
          display: 'flex',
          gap: '2px',
          '&:hover': {
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          },
          width: 'fit-content'
        }}
      >
        {tiposUnicos.map((tipo) => {
          const prefijo = tipo.slice(0, 2).toUpperCase();
          return (
            <Box key={tipo} sx={tipoNotaStyles(tipo)}>
              {prefijo}
            </Box>
          );
        })}
      </Box>
    </Tooltip>
  );
};
