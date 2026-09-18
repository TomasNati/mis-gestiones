import {
  CategoriaUIMovimiento,
  MovimientoGastoGrilla,
  ResultadoAPI,
  GrupoMovimiento,
  TipoDeMovimientoGasto,
  months,
} from '@/lib/definitions';
import { mapearSubcategoriasATiposDeConceptoExcel, transformNumberToCurrenty } from '@/lib/helpers';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ExpandButton,
  type MRT_ColumnDef,
  type MRT_ExpandedState,
  type MRT_GroupingState,
  type MRT_Row,
  MRT_ToolbarAlertBanner,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { eliminarMovimientos } from '@/lib/orm/actions';
import { obtenerCategoriasDeMovimientos } from '@/lib/orm/data';
import { EntidadNombre } from '@/components/comun/EntidadNombre';
import { TextWithCopy } from '@/components/comun/TextWithCopy';
import { TipoDePagoVista } from '../editores/TipoDePago/TipoDePago';
import { GrupoModal } from '../editores/GrupoModal/GrupoModal';
import { FilaMovimientoPanel } from './FilaMovimientoPanel';
import { styles } from './MovimientosDelMesGrillaMRT.styles';
import { MovimientoFila } from './MovimientosDelMesGrillaMRT.types';

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

const expandirDias = (movimientos: MovimientoGastoGrilla[]): Record<string, boolean> => {
  const dias = movimientos
    .map((m) => new Date(m.fecha).getUTCDate())
    .filter((dia, index, arr) => arr.indexOf(dia) === index);
  return Object.fromEntries(dias.map((dia) => [`dia:${dia}`, true] as [string, boolean]));
};

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
  const [expanded, setExpanded] = useState<MRT_ExpandedState>(() => expandirDias(movimientos));
  const [openAgregarGrupo, setOpenAgregarGrupo] = useState(false);
  const [categoriasMovimiento, setCategoriasMovimiento] = useState<CategoriaUIMovimiento[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [filas, setFilas] = useState<MovimientoFila[]>(() =>
    movimientos.map((m) => ({ ...m, dia: new Date(m.fecha).getUTCDate() })),
  );
  const [prevMovimientos, setPrevMovimientos] = useState<MovimientoGastoGrilla[]>(movimientos);

  if (movimientos !== prevMovimientos) {
    setPrevMovimientos(movimientos);
    setFilas(movimientos.map((m) => ({ ...m, dia: new Date(m.fecha).getUTCDate() })));
    setExpanded(expandirDias(movimientos));
    setEditandoId(null);
  }

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

  const data = useMemo<MovimientoFila[]>(
    () =>
      filas.map((m) => ({
        ...m,
        dia: new Date(m.fecha).getUTCDate(),
      })),
    [filas],
  );

  const monthName = months[mes] || '';

  const abrirPanel = (row: MRT_Row<MovimientoFila>) => {
    setExpanded((prev) => {
      const next = typeof prev === 'boolean' ? {} : { ...prev };
      if (editandoId && editandoId !== row.id) {
        delete next[editandoId];
      }
      next[row.id] = true;
      return next;
    });
    setEditandoId(row.id);
  };

  const cerrarPanel = () => {
    if (!editandoId) {
      return;
    }
    const id = editandoId;
    setEditandoId(null);
    setExpanded((prev) => {
      if (typeof prev === 'boolean') {
        return prev;
      }
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setFilas((prev) => prev.filter((fila) => !(fila.id === id && fila.isNew)));
  };

  const handleGuardar = async (nuevoMovimiento: MovimientoGastoGrilla) => {
    const esNuevo = !!nuevoMovimiento.isNew;
    const idTemporal = nuevoMovimiento.id;
    const movimientoGuardado = await onMovimientoActualizado(nuevoMovimiento);
    const filaGuardada = {
      ...movimientoGuardado,
      isNew: false,
      dia: new Date(movimientoGuardado.fecha).getUTCDate(),
    } as MovimientoFila;
    setFilas((prev) =>
      prev.map((fila) => (fila.id === (esNuevo ? idTemporal : filaGuardada.id) ? filaGuardada : fila)),
    );
    setExpanded((prev) => {
      const next = typeof prev === 'boolean' ? {} : { ...prev };
      next[`dia:${filaGuardada.dia}`] = true;
      return next;
    });
    cerrarPanel();
  };

  const handleAgregar = () => {
    const hoy = new Date();
    const diaNuevo = hoy.getFullYear() === anio && hoy.getMonth() === mes ? hoy.getDate() : 1;
    const idTemporal = `nuevo-${Date.now()}`;
    const filaNueva = {
      id: idTemporal,
      isNew: true,
      fecha: new Date(anio, mes, diaNuevo),
      dia: diaNuevo,
      categoria: { nombre: '', active: true },
      concepto: {
        id: '',
        nombre: '',
        active: true,
        categoriaNombre: '',
        categoriaActive: true,
        categoriaId: '',
        subcategoriaId: '',
      },
      tipoDeGasto: TipoDeMovimientoGasto.Efectivo,
      monto: 0,
      comentarios: '',
    } as MovimientoFila;
    setFilas((prev) => [filaNueva, ...prev.filter((fila) => !(editandoId && fila.id === editandoId && fila.isNew))]);
    setExpanded((prev) => {
      const next = typeof prev === 'boolean' ? {} : { ...prev };
      if (editandoId) {
        delete next[editandoId];
      }
      next[idTemporal] = true;
      next[`dia:${diaNuevo}`] = true;
      return next;
    });
    setEditandoId(idTemporal);
  };

  const toggleExpandirDias = () => {
    const groupIds = table
      .getRowModel()
      .rows.filter((row) => row.getIsGrouped())
      .map((row) => row.id);
    const exp = typeof expanded === 'boolean' ? {} : expanded;
    const hayDiasColapsados = groupIds.some((id) => !exp[id]);
    setExpanded((prev) => {
      const next = typeof prev === 'boolean' ? {} : { ...prev };
      if (hayDiasColapsados) {
        groupIds.forEach((id) => {
          next[id] = true;
        });
      } else {
        if (editandoId) {
          delete next[editandoId];
        }
        groupIds.forEach((id) => {
          delete next[id];
        });
      }
      return next;
    });
    if (!hayDiasColapsados && editandoId) {
      setEditandoId(null);
    }
  };

  const columns = useMemo<MRT_ColumnDef<MovimientoFila>[]>(
    () => [
      {
        accessorKey: 'dia',
        header: 'Fecha',
        size: 100,
        enableHiding: false,
      },
      {
        accessorKey: 'tipoDeGasto',
        header: 'Tipo de pago',
        size: 100,
        Cell: ({ cell }) => <TipoDePagoVista tipoDePago={cell.getValue() as any} />,
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
        size: 250,
        Cell: ({ row }) => (
          <Box>
            <EntidadNombre nombre={row.original.concepto?.nombre} active={row.original.concepto?.active} />
            {row.original.comentarios ? (
              <Box sx={{ display: 'block' }}>
                <TextWithCopy
                  displayText={row.original.comentarios}
                  copyButtonAlignment="right"
                  displaySx={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.4 }}
                />
              </Box>
            ) : null}
          </Box>
        ),
      },
      {
        accessorFn: (row) => transformNumberToCurrenty(row.monto, 0) || '',
        id: 'monto',
        header: 'Monto',
        size: 150,
        muiTableHeadCellProps: {
          align: 'right',
        },
        Cell: ({ row, cell }) => (
          <Box sx={{ textAlign: 'right' }}>
            <TextWithCopy
              displayText={cell.getValue<string>()}
              copyText={row.original.monto?.toString()}
              copyButtonAlignment="right"
              displaySx={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: 'var(--text-primary)',
              }}
            />
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
        id: 'spacer',
        accessorFn: () => '',
        header: '',
        size: 9999,
        enableHiding: false,
        Cell: () => null,
        enableColumnDragging: false,
        enableColumnOrdering: false,
        enableColumnFilter: false,
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
      const expDias = typeof expanded === 'boolean' ? {} : expanded;
      const diasColapsados = data.some((m) => !expDias[`dia:${m.dia}`]);

      const handleExportCSV = () => {
        const header = ['Categoría', 'Concepto', 'Tipo de pago', 'Monto', 'Detalle'];
        const rows = data
          .filter((row) => !row.isNew)
          .map((row) => {
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
          <Tooltip title={diasColapsados ? 'Expandir todos los días' : 'Contraer todos los días'}>
            <IconButton size="small" color="primary" onClick={toggleExpandirDias}>
              {diasColapsados ? <KeyboardDoubleArrowDownIcon /> : <KeyboardDoubleArrowUpIcon />}
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--border-soft)' }} />
          <Button size="small" color="primary" onClick={handleAgregar} startIcon={<AddIcon />}>
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
    enableRowActions: false,
    renderDetailPanel: ({ row, table }) => {
      if (editandoId !== row.id) {
        return null;
      }
      return (
        <FilaMovimientoPanel
          fila={row.original}
          categoriasMovimiento={categoriasMovimiento}
          anio={anio}
          mes={mes}
          onGuardar={handleGuardar}
          onCancelar={cerrarPanel}
        />
      );
    },
    displayColumnDefOptions: {
      'mrt-row-expand': {
        header: '',
        Cell: ({ row, table, staticRowIndex }) => {
          if (!row.groupingColumnId) {
            return null;
          }
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MRT_ExpandButton row={row} table={table} staticRowIndex={staticRowIndex} />
              <Tooltip title="Fecha">
                <Box component="span">{String(row.groupingValue)}</Box>
              </Tooltip>
              <Box component="span">({row.subRows?.length})</Box>
            </Box>
          );
        },
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
    muiDetailPanelProps: {
      sx: { py: 0 },
    },
    muiTablePaperProps: {
      sx: styles.tablePaper,
      onKeyDown: (event) => {
        if (event.key === 'Escape') {
          cerrarPanel();
        }
      },
    },
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
    muiTableBodyRowProps: ({ row, isDetailPanel }) => {
      if (isDetailPanel) {
        return {};
      }
      if (row.getIsGrouped()) {
        return {
          sx: {
            backgroundColor: 'var(--bg-elevated)',
            '&:hover': { backgroundColor: 'var(--bg-elevated)' },
          },
        };
      }
      const editando = editandoId === row.id;
      return {
        onDoubleClick: (event) => {
          if ((event.target as HTMLElement).closest('button, input, select, textarea, a')) {
            return;
          }
          abrirPanel(row);
        },
        sx: editando ? { display: 'none' } : styles.tableBodyRow,
      };
    },
    muiTopToolbarProps: { sx: styles.topToolbar },
    muiBottomToolbarProps: { sx: styles.bottomToolbar },
    renderBottomToolbar: false,
  });

  return <MaterialReactTable table={table} />;
};

export { MovimientosDelMesGrillaMRT };
