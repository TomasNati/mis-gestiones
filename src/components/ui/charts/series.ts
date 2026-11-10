/**
 * Paleta de series para gráficos (`--series-*` del mockup), validada para
 * daltonismo y contraste sobre `--bg-page` (#0d1117).
 *
 * Regla del sistema: un solo eje, sin un color por serie salvo que sean
 * categorías/dispositivos distintos. Para bandas semánticas usar
 * `--danger` / `--attention` / `--accent` / `--success` (siempre con leyenda).
 */
export const SERIES = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
  'var(--series-6)',
  'var(--series-7)',
  'var(--series-8)',
] as const;

/** Color para series deshabilitadas / sin datos. */
export const SERIES_MUTED = 'var(--series-muted)';

/** Devuelve el color de la serie `index` (cicla si hay más de 8). */
export const seriesColor = (index: number) => SERIES[index % SERIES.length];

/** Colores semánticos para bandas de estado (siempre acompañadas de leyenda). */
export const CHART_TONES = {
  danger: 'var(--danger)',
  attention: 'var(--attention)',
  accent: 'var(--accent)',
  success: 'var(--success)',
  done: 'var(--done)',
} as const;
