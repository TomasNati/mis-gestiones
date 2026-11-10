'use client';

import type { ReactNode } from 'react';
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

export const colorDeNota = (tipo: string) => colorMapNotas[tipo] || 'var(--text-tertiary)';

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
  count: {
    color: 'var(--text-tertiary)',
    fontWeight: 500,
    marginLeft: '1px',
  },
  // Contenido del tooltip: una nota por bloque, con su tipo arriba del comentario.
  contenido: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  nota: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    maxWidth: '300px',
  },
  notaEncabezado: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tipo: {
    fontSize: 'var(--fs-11)',
    letterSpacing: '0.02em',
    color: 'var(--text-tertiary)',
  },
  dia: {
    marginLeft: 'auto',
    paddingLeft: '10px',
    fontSize: '10.5px',
    color: 'var(--text-tertiary)',
    whiteSpace: 'nowrap',
  },
  diaNumero: {
    marginLeft: '4px',
    fontFamily: 'var(--font-mono)',
  },
  comentario: {
    color: 'var(--text-secondary)',
    lineHeight: 1.45,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
  trigger: {
    display: 'flex',
    gap: '4px',
    width: 'fit-content',
    cursor: 'help',
  },
  triggerMes: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: '4px',
    cursor: 'help',
  },
} as const;

/**
 * Texto propio de la nota. Devuelve `''` cuando no se agregó texto o cuando el
 * comentario es sólo el nombre del tipo (dato heredado): en ese caso no se muestra.
 */
export const textoDeNota = (nota: Pick<AgendaTomiNota, 'tipo' | 'comentarios'>): string => {
  const texto = (nota.comentarios ?? '').trim();
  return texto.toLowerCase() === nota.tipo.trim().toLowerCase() ? '' : texto;
};

export const NotaBadge = ({ tipo, count }: { tipo: string; count?: number }) => (
  <Box component="span" sx={estilos.badge}>
    <Box component="span" sx={{ ...estilos.dot, backgroundColor: colorDeNota(tipo) }} />
    {tipo.slice(0, 2).toUpperCase()}
    {count !== undefined && (
      <Box component="span" sx={estilos.count}>
        ×{count}
      </Box>
    )}
  </Box>
);

type NotaVista = {
  id: string;
  tipo: string;
  comentarios?: string;
  /** Día del mes (1-31). Sólo lo llevan las notas del tooltip de la tira de stats. */
  dia?: number;
  /** Nombre del día de la semana (`lunes`, `martes`, …). */
  diaSemana?: string;
};

const NotaVistaItem = ({ nota }: { nota: NotaVista }) => {
  const texto = textoDeNota(nota);

  return (
    <Box sx={estilos.nota}>
      <Box sx={estilos.notaEncabezado}>
        <NotaBadge tipo={nota.tipo} />
        <Box component="span" sx={estilos.tipo}>
          {nota.tipo}
        </Box>
        {nota.dia !== undefined && (
          <Box component="span" sx={estilos.dia}>
            {nota.diaSemana}
            <Box component="span" sx={estilos.diaNumero}>
              {nota.dia}
            </Box>
          </Box>
        )}
      </Box>
      {texto && (
        <Box component="span" sx={estilos.comentario}>
          {texto}
        </Box>
      )}
    </Box>
  );
};

const notasConTexto = (notas: NotaVista[]) => notas.filter((nota) => textoDeNota(nota) !== '');

const ListaNotas = ({ notas }: { notas: NotaVista[] }) => (
  <Box sx={estilos.contenido}>
    {notasConTexto(notas).map((nota) => (
      <NotaVistaItem key={nota.id} nota={nota} />
    ))}
  </Box>
);

interface NotasTooltipProps {
  notas: AgendaTomiNota[];
}

/**
 * Tooltip de un día: lista sus notas y los tipos presentes en los badges.
 * Las notas sin texto no se listan; si ninguna tiene texto, no hay tooltip.
 */
export const NotasTooltip = ({ notas }: NotasTooltipProps) => {
  const tiposUnicos = Array.from(new Set(notas.map((n) => n.tipo)));

  const trigger = (
    <Box sx={estilos.trigger}>
      {tiposUnicos.map((tipo) => (
        <NotaBadge key={tipo} tipo={tipo} />
      ))}
    </Box>
  );

  if (notasConTexto(notas).length === 0) return trigger;

  return (
    <Tooltip arrow title={<ListaNotas notas={notas} />}>
      {trigger}
    </Tooltip>
  );
};

interface NotasDelMesTooltipProps {
  notas: NotaVista[];
  children: ReactNode;
}

/**
 * Tooltip único de la tira de stats: un solo popup para todos los tipos, con
 * las notas del mes que tienen texto (tipo + día). Las notas que sólo tienen el
 * tipo no se listan, por eso puede mostrar menos notas que el contador.
 */
export const NotasDelMesTooltip = ({ notas, children }: NotasDelMesTooltipProps) => {
  if (notasConTexto(notas).length === 0) return <>{children}</>;

  return (
    <Tooltip arrow title={<ListaNotas notas={notas} />}>
      <Box component="span" sx={estilos.triggerMes}>
        {children}
      </Box>
    </Tooltip>
  );
};
