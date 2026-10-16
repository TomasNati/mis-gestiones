// Componentes compartidos del sistema de diseño (docs/mockups).
// Agregar cada pieza nueva acá para que las páginas importen desde '@/components/ui'.
//
// TODO(rediseño-tema): todavía no hay tests; la verificación por fase es
// `tsc --noEmit` + lint + revisión visual contra el mockup.

export { StatsCluster } from './StatsCluster';
export type {
  StatsClusterProps,
  StatItem,
  StatDelta,
  StatMeter,
  StatValueTone,
  StatDeltaTone,
  StatMeterTone,
} from './StatsCluster';

export { PageHeader } from './PageHeader';
export type { PageHeaderProps, Breadcrumb } from './PageHeader';

export { MonthStrip } from './MonthStrip';
export type { MonthStripProps, MonthStripItem, MonthStripNav } from './MonthStrip';

export { Pill } from './Pill';
export type { PillProps, PillVariant } from './Pill';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { SkeletonRows } from './SkeletonRows';
export type { SkeletonRowsProps } from './SkeletonRows';

export {
  mrtTableProps,
  MRT_NUMERIC_CELL_SX,
  MRT_GROUP_ROW_SX,
  MRT_SURFACE_PAGE,
  MRT_SURFACE_PANEL,
  MRT_SURFACE_INSET,
} from './table/mrtTable';

export { SERIES, SERIES_MUTED, seriesColor, CHART_TONES } from './charts/series';
