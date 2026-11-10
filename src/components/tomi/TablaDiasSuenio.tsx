'use client';

import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { AgendaTomiDia, TipoEventoSuenio } from '@/lib/definitions';
import BarraSuenio from '@/components/tomi/BarraSuenio';
import { NotasTooltip } from '@/components/tomi/NotasTooltip';

/** Marcas horarias del encabezado del timeline (cada 3 h). */
const HORAS = ['00', '03', '06', '09', '12', '15', '18', '21', '24'];

/**
 * Estilos de la grilla de días del mes, espejando las clases del mockup
 * (`docs/mockups/tomi.html`) pero con `sx` + tokens del tema.
 */
const estilos = {
  tabla: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontSize: '13.5px',
  },
  encabezado: {
    '& th': {
      position: 'sticky',
      top: 0,
      zIndex: 2,
      height: '36px',
      paddingTop: 0,
      paddingBottom: 0,
      textAlign: 'left',
      whiteSpace: 'nowrap',
      backgroundColor: 'var(--bg-page)',
      color: 'var(--text-tertiary)',
      fontSize: '11.5px',
      fontWeight: 500,
      letterSpacing: '0.02em',
      borderBottom: '1px solid var(--border-soft)',
    },
    '& th:first-of-type': { paddingLeft: 'var(--gutter)' },
    '& th.actions': { width: '1%', whiteSpace: 'nowrap', textAlign: 'right' },
    '& th.tl-col': { paddingLeft: '20px', paddingRight: '20px' },
  },
  cuerpo: {
    '& td': {
      padding: '8px 12px',
      textAlign: 'left',
      verticalAlign: 'middle',
      borderBottom: '1px solid var(--border-muted)',
    },
    '& td:first-of-type': { paddingLeft: 'var(--gutter)' },
    '& td.actions': { width: '1%', whiteSpace: 'nowrap', textAlign: 'right' },
    '& td.tl-cell': {
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '20px',
      paddingBottom: '8px',
    },
    '& tr': {
      height: 'var(--row-h)',
      transition: 'background-color 0.1s var(--ease)',
      '&:hover': { backgroundColor: 'var(--bg-row-hover)' },
    },
    '& tr.is-weekend': { backgroundColor: 'rgba(255, 255, 255, 0.015)' },
    '& tr.is-empty td.tl-cell': { paddingTop: '8px' },
    '& .row-actions': {
      display: 'inline-flex',
      gap: '2px',
    },
    '& .row-actions button': {
      opacity: 0,
      transition: 'opacity 0.12s var(--ease)',
    },
    '& tr:hover .row-actions button': { opacity: 1 },
    '& .row-actions button:focus-visible': { opacity: 1 },
  },
  diaNumero: {
    display: 'inline-block',
    minWidth: '20px',
    fontFamily: 'var(--font-display)',
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  diaSemana: {
    display: 'inline',
    marginLeft: '6px',
    fontSize: '12px',
    color: 'var(--text-tertiary)',
  },
  diaNotas: {
    display: 'flex',
    gap: '4px',
    marginTop: '3px',
  },
  horas: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-mono)',
    fontSize: '10.5px',
    fontWeight: 400,
    color: 'var(--text-tertiary)',
  },
  hora: {
    width: 0,
    display: 'flex',
    justifyContent: 'center',
  },
  iconBtn: {
    width: '24px',
    height: '24px',
    padding: 0,
    borderRadius: 'var(--radius)',
    border: '1px solid transparent',
    color: 'var(--text-secondary)',
    '&:hover': { backgroundColor: 'var(--bg-row-hover)', color: 'var(--text-primary)' },
  },
} as const;

/** El primer día del rango arranca despierto; el resto hereda el último estado del día anterior. */
const estadoSuenioDiaAnterior = (dias: AgendaTomiDia[], index: number): TipoEventoSuenio => {
  if (index === 0) return 'Despierto';

  const diaAnterior = dias[index - 1];
  return diaAnterior.eventos[diaAnterior.eventos.length - 1]?.tipo ?? 'Despierto';
};

type Props = {
  dias: AgendaTomiDia[];
  onOpenEditarDia: (dia: AgendaTomiDia) => void;
};

export const TablaDiasSuenio = ({ dias, onOpenEditarDia }: Props) => (
  <TableContainer>
    <Table sx={estilos.tabla}>
      <TableHead sx={estilos.encabezado}>
        <TableRow>
          <TableCell>Día</TableCell>
          <TableCell className="actions" />
          <TableCell className="tl-col">
            <Box sx={estilos.horas}>
              {HORAS.map((hora) => (
                <Box component="span" key={hora} sx={estilos.hora}>
                  {hora}
                </Box>
              ))}
            </Box>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody sx={estilos.cuerpo}>
        {dias.map((dia, index) => {
          const diaDeLaSemana = dia.fecha.getUTCDay();
          const esFinDeSemana = diaDeLaSemana === 0 || diaDeLaSemana === 6;
          const sinRegistro = dia.eventos.length === 0;

          return (
            <TableRow
              key={dia.id}
              className={[esFinDeSemana && 'is-weekend', sinRegistro && 'is-empty'].filter(Boolean).join(' ')}
            >
              <TableCell sx={{ width: '150px', whiteSpace: 'nowrap' }}>
                <Box component="span" sx={estilos.diaNumero}>
                  {dia.fecha.getUTCDate()}
                </Box>
                <Box component="span" sx={estilos.diaSemana}>
                  {dia.fecha.toLocaleDateString('es-ES', { weekday: 'long', timeZone: 'UTC' })}
                </Box>
                {dia.notas && dia.notas.length > 0 && (
                  <Box sx={estilos.diaNotas}>
                    <NotasTooltip notas={dia.notas} />
                  </Box>
                )}
              </TableCell>
              <TableCell className="actions">
                <Box className="row-actions">
                  <IconButton
                    title="Editar día"
                    aria-label="Editar día"
                    onClick={(event) => {
                      // Quitar el foco para que el lápiz no quede visible tras el click:
                      // se revela sólo por hover o por :focus-visible (teclado).
                      event.currentTarget.blur();
                      onOpenEditarDia(dia);
                    }}
                    sx={estilos.iconBtn}
                  >
                    <EditOutlinedIcon sx={{ fontSize: '16px' }} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell className="tl-cell">
                <BarraSuenio data={dia.eventos} estadoSuenioPrevio={estadoSuenioDiaAnterior(dias, index)} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);
