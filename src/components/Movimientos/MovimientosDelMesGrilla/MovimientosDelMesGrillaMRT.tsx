import { MovimientoGastoGrilla, ResultadoAPI, GrupoMovimiento, months } from '@/lib/definitions';
import {
  mapearSubcategoriasATiposDeConceptoExcel,
  transformNumberToCurrenty,
} from '@/lib/helpers';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_AggregationFns,
  type MRT_ColumnDef,
  type MRT_ExpandedState,
  type MRT_GroupingState,
  MRT_ToolbarAlertBanner,
} from 'material-react-table';
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { EntidadNombre } from '@/components/comun/EntidadNombre';
import { TipoDePagoVista } from '../editores/TipoDePago/TipoDePago';
import { styles } from './MovimientosDelMesGrillaMRT.styles';


interface MovimientosDelMesGrillaMRTProps {
  movimientos: MovimientoGastoGrilla[];
  mes: number;
  anio: number;
  totalMensualEstimado: number;
  onMovimientoActualizado: (movimiento: MovimientoGastoGrilla) => Promise<MovimientoGastoGrilla>;
  onMovimientosEliminados: (resultado: ResultadoAPI) => void;
  onRefrescarMovimientos: () => void;
  onCrearGrupoMovimientos: (grupoMovimiento: GrupoMovimiento) => void;
}

