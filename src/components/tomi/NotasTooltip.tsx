'use client';

import { Tooltip, Box } from '@mui/material';
import { AgendaTomiNota } from '@/lib/definitions';

/** Color de serie por tipo de nota (mismo mapeo que la leyenda del mockup). */
const colorMapNotas: Record<string, string> = {
  General: 'var(--series-1)',
  Orina: 'var(--series-4)',
  'Cambio de medicación': 'var(--series-8)',
  Crisis: 'var(--series-7)',
  Malhumor: 'var(--series-2)',
};

const colorDeNota = (tipo: string) => colorMapNotas[tipo] || 'var(--text-tertiary)';

const estilos = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    height: '18px',
    padding: '0 6px',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-mono)',
    fontSize: '10.5px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    border: '1px solid var(--neutral-border)',
    backgroundColor: 'var(--neutral-soft)',
    color: 'var(--text-secondary)',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
} as const;

const NotaBadge = ({ tipo }: { tipo: string }) => (
  <Box component="span" sx={estilos.badge}>
    <Box component="span" sx={{ ...estilos.dot, backgroundColor: colorDeNota(tipo) }} />
    {tipo.slice(0, 2).toUpperCase()}
  </Box>
);

interface NotasTooltipProps {
  notas: AgendaTomiNota[];
}

export const NotasTooltip = ({ notas }: NotasTooltipProps) => {
  const tiposUnicos = Array.from(new Set(notas.map((n) => n.tipo)));

  return (
    <Tooltip
      title={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {notas.map((nota) => (
            <Box key={nota.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
              <NotaBadge tipo={nota.tipo} />
              <span>{nota.comentarios}</span>
            </Box>
          ))}
        </Box>
      }
    >
      <Box sx={{ display: 'flex', gap: '4px', width: 'fit-content' }}>
        {tiposUnicos.map((tipo) => (
          <NotaBadge key={tipo} tipo={tipo} />
        ))}
      </Box>
    </Tooltip>
  );
};
