import { CategoriaUIMovimiento, MovimientoGastoGrilla, ResultadoAPI, GrupoMovimiento, months } from '@/lib/definitions';
import { mapearSubcategoriasATiposDeConceptoExcel, transformNumberToCurrenty } from '@/lib/helpers';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ExpandAllButton,
  type MRT_ColumnDef,
  type MRT_ExpandedState,
  type MRT_GroupingState,
  MRT_ToolbarAlertBanner,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { eliminarMovimientos } from '@/lib/orm/actions';
import { obtenerCategoriasDeMovimientos } from '@/lib/orm/data';
import { EntidadNombre } from '@/components/comun/EntidadNombre';
import { TipoDePagoVista } from '../editores/TipoDePago/TipoDePago';
import { GrupoModal } from '../editores/GrupoModal/GrupoModal';
import { styles } from './MovimientosDelMesGrillaMRT.styles';

interface MovimientosDelMesGrillaMRTProps {
  movimientos: MovimientoGastoGrilla[];
  mes: number;
  anio: number;
  totalMensualEstimado: number;
  leftSeparator?: boolean;
  isLoading?: boolean;
  onMovimientoActualizado: (movimiento: MovimientoGastoGrilla) => Promise<MovimientoGastoGrilla>;
  onMovimientosEliminados: (resultado: ResultadoAPI) => void;
  onRefrescarMovimientos: () => void;
  onCrearGrupoMovimientos: (grupoMovimiento: GrupoMovimiento) => void;
}

const MovimientosDelMesGrillaMRT = ({
  movimientos,
  mes,
  anio,
  leftSeparator = false,
  isLoading = false,
  onMovimientoActualizado,
  onMovimientosEliminados,
  onRefrescarMovimientos,
  onCrearGrupoMovimientos,
}: MovimientosDelMesGrillaMRTProps) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [grouping, setGrouping] = useState<MRT_GroupingState>(['dia']);
  const [expanded, setExpanded] = useState<MRT_ExpandedState>(true);
  const [openAgregarGrupo, setOpenAgregarGrupo] = useState(false);
  const [categoriasMovimiento, setCategoriasMovimiento] = useState<CategoriaUIMovimiento[]>([]);

  useEffect(() => {
    const fetchConceptos = async () => {
      const categorias = await obtenerCategoriasDeMovimientos();
      categorias.sort((a, b) => {
        if (a.categoriaNombre < b.categoriaNombre) {
          return -1;
        }
        if (a.categoriaNombre > b.categoriaNombre) {
          return 1;
        }
        return 0;
      });
      setCategoriasMovimiento(categorias);
    };
    fetchConceptos();
  }, []);

  const handleAgregarGrupoOpen = () => {
    setOpenAgregarGrupo(true);
  };

  const handleAgregarGrupoClose = () => {
    setOpenAgregarGrupo(false);
  };

  const handleEliminarMovimientos = async () => {
    const movimientosAEliminar = Object.keys(rowSelection);
    if (movimientosAEliminar.length === 0) {
      return;
    }
    const resultadoEliminacion = await eliminarMovimientos(movimientosAEliminar);
    if (resultadoEliminacion.exitoso) {
      setRowSelection({});
      onRefrescarMovimientos();
    }
    onMovimientosEliminados(resultadoEliminacion);
  };

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
        accessorFn: (row) => transformNumberToCurrenty(row.monto, 0) || '',
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
              subtotal $ {transformNumberToCurrenty(sum, 0)}
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
    renderToolbarAlertBannerContent: ({ groupedAlert, selectedAlert }) => (
      <>
        {groupedAlert}
        {selectedAlert && <Box sx={{ display: 'flex' }}>{selectedAlert}</Box>}
      </>
    ),
    renderTopToolbarCustomActions: () => {
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
          <GrupoModal
            open={openAgregarGrupo}
            onClose={handleAgregarGrupoClose}
            anio={anio}
            mes={mes}
            categoriasMovimiento={categoriasMovimiento}
            onGuardar={onCrearGrupoMovimientos}
          />
          <MRT_ToolbarAlertBanner table={table} sx={styles.toolbarAlertBanner} />
          {leftSeparator && <Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--border-soft)' }} />}
          <MRT_ExpandAllButton table={table} color="primary" />
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--border-soft)' }} />
          <Button size="small" color="primary" startIcon={<AddIcon />} disabled>
            Agregar
          </Button>
          <Button size="small" color="primary" onClick={handleAgregarGrupoOpen} startIcon={<LibraryAddIcon />}>
            Agregar grupo
          </Button>
          <Button size="small" color="primary" onClick={onRefrescarMovimientos} startIcon={<RefreshIcon />}>
            Refrescar
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={handleEliminarMovimientos}
            startIcon={<DeleteIcon />}
            disabled={Object.keys(rowSelection).length === 0}
          >
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
      isLoading,
    },
    onGroupingChange: setGrouping,
    muiTablePaperProps: { sx: styles.tablePaper },
    muiTableContainerProps: { sx: styles.tableContainer },
    muiCircularProgressProps: {
      color: 'primary',
      thickness: 5,
      size: 55,
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
      sx: styles.skeleton,
    },
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
    renderBottomToolbar: false,
  });

  return <MaterialReactTable table={table} />;
};

export { MovimientosDelMesGrillaMRT };