const MovimientosDelMesGrillaMRT = ({
  movimientos,
  mes,
  anio,
  onRefrescarMovimientos,
}: MovimientosDelMesGrillaMRTProps) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [grouping, setGrouping] = useState<MRT_GroupingState>(['dia']);
  const [expanded, setExpanded] = useState<MRT_ExpandedState>(true);

  const data = useMemo(
    () =>
      movimientos.map((m) => ({
        ...m,
        dia: new Date(m.fecha).getUTCDate(),
      })),
    [movimientos],
  );

  const monthName = months[mes] || '';

  const columns = useMemo<MRT_ColumnDef<(typeof data)[0]>[]>(
    () => [
      {
        accessorKey: 'dia',
        header: 'Fecha',
        size: 100,
        enableHiding: false,
      },
      {
        accessorFn: (row) => row.categoria?.nombre || '-',
        id: 'categoria',
        header: 'Categoría',
        size: 100,
        Cell: ({ row }) => (
          <EntidadNombre nombre={row.original.categoria?.nombre} active={row.original.categoria?.active} />
        ),
      },
      {
        accessorFn: (row) => {
          const [concepto] = mapearSubcategoriasATiposDeConceptoExcel(row.concepto?.subcategoriaId);
          return concepto || row.concepto?.nombre || '-';
        },
        id: 'concepto',
        header: 'Concepto',
        size: 300,
        Cell: ({ row }) => (
          <Box>
            <EntidadNombre nombre={row.original.concepto?.nombre} active={row.original.concepto?.active} />
            {row.original.comentarios ? (
              <Box sx={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.4 }}>
                {row.original.comentarios}
              </Box>
            ) : null}
          </Box>
        ),
      },
      {
        accessorKey: 'tipoDeGasto',
        header: 'Tipo de pago',
        size: 130,
        Cell: ({ cell }) => <TipoDePagoVista tipoDePago={cell.getValue() as any} />,
      },
      {
        accessorFn: (row) => transformNumberToCurrenty(row.monto) || '',
        id: 'monto',
        header: 'Monto',
        size: 150,
        muiTableHeadCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => (
          <Box
            sx={{
              textAlign: 'right',
              fontFamily: "'IBM Plex Mono', monospace",
              color: 'var(--text-primary)',
            }}
          >
            {cell.getValue<string>()}
          </Box>
        ),
        aggregationFn: 'sum',
        aggregatedCellStyle: {
          overflow: 'visible',
          whiteSpace: 'nowrap',
          maxWidth: 'none',
        },
        AggregatedCell: ({ table, row }) => {
          const groupedRows = row.subRows?.filter((r) => !r.getIsGrouped?.()) || [];
          const sum = groupedRows.reduce((acc, r) => acc + (r.original?.monto || 0), 0);
          return (
            <Box
              sx={{
                textAlign: 'right',
                fontFamily: "'IBM Plex Mono', monospace",
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                overflow: 'visible',
              }}
            >
              subtotal $ {transformNumberToCurrenty(sum)}
            </Box>
          );
        },
      },
      {
        accessorKey: 'zzz',
        id: 'zzz',
        header: '',
        size: 9999,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enablePinning: false,
        enableResizing: false,
        enableColumnActions: false,
        enableClickToCopy: false,
        enableGlobalFilter: false,
        enableEditing: false,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: false,
    enableSorting: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableGrouping: true,
    groupedColumnMode: 'remove',
    positionToolbarAlertBanner: 'none',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        {table.getState().grouping.length > 0 && <MRT_ToolbarAlertBanner table={table} />}
      </Box>
    ),
    enableExpanding: true,
    enableExpandAll: false,
    onExpandedChange: setExpanded,
    displayColumnDefOptions: {
      'mrt-row-expand': {
        header: '',
      },
    },
    getRowId: (row) => row.id,
    enableRowSelection: (row) => !row.getIsGrouped(),
    onRowSelectionChange: setRowSelection,
    initialState: {
      density: 'compact',
    },
    state: {
      rowSelection,
      grouping,
      expanded,
    },
    onGroupingChange: setGrouping,
    muiTablePaperProps: { sx: styles.tablePaper },
    muiTableContainerProps: { sx: styles.tableContainer },
    muiTableHeadProps: { sx: styles.tableHead },
    muiTableBodyProps: { sx: styles.tableBody },
    muiTableBodyRowProps: ({ row }) => ({
      sx: row.getIsGrouped()
        ? {
            backgroundColor: 'var(--bg-elevated)',
            '&:hover': { backgroundColor: 'var(--bg-elevated)' },
          }
        : styles.tableBodyRow,
    }),
    muiTopToolbarProps: { sx: styles.topToolbar },
    muiBottomToolbarProps: { sx: styles.bottomToolbar },
    renderBottomToolbarCustomActions: ({ table }) => {
      const selectedRowIds = Object.keys(rowSelection);
      const selectedMovimientos = data.filter((m) => selectedRowIds.includes(m.id));
      const sumaParcial = selectedMovimientos.reduce((acc, m) => acc + (m.monto || 0), 0);
      const sumaFormateada = transformNumberToCurrenty(sumaParcial, 0);

      const handleExportCSV = () => {
        const header = ['Categoría', 'Concepto', 'Tipo de pago', 'Monto', 'Detalle'];
        const rows = data.map((row) => {
          const [concepto] = mapearSubcategoriasATiposDeConceptoExcel(row.concepto?.subcategoriaId);
          return [
            row.categoria?.nombre || '',
            concepto || row.concepto?.nombre || '',
            row.tipoDeGasto || '',
            row.monto?.toString() || '',
            row.comentarios || '',
          ];
        });
        const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `movimientos-${monthName}-${anio}.csv`);
        link.click();
        URL.revokeObjectURL(url);
      };

      return (
        <Box sx={styles.toolbar}>
          <Button size="small" color="primary" startIcon={<AddIcon />} disabled>
            Agregar
          </Button>
          <Button size="small" color="primary" startIcon={<LibraryAddIcon />} disabled>
            Agregar grupo
          </Button>
          <Button size="small" color="primary" onClick={onRefrescarMovimientos} startIcon={<RefreshIcon />}>
            Refrescar
          </Button>
          <Button size="small" color="primary" startIcon={<DeleteIcon />} disabled>
            Eliminar
          </Button>
          <Box sx={styles.toolBtn}>
            <Button size="small" color="primary" onClick={handleExportCSV} startIcon={<FileDownloadIcon />}>
              Exportar
            </Button>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--border-soft)' }} />
          <Box sx={styles.sumaLabel}>
            Suma parcial:
            <Box component="span" className="num" sx={styles.sumaValue}>
              {sumaFormateada}
            </Box>
          </Box>
          <Box sx={styles.spacer} />
        </Box>
      );
    },
    renderBottomToolbar: false,
  });

  return <MaterialReactTable table={table} />;
};

export { MovimientosDelMesGrillaMRT };
