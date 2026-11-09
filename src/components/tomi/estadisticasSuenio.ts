import { AgendaTomiDia } from '@/lib/definitions';
import { obtenerMinutosDeSuenio, timeStringToMinutes } from '@/lib/helpers';

const MINUTOS_POR_DIA = 24 * 60;
const MEDIODIA = 12 * 60;

/** Orden de la leyenda/badges del mockup. Los tipos desconocidos van al final. */
const ORDEN_TIPOS_NOTA = ['General', 'Orina', 'Cambio de medicación', 'Crisis', 'Malhumor'];

export interface NotaPorTipo {
  tipo: string;
  count: number;
}

export interface StatsSuenio {
  promedioMinutos: number | null;
  horaDormirPromedio: number | null;
  horaDespertarPromedio: number | null;
  totalNotas: number;
  notasPorTipo: NotaPorTipo[];
}

const promedio = (valores: number[]): number | null =>
  valores.length ? Math.round(valores.reduce((acc, valor) => acc + valor, 0) / valores.length) : null;

/** Corre las horas posteriores a medianoche al día siguiente para poder promediar 23:xx con 00:xx. */
const aMinutosDeNoche = (minutos: number) => (minutos < MEDIODIA ? minutos + MINUTOS_POR_DIA : minutos);

const horaDeDormir = (dia: AgendaTomiDia): number | null => {
  const evento = dia.eventos.find((e) => e.tipo === 'Dormido');
  return evento ? timeStringToMinutes(evento.hora) : null;
};

const horaDeDespertar = (dia: AgendaTomiDia): number | null => {
  const evento = [...dia.eventos].reverse().find((e) => e.tipo === 'Despierto');
  return evento ? timeStringToMinutes(evento.hora) : null;
};

/**
 * Estadísticas de la tira de `/tomi` para el mes seleccionado (mockup `tomi.html`):
 * sueño nocturno promedio, hora promedio de dormir/despertar y notas del mes.
 */
export const calcularStatsSuenio = (dias: AgendaTomiDia[]): StatsSuenio => {
  const promedioMinutos = promedio(dias.map(obtenerMinutosDeSuenio).filter((minutos) => minutos > 0));

  const minutosDormir = dias
    .map(horaDeDormir)
    .filter((minutos): minutos is number => minutos !== null)
    .map(aMinutosDeNoche);
  const promedioDormir = promedio(minutosDormir);
  const horaDormirPromedio = promedioDormir === null ? null : promedioDormir % MINUTOS_POR_DIA;

  const minutosDespertar = dias
    .map(horaDeDespertar)
    .filter((minutos): minutos is number => minutos !== null);
  const horaDespertarPromedio = promedio(minutosDespertar);

  const notas = dias.flatMap((dia) => dia.notas ?? []);
  const conteoPorTipo = new Map<string, number>();
  notas.forEach((nota) => conteoPorTipo.set(nota.tipo, (conteoPorTipo.get(nota.tipo) ?? 0) + 1));

  const notasPorTipo = Array.from(conteoPorTipo.entries())
    .map(([tipo, count]) => ({ tipo, count }))
    .sort((a, b) => {
      const ordenA = ORDEN_TIPOS_NOTA.indexOf(a.tipo);
      const ordenB = ORDEN_TIPOS_NOTA.indexOf(b.tipo);
      const pesoA = ordenA === -1 ? ORDEN_TIPOS_NOTA.length : ordenA;
      const pesoB = ordenB === -1 ? ORDEN_TIPOS_NOTA.length : ordenB;
      return pesoA - pesoB || a.tipo.localeCompare(b.tipo);
    });

  return {
    promedioMinutos,
    horaDormirPromedio,
    horaDespertarPromedio,
    totalNotas: notas.length,
    notasPorTipo,
  };
};

/** Duración en el formato del mockup: `9 h 28 m`, `9 h`, `45 m` (o `—` sin datos). */
export const formatDuracion = (minutos: number | null): string => {
  if (minutos === null) return '—';
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas && resto) return `${horas} h ${String(resto).padStart(2, '0')} m`;
  if (horas) return `${horas} h`;
  return `${resto} m`;
};

/** Hora `HH:MM` (o `—` sin datos). */
export const formatHora = (minutos: number | null): string => {
  if (minutos === null) return '—';
  const horas = Math.floor(minutos / 60) % 24;
  const resto = minutos % 60;
  return `${String(horas).padStart(2, '0')}:${String(resto).padStart(2, '0')}`;
};
