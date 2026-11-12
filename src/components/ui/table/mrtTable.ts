import type { SxProps } from '@mui/system';

/**
 * Helper de grillas MRT — todo lo que hace que `material-react-table` luzca como
 * la tabla del mockup (`.table` de `docs/mockups/assets/app.css`):
 * - superficie = fondo de la propia tabla (page/panel/inset), no `--bg-elevated`;
 * - borde inferior del `thead` = `--border-soft`; de las celdas = `--border-muted`;
 * - alto de fila `--row-h`, hover `--bg-row-hover`, selección `--accent-soft`;
 * - números en mono tabular alineados a la derecha (`MRT_NUMERIC_CELL_SX`).
 *
 * Uso:
 * ```tsx
 * <MaterialReactTable
 *   {...mrtTableProps({ surface: MRT_SURFACE_PAGE })}
 *   muiTableBodyRowProps={({ row }) => ({ sx: {...} })} // se sigue pudiendo extender
 * />
 * ```
 */

export const MRT_SURFACE_PAGE = 'var(--bg-page)';
export const MRT_SURFACE_PANEL = 'var(--bg-panel)';
export const MRT_SURFACE_INSET = 'var(--bg-inset)';

/** Celda numérica: mono tabular alineada a la derecha (`.table td.num`). */
export const MRT_NUMERIC_CELL_SX: SxProps = {
  textAlign: 'right',
  fontFamily: 'var(--font-mono)',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
};

/** Fila de grupo/día (`.row-group`): fondo de panel y hover de fila. */
export const MRT_GROUP_ROW_SX: SxProps = {
  backgroundColor: 'var(--bg-panel)',
  cursor: 'pointer',
  '&:hover': { backgroundColor: 'var(--bg-row-hover)' },
};

interface MrtSurfaceOptions {
  /** Fondo de la tabla. Default `--bg-panel`. */
  surface?: string;
}

const scrollbar = (track: string): SxProps => ({
  // WebKit
  '&::-webkit-scrollbar': { width: '8px', height: '8px' },
  '&::-webkit-scrollbar-track': { backgroundColor: track },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'var(--border-strong)',
    borderRadius: '4px',
    '&:hover': { backgroundColor: 'var(--text-tertiary)' },
  },
  '&::-webkit-scrollbar-corner': { backgroundColor: track },
  // Firefox
  scrollbarWidth: 'thin',
  scrollbarColor: `var(--border-strong) ${track}`,
});

/**
 * Solo estilos de MRT (superficie, cabecera, filas, toolbar). Útil cuando una
 * página necesita conservar sus propias opciones funcionales (paginación,
 * filtros, agrupación…) pero quiere el mismo look que `.table` del mockup.
 */
export const mrtTableStyleProps = ({ surface = MRT_SURFACE_PANEL }: MrtSurfaceOptions = {}) => ({
  muiTableProps: {
    size: 'small' as const,
    sx: {
      '& .MuiTableCell-root': { padding: '8px 12px' },
    },
  },

  muiTablePaperProps: {
    sx: {
      display: 'flex',
      flexDirection: 'column',
      inlineSize: '100%',
      flex: 1,
      overflow: 'auto',
      border: 'none',
      boxShadow: 'none',
      backgroundColor: surface,
      borderRadius: 0,
    } as SxProps,
  },

  muiTableContainerProps: {
    sx: scrollbar(surface),
  },

  muiTableHeadProps: {
    sx: {
      '& .MuiTableCell-root': {
        backgroundColor: surface,
        fontSize: '11.5px',
        fontWeight: 500,
        letterSpacing: '0.02em',
        color: 'var(--text-tertiary)',
        borderBottom: '1px solid var(--border-soft)',
        whiteSpace: 'nowrap',
      },
    } as SxProps,
  },

  muiTableBodyProps: {
    sx: {
      backgroundColor: surface,
      '& .MuiTableRow-root': {
        height: 'var(--row-h)',
        backgroundColor: `${surface} !important`,
        transition: 'background 0.1s var(--ease)',
        '&:hover': { backgroundColor: 'var(--bg-row-hover) !important' },
        '&.Mui-selected': {
          backgroundColor: 'var(--accent-soft) !important',
          boxShadow: 'inset 2px 0 0 var(--accent)',
          '&:hover': { backgroundColor: 'var(--accent-soft) !important' },
        },
      },
      // Fila de grupo (`.row-group`). Necesita más especificidad que la regla
      // base de arriba; las páginas marcan la fila con `className: 'mrt-group-row'`.
      '& .MuiTableRow-root.mrt-group-row': {
        height: '34px',
        backgroundColor: 'var(--bg-panel) !important',
        cursor: 'pointer',
        '&:hover': { backgroundColor: 'var(--bg-row-hover) !important' },
        '& .MuiTableCell-root': { paddingTop: '6px', paddingBottom: '6px' },
      },
      '& .MuiTableCell-root': {
        fontSize: '13.5px',
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-muted)',
      },
      // Acciones de fila (`.table .row-actions .icon-btn`): visibles solo al
      // hover, con la fila seleccionada o al enfocar con teclado.
      '& .row-actions .MuiIconButton-root': {
        opacity: 0,
        transition: 'opacity 0.12s var(--ease)',
      },
      '& .MuiTableRow-root:hover .row-actions .MuiIconButton-root': { opacity: 1 },
      '& .MuiTableRow-root.Mui-selected .row-actions .MuiIconButton-root': { opacity: 1 },
      '& .row-actions .MuiIconButton-root:focus-visible': { opacity: 1 },
    } as SxProps,
  },

  muiTopToolbarProps: {
    sx: {
      backgroundColor: surface,
      minHeight: '56px',
      padding: '12px var(--gutter)',
      borderBottom: '1px solid var(--border-soft)',
    } as SxProps,
  },

  muiBottomToolbarProps: {
    sx: {
      backgroundColor: surface,
      borderTop: '1px solid var(--border-soft)',
    } as SxProps,
  },
});

/**
 * Devuelve los props base de MRT. Pensado para esparcirse y luego sobreescribir
 * lo particular de cada página (toolbar, columnas, `muiTableBodyRowProps`, etc.).
 */
export const mrtTableProps = ({ surface = MRT_SURFACE_PANEL }: MrtSurfaceOptions = {}) => ({
  enableColumnActions: false,
  enableColumnFilters: false,
  enableDensityToggle: false,
  enableFullScreenToggle: false,
  enableHiding: false,
  enableStickyHeader: true,
  ...mrtTableStyleProps({ surface }),
});
