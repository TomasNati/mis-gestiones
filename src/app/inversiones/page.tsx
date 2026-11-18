'use client';

import {
  CotizacionDolar,
  DolarCotizaciones,
  GuardarEstadoInversionesPayload,
  Inversion,
  InversionCreatePayload,
  INSTRUMENTO_MONEDA,
  InstrumentoMoneda,
  TIPO_DOLAR,
  TipoDolar,
} from '@/lib/definitions';
import {
  actualizarInversion,
  crearInversion,
  eliminarInversion,
  getCotizacionesDolar,
  guardarEstadoInversiones,
  obtenerDolarHistorico,
  obtenerFechasHistorialInversiones,
  obtenerPreciosPorFecha,
  obtenerInstrumentos,
  obtenerInversiones,
  obtenerMetaInversiones,
} from '@/lib/api';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { calcularValorInversion, useInversiones } from '@/hooks/inversiones/useInversiones';
import {
  MaterialReactTable,
  MRT_ExpandButton,
  MRT_Row,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
  type MRT_TableInstance,
  type MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table';
import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs, { type Dayjs } from 'dayjs';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import { Box, Checkbox, CircularProgress, MenuItem, TextField } from '@mui/material';
import { ConfirmDeleteModal } from '@/components/comun/ConfirmDeleteModal';
import { ComposicionInversiones } from '@/components/inversiones/ComposicionInversiones';
import { CrearEditarInversion } from '@/components/inversiones/CrearEditarInversion';
import { EditarInversion } from '@/components/inversiones/EditarInversion';
import { EvolucionInversiones } from '@/components/inversiones/EvolucionInversiones';
import type { ResumenHistorialInversiones } from '@/components/inversiones/EvolucionInversiones';
import { FILTROS_INVERSIONES_DEFAULT, InversionesFiltros } from '@/components/inversiones/InversionesFiltros';
import type { FiltrosInversiones } from '@/components/inversiones/InversionesFiltros';
import { styles } from '@/components/inversiones/InversionesGrid.styles';
import { InversionesAlerts } from '@/components/inversiones/InversionesAlerts';
import { InversionesRowActions } from '@/components/inversiones/InversionesRowActions';
import { InversionesCurrencyBar, InversionesTopbarActions } from '@/components/inversiones/InversionesToolbar';
import type { TasasDolar } from '@/components/inversiones/InversionesToolbar';
import { Notificacion, ConfiguracionNotificacion } from '@/components/Notificacion';
import {
  MRT_GROUP_ROW_SX,
  MRT_NUMERIC_CELL_SX,
  MRT_SURFACE_PAGE,
  mrtTableStyleProps,
  PageHeader,
  Pill,
} from '@/components/ui';
import { formatearVariacion } from '@/lib/inversiones/historial';

const FORMATO_DIA = 'YYYY-MM-DD';

/** Normaliza para buscar sin distinguir mayúsculas ni acentos. */
const normalizarTexto = (valor: string) =>
  valor
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/**
 * Tope de ancho de la columna de contenido (Fase 1). Ver
 * `docs/new-theme/plan-rediseno-tema.md`.
 */
const CONTENT_MAX_WIDTH = 1250;

const TIPOS_DOLAR_HISTORICO = ['oficial', 'blue', 'bolsa', 'contadoconliqui'] as const;

/** Opciones del selector de agrupamiento de la grilla. Broker queda por defecto. */
const AGRUPAMIENTOS = [
  { value: 'broker', label: 'Broker' },
  { value: 'tipo', label: 'Tipo' },
  { value: 'renta', label: 'Tipo de renta' },
] as const;

/**
 * Cabecera de grupo de la grilla. Se renderiza dentro de la columna de expandir,
 * que tiene ancho 0: el contenido se posiciona de forma absoluta desde el borde
 * izquierdo (así las filas de detalle no quedan indentadas).
 */
const GrupoHeader = ({ row, table }: { row: MRT_Row<Inversion>; table: MRT_TableInstance<Inversion> }) => {
  if (!row.getIsGrouped()) return null;

  const columnaSeleccion = table.getColumn('mrt-row-select');
  const anchoSeleccion = columnaSeleccion?.getIsVisible() ? columnaSeleccion.getSize() : 0;
  const valor = String(row.groupingValue ?? '');
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          width: anchoSeleccion,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Checkbox
          className="mrt-group-select-all"
          size="small"
          checked={row.getIsAllSubRowsSelected()}
          indeterminate={row.getIsSomeSelected()}
          onChange={(event) => row.toggleSelected(event.target.checked)}
          onClick={(event) => event.stopPropagation()}
          slotProps={{ input: { 'aria-label': 'Seleccionar todo el grupo' } }}
          sx={{ p: '4px' }}
        />
      </Box>
      <MRT_ExpandButton row={row} table={table} size="small" />
      {row.groupingColumnId === 'tipo' ? (
        <Pill outline>{valor}</Pill>
      ) : (
        <Box component="span" sx={styles.grupoTitulo}>
          {valor}
        </Box>
      )}
    </Box>
  );
};

const construirCotizacionesDolar = (cotizaciones: CotizacionDolar[] | undefined): DolarCotizaciones | undefined => {
  const ventas = new Map((cotizaciones ?? []).filter((c) => c.venta > 0).map((c) => [c.tipo, c.venta]));
  const valores = TIPOS_DOLAR_HISTORICO.map((tipo) => ventas.get(tipo));
  if (valores.some((venta) => venta == null)) return undefined;

  const [oficial, blue, bolsa, contadoconliqui] = valores as number[];
  return { oficial, blue, bolsa, contadoconliqui };
};

const InversionesPage = () => {
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [fecha, setFecha] = useState<Dayjs>(() => dayjs());
  const [deleteRow, setDeleteRow] = useState<MRT_Row<Inversion> | null>(null);
  const [moneda, setMoneda] = useState<InstrumentoMoneda>(INSTRUMENTO_MONEDA.PESO);
  const [tipoDolar, setTipoDolar] = useState<TipoDolar>(TIPO_DOLAR.OFICIAL);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  // Controlado desde acá porque el selector de agrupamiento vive fuera de MRT
  // (toolbar propia): sin esto el valor mostrado no seguiría al estado interno.
  const [agrupamiento, setAgrupamiento] = useState<string>('broker');
  const [filtros, setFiltros] = useState<FiltrosInversiones>(() => ({ ...FILTROS_INVERSIONES_DEFAULT }));
  const [resumenHistorial, setResumenHistorial] = useState<ResumenHistorialInversiones | null>(null);
  const [mostrandoGraficos, setMostrandoGraficos] = useState(true);
  const [sobreescribir, setSobreescribir] = useState(false);
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });

  const hoy = useMemo(() => dayjs(), []);
  const diaSeleccionado = fecha.format(FORMATO_DIA);
  const viendoHistorial = diaSeleccionado !== hoy.format(FORMATO_DIA);

  const fechasHistorialQuery = useQuery({
    queryKey: ['fechasHistorialInversiones'],
    queryFn: obtenerFechasHistorialInversiones,
  });

  const diasHabilitados = useMemo(() => {
    const dias = new Set((fechasHistorialQuery.data ?? []).map((f) => f.slice(0, 10)));
    dias.add(hoy.format(FORMATO_DIA));
    return dias;
  }, [fechasHistorialQuery.data, hoy]);

  const esFechaHabilitada = useCallback(
    (dia: Dayjs) => diasHabilitados.has(dia.format(FORMATO_DIA)),
    [diasHabilitados],
  );

  const inversionesQuery = useQuery({
    queryKey: ['inversiones', viendoHistorial ? diaSeleccionado : null],
    queryFn: () => obtenerInversiones(viendoHistorial ? diaSeleccionado : undefined),
  });

  const instrumentosQuery = useQuery({
    queryKey: ['instrumentos'],
    queryFn: obtenerInstrumentos,
  });

  const metaQuery = useQuery({
    queryKey: ['metaInversiones'],
    queryFn: obtenerMetaInversiones,
  });

  const cotizacionesDolarQuery = useQuery({
    queryKey: ['cotizacionesDolar'],
    queryFn: getCotizacionesDolar,
  });

  const dolarHistoricoQuery = useQuery({
    queryKey: ['dolarHistorico', diaSeleccionado],
    queryFn: () => obtenerDolarHistorico(diaSeleccionado),
    enabled: viendoHistorial,
  });

  const preciosDelDiaQuery = useQuery({
    queryKey: ['preciosPorFecha', diaSeleccionado],
    queryFn: () => obtenerPreciosPorFecha(diaSeleccionado),
    enabled: viendoHistorial,
  });

  const preciosHistoricos = useMemo(() => {
    if (!viendoHistorial || !preciosDelDiaQuery.data) return null;
    return new Map(preciosDelDiaQuery.data.map((p) => [p.instrumentoId, p.monto]));
  }, [viendoHistorial, preciosDelDiaQuery.data]);

  const ventaDolar = useMemo(() => {
    if (viendoHistorial) return dolarHistoricoQuery.data?.[tipoDolar] ?? null;
    return cotizacionesDolarQuery.data?.find((c) => c.tipo === tipoDolar)?.venta ?? null;
  }, [viendoHistorial, dolarHistoricoQuery.data, cotizacionesDolarQuery.data, tipoDolar]);

  const sinCotizacionDelDia = viendoHistorial && !dolarHistoricoQuery.isLoading && ventaDolar == null;

  const cotizacionesDolar = useMemo(() => {
    if (viendoHistorial) return dolarHistoricoQuery.data ?? null;
    return construirCotizacionesDolar(cotizacionesDolarQuery.data) ?? null;
  }, [viendoHistorial, dolarHistoricoQuery.data, cotizacionesDolarQuery.data]);

  // Tasas para mostrar en la barra: no dependen de que estén las cuatro
  // cotizaciones (el objeto completo solo se usa para convertir instrumentos).
  const tasasDolar = useMemo<TasasDolar>(() => {
    if (viendoHistorial) {
      const dolar = dolarHistoricoQuery.data;
      return {
        oficial: dolar?.oficial ?? null,
        bolsa: dolar?.bolsa ?? null,
        contadoconliqui: dolar?.contadoconliqui ?? null,
      };
    }
    const porTipo = new Map((cotizacionesDolarQuery.data ?? []).map((c) => [c.tipo, c.venta]));
    return {
      oficial: porTipo.get(TIPO_DOLAR.OFICIAL) ?? null,
      bolsa: porTipo.get(TIPO_DOLAR.BOLSA) ?? null,
      contadoconliqui: porTipo.get(TIPO_DOLAR.CCL) ?? null,
    };
  }, [viendoHistorial, dolarHistoricoQuery.data, cotizacionesDolarQuery.data]);

  const instrumentosSinPrecio = useMemo(() => {
    if (!viendoHistorial || preciosDelDiaQuery.isLoading || !preciosHistoricos) return [];
    const nombres = (inversionesQuery.data ?? [])
      .filter((inv) => !preciosHistoricos.has(inv.instrumento.id))
      .map((inv) => inv.instrumento.nombre);
    return Array.from(new Set(nombres));
  }, [viendoHistorial, preciosDelDiaQuery.isLoading, preciosHistoricos, inversionesQuery.data]);

  const createMutation = useMutation({
    mutationFn: (payload: InversionCreatePayload) => crearInversion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
      handleCloseCreateDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, cantidad }: { id: string; cantidad: number }) => actualizarInversion(id, { cantidad }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
      setConfigNotificacion({
        open: true,
        severity: 'success',
        mensaje: 'Inversión actualizada correctamente.',
      });
    },
    onError: () => {
      setConfigNotificacion({
        open: true,
        severity: 'error',
        mensaje: 'Hubo un error al actualizar la inversión.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eliminarInversion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
    },
  });

  const guardarEstadoMutation = useMutation({
    mutationFn: (payload: GuardarEstadoInversionesPayload) => guardarEstadoInversiones(payload),
    onError: () => {
      setConfigNotificacion({
        open: true,
        severity: 'error',
        mensaje: 'Hubo un error al guardar el estado de las inversiones.',
      });
    },
  });

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const {
    precioPorInstrumento,
    totalValor,
    cantidadSeleccionada,
    totalSeleccionado,
    datosPorBroker,
    datosPorRenta,
    datosPorTipoInstrumento,
  } = useInversiones({
    instrumentos: instrumentosQuery.data,
    inversiones: inversionesQuery.data,
    moneda,
    ventaDolar,
    cotizacionesDolar,
    preciosHistoricos,
    rowSelection,
  });

  const simboloMoneda = moneda === INSTRUMENTO_MONEDA.PESO ? '$' : 'US$';

  const ultimoEstado = useMemo(() => {
    const fechas = (fechasHistorialQuery.data ?? [])
      .map((f) => f.slice(0, 10))
      .filter(Boolean)
      .sort();
    return fechas.length > 0 ? dayjs(fechas[fechas.length - 1]).format('DD/MM/YYYY') : null;
  }, [fechasHistorialQuery.data]);

  const totalCartera =
    totalValor == null ? `${simboloMoneda} —` : `${simboloMoneda} ${transformNumberToCurrenty(totalValor, 0) ?? '-'}`;

  const variacionCartera = useMemo(() => {
    if (!resumenHistorial || resumenHistorial.totalInicial === 0) return null;
    // El total actual es la referencia; si todavía no cargó la cotización,
    // usamos el último Total del histórico para no perder el delta del mockup.
    const totalActual = totalValor ?? resumenHistorial.totalFinal;
    return (totalActual / resumenHistorial.totalInicial - 1) * 100;
  }, [resumenHistorial, totalValor]);

  const columns = useMemo<MRT_ColumnDef<Inversion>[]>(() => {
    const columnas: MRT_ColumnDef<Inversion>[] = [
      {
        accessorFn: (row) => row.instrumento.nombreCorto ?? row.instrumento.nombre,
        id: 'instrumento',
        header: 'Instrumento',
        size: 220,
        enableGrouping: false,
        Cell: ({ row }) => {
          const { instrumento } = row.original;
          const principal = instrumento.nombreCorto ?? instrumento.nombre;
          const secundario = instrumento.nombreCorto ? `${instrumento.nombre} · ${instrumento.tipo}` : instrumento.tipo;
          return (
            <Box>
              <Box component="span" title={instrumento.nombre} sx={styles.instrumentoPrincipal}>
                {principal}
              </Box>
              <Box component="span" sx={styles.instrumentoSecundario}>
                {secundario}
              </Box>
            </Box>
          );
        },
      },
      {
        accessorFn: (row) => row.instrumento.tipo,
        id: 'tipo',
        header: 'Tipo',
        size: 110,
        Cell: ({ cell }) => <Pill outline>{cell.getValue<string>()}</Pill>,
      },
      {
        accessorKey: 'cantidad',
        header: 'Cantidad',
        size: 120,
        enableGrouping: false,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right', sx: MRT_NUMERIC_CELL_SX },
      },
      {
        accessorFn: (row) => row.instrumento.clase_renta,
        id: 'renta',
        header: 'Tipo de Renta',
        size: 110,
      },
      {
        accessorKey: 'broker',
        header: 'Broker',
        size: 130,
      },
      {
        id: 'precio',
        header: 'Precio',
        size: 130,
        enableGrouping: false,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right', sx: MRT_NUMERIC_CELL_SX },
        Cell: ({ row }) => {
          if (sinCotizacionDelDia) return '-';
          const p = precioPorInstrumento.get(row.original.instrumento.id);
          if (p?.loading) return <CircularProgress size={16} />;
          if (!p) return '-';
          return (
            <Box component="span">
              <Box component="span" sx={styles.moneda}>
                {p.simbolo}
              </Box>
              {p.precio}
            </Box>
          );
        },
      },
      {
        id: 'total',
        header: 'Total',
        size: 150,
        enableGrouping: false,
        accessorFn: (row) => {
          if (sinCotizacionDelDia || !ventaDolar) return 0;
          return Math.round(
            calcularValorInversion({
              inversion: row,
              precioPorInstrumento,
              moneda,
              ventaDolar,
              cotizacionesDolar,
            }),
          );
        },
        aggregationFn: 'sum',
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right', sx: MRT_NUMERIC_CELL_SX },
        Cell: ({ row }) => {
          if (sinCotizacionDelDia || !ventaDolar) return '-';
          const p = precioPorInstrumento.get(row.original.instrumento.id);
          if (p?.loading) return <CircularProgress size={16} />;
          const total = transformNumberToCurrenty(
            Math.round(
              calcularValorInversion({
                inversion: row.original,
                precioPorInstrumento,
                moneda,
                ventaDolar,
                cotizacionesDolar,
              }),
            ),
            0,
          );
          return (
            <Box component="span">
              <Box component="span" sx={styles.moneda}>
                {simboloMoneda}
              </Box>
              {total}
            </Box>
          );
        },
        AggregatedCell: ({ cell }) => {
          if (sinCotizacionDelDia || !ventaDolar) return '-';
          return (
            <Box sx={styles.subtotal}>
              subtotal{' '}
              <Box component="span" sx={styles.subtotalValor}>
                {simboloMoneda} {transformNumberToCurrenty(cell.getValue<number>(), 0)}
              </Box>
            </Box>
          );
        },
      },
    ];

    return columnas;
  }, [precioPorInstrumento, sinCotizacionDelDia, moneda, ventaDolar, simboloMoneda, cotizacionesDolar]);

  const openDeleteConfirmModal = (row: MRT_Row<Inversion>) => {
    setDeleteRow(row);
  };

  const handleDeleteConfirm = () => {
    if (deleteRow) {
      deleteMutation.mutate(deleteRow.original.id);
    }
    setDeleteRow(null);
  };

  const handleDeleteCancel = () => {
    setDeleteRow(null);
  };

  const handleEditingRowSave: MRT_TableOptions<Inversion>['onEditingRowSave'] = ({ row, values, exitEditingMode }) => {
    const cantidadIngresada = String(values.cantidad ?? '').trim();
    const cantidad = Number(cantidadIngresada);

    if (cantidadIngresada === '' || !Number.isFinite(cantidad) || cantidad < 0) {
      setConfigNotificacion({
        open: true,
        severity: 'error',
        mensaje: 'La cantidad debe ser un número mayor o igual a 0.',
      });
      return;
    }

    if (cantidad === row.original.cantidad) {
      exitEditingMode();
      return;
    }

    updateMutation.mutate({ id: row.original.id, cantidad }, { onSuccess: () => exitEditingMode() });
  };

  const handleMonedaChanged = (event: React.MouseEvent<HTMLElement>, nuevaMoneda: InstrumentoMoneda | null) => {
    setMoneda(nuevaMoneda || INSTRUMENTO_MONEDA.PESO);
  };

  const handleTipoDolarChanged = (event: React.MouseEvent<HTMLElement>, nuevoTipoDolar: TipoDolar | null) => {
    if (nuevoTipoDolar) setTipoDolar(nuevoTipoDolar);
  };

  const handleSobreescribirChanged = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setSobreescribir(checked);
  };

  const handleFechaChanged = (nuevaFecha: Dayjs | null) => {
    if (!nuevaFecha?.isValid()) return;
    setFecha(nuevaFecha);
    // Las copias del historial tienen ids distintos a los de las inversiones vigentes,
    // así que una selección previa no aplica al nuevo conjunto de filas.
    setRowSelection({});
    setFiltros({ ...FILTROS_INVERSIONES_DEFAULT });
  };

  const handleGuardarEstado = () => {
    const dolar = construirCotizacionesDolar(cotizacionesDolarQuery.data);
    if (!dolar) {
      setConfigNotificacion({
        open: true,
        severity: 'error',
        mensaje: 'No se pudo guardar el estado: faltan las cotizaciones del dólar de hoy.',
      });
      return;
    }

    const inversiones = inversionesQuery.data ?? [];
    const idsValidos: string[] = [];
    const invalidas: Inversion[] = [];

    // An inversión is snapshot-able only when its instrumento has a current precio.
    // There should be none without one, but we guard for it and report the rest.
    for (const inv of inversiones) {
      const precio = precioPorInstrumento.get(inv.instrumento.id);
      if (precio && precio.precio !== '-') idsValidos.push(inv.id);
      else invalidas.push(inv);
    }

    const notificarResultado = (guardadas: number) => {
      if (invalidas.length > 0) {
        const nombres = Array.from(new Set(invalidas.map((inv) => inv.instrumento.nombre))).join(', ');
        setConfigNotificacion({
          open: true,
          severity: 'error',
          mensaje: `No se pudo guardar el estado de: ${nombres}`,
        });
      } else if (guardadas < idsValidos.length) {
        setConfigNotificacion({
          open: true,
          severity: 'info',
          mensaje: `Se guardó el estado de ${guardadas} de ${idsValidos.length} inversiones. Las demás ya tenían estado guardado para esta fecha.`,
        });
      } else {
        setConfigNotificacion({
          open: true,
          severity: 'success',
          mensaje: 'Estado de las inversiones guardado correctamente.',
        });
      }
    };

    if (idsValidos.length === 0) {
      notificarResultado(0);
      return;
    }

    guardarEstadoMutation.mutate(
      {
        inversion_ids: idsValidos,
        fecha: new Date().toISOString(),
        sobreescribir,
        dolar,
      },
      { onSuccess: (copias) => notificarResultado(copias.length) },
    );
  };

  const instrumentos = instrumentosQuery.data ?? [];
  const brokers = metaQuery.data?.brokers ?? [];
  const cantidadInversiones = inversionesQuery.data?.length ?? 0;

  const opcionesFiltros = useMemo(() => {
    const unicos = (valores: (string | null | undefined)[]) =>
      Array.from(new Set(valores.filter((valor): valor is string => Boolean(valor)))).sort((a, b) =>
        a.localeCompare(b, 'es'),
      );
    const inversiones = inversionesQuery.data ?? [];
    return {
      tipo: unicos(inversiones.map((inversion) => inversion.instrumento.tipo)),
      renta: unicos(inversiones.map((inversion) => inversion.instrumento.clase_renta)),
      moneda: unicos(inversiones.map((inversion) => inversion.instrumento.moneda)),
      broker: unicos(inversiones.map((inversion) => inversion.broker)),
    };
  }, [inversionesQuery.data]);

  // Los filtros afectan solo a las filas de la grilla. Los totales, composiciones
  // y gráficos se calculan en `useInversiones` sobre la cartera completa.
  const inversionesFiltradas = useMemo(() => {
    const busqueda = normalizarTexto(filtros.busqueda.trim());
    return (inversionesQuery.data ?? []).filter((inversion) => {
      if (filtros.tipo.length > 0 && !filtros.tipo.includes(inversion.instrumento.tipo)) return false;
      if (filtros.renta.length > 0 && !filtros.renta.includes(inversion.instrumento.clase_renta)) return false;
      if (filtros.moneda.length > 0 && !filtros.moneda.includes(inversion.instrumento.moneda)) return false;
      if (filtros.broker.length > 0 && !filtros.broker.includes(inversion.broker)) return false;
      if (!busqueda) return true;
      return (
        normalizarTexto(inversion.instrumento.nombre).includes(busqueda) ||
        normalizarTexto(inversion.instrumento.codigo ?? '').includes(busqueda)
      );
    });
  }, [inversionesQuery.data, filtros]);

  const cantidadInversionesFiltradas = inversionesFiltradas.length;
  const hayFiltros =
    filtros.tipo.length > 0 ||
    filtros.renta.length > 0 ||
    filtros.moneda.length > 0 ||
    filtros.broker.length > 0 ||
    filtros.busqueda.trim().length > 0;
  const isLoading =
    inversionesQuery.isLoading ||
    instrumentosQuery.isLoading ||
    metaQuery.isLoading ||
    dolarHistoricoQuery.isLoading ||
    preciosDelDiaQuery.isLoading;
  const isSaving = createMutation.isPending || deleteMutation.isPending || updateMutation.isPending;

  // MRT/React Table trae `state.grouping` como dependencia de efectos internos.
  // Si pasamos un array nuevo en cada render, cualquier update (por ejemplo,
  // cambiar un filtro) dispara un ciclo de setState → render → nuevo array →
  // setState. Memoizarlo mantiene la identidad estable entre renders.
  const agrupamientoState = useMemo(() => (agrupamiento ? [agrupamiento] : []), [agrupamiento]);

  const table = useMaterialReactTable({
    ...mrtTableStyleProps({ surface: MRT_SURFACE_PAGE }),
    columns,
    data: inversionesFiltradas,
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
    enableRowActions: !viendoHistorial,
    // Acciones a la derecha, como el mockup (MRT las pone a la izquierda por defecto).
    positionActionsColumn: 'last',
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: '',
        size: 80,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
      },
      'mrt-row-expand': {
        header: '',
        size: 0,
        minSize: 0,
        Cell: ({ row, table }) => <GrupoHeader row={row} table={table} />,
        muiTableHeadCellProps: { sx: { width: 0, minWidth: 0, p: 0 } },
        muiTableBodyCellProps: { sx: { width: 0, minWidth: 0, p: 0, overflow: 'visible', zIndex: 2 } },
      },
    },
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
    // La toolbar propia (agrupar por + filtros) reemplaza la de MRT.
    enableTopToolbar: false,
    enableRowSelection: (row) => !row.getIsGrouped(),
    enableGrouping: true,
    enableExpandAll: false,
    groupedColumnMode: 'remove',
    renderEmptyRowsFallback: () => <Box sx={styles.emptyRows}>No hay inversiones que coincidan con los filtros.</Box>,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderBottomToolbarCustomActions: () => (
      <Box component="span" sx={styles.bottomToolbarSummary}>
        {cantidadInversionesFiltradas} {cantidadInversionesFiltradas === 1 ? 'inversión' : 'inversiones'}
        {hayFiltros && cantidadInversionesFiltradas !== cantidadInversiones ? ` de ${cantidadInversiones}` : ''} ·
        precios al{' '}
        <Box component="span" sx={styles.bottomToolbarNum}>
          {diaSeleccionado}
        </Box>
      </Box>
    ),
    muiBottomToolbarProps: { sx: styles.bottomToolbar },
    initialState: {
      pagination: { pageSize: 50, pageIndex: 0 },
      expanded: true,
    },
    onGroupingChange: (updater) => {
      const siguiente = typeof updater === 'function' ? updater(agrupamientoState) : updater;
      setAgrupamiento(siguiente[0] ?? '');
    },
    muiPaginationProps: {
      rowsPerPageOptions: [10, 25, 50, 100],
      showFirstButton: false,
      showLastButton: false,
      SelectProps: {
        sx: styles.pageSizeSelect,
        MenuProps: {
          disableScrollLock: true,
          sx: styles.pageSizeMenu,
        },
      },
    },
    state: {
      isLoading,
      isSaving,
      rowSelection,
      grouping: agrupamientoState,
    },
    muiTableBodyRowProps: ({ row }) => {
      if (row.getIsGrouped()) {
        return {
          className: 'mrt-group-row',
          onClick: (event) => {
            if ((event.target as HTMLElement).closest('button, input, a')) return;
            row.toggleExpanded();
          },
          sx: MRT_GROUP_ROW_SX,
        };
      }
      return {};
    },
    renderRowActions: ({ row, table }) => (
      <InversionesRowActions row={row} table={table} onDelete={openDeleteConfirmModal} />
    ),
    renderEditRowDialogContent: ({ row, table }) => <EditarInversion row={row} table={table} />,
    onEditingRowSave: handleEditingRowSave,
    localization: {
      cancel: 'Cancelar',
      save: 'Guardar',
      rowsPerPage: 'Por página',
    },
    muiCircularProgressProps: {
      color: 'secondary',
      thickness: 5,
      size: 55,
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // TODO(rediseño-tema, Fase 10): `styles.main` (Layout) todavía trae `p: 3`.
        // Este margen lo cancela para que el frame vaya de borde a borde
        // (`.page` del mockup). Al quitar el padding de `main`, borrar el margen.
        m: -3,
        maxWidth: CONTENT_MAX_WIDTH,
      }}
    >
      <PageHeader
        crumbs={[{ label: 'Inversiones' }]}
        actions={
          <InversionesTopbarActions
            fecha={fecha}
            maxFecha={hoy}
            viendoHistorial={viendoHistorial}
            guardandoEstado={guardarEstadoMutation.isPending}
            sobreescribir={sobreescribir}
            mostrandoGraficos={mostrandoGraficos}
            esFechaHabilitada={esFechaHabilitada}
            onFechaChange={handleFechaChanged}
            onNuevaInversion={() => setCreateDialogOpen(true)}
            onGuardarEstado={handleGuardarEstado}
            onSobreescribirChange={handleSobreescribirChanged}
            onToggleGraficos={() => setMostrandoGraficos((v) => !v)}
          />
        }
      />

      <InversionesAlerts
        errorCarga={inversionesQuery.isError}
        sinCotizacionDelDia={sinCotizacionDelDia}
        diaSeleccionado={fecha.format('DD/MM/YYYY')}
        instrumentosSinPrecio={instrumentosSinPrecio}
        viendoHistorial={viendoHistorial}
        onVolverAHoy={() => handleFechaChanged(hoy)}
      />

      <InversionesCurrencyBar
        moneda={moneda}
        tipoDolar={tipoDolar}
        tasas={tasasDolar}
        ultimoEstado={ultimoEstado}
        onMonedaChange={handleMonedaChanged}
        onTipoDolarChange={handleTipoDolarChanged}
      />

      <Box
        sx={{
          display: mostrandoGraficos ? 'block' : 'none',
          flexShrink: 0,
          p: mostrandoGraficos ? '16px var(--gutter) 20px' : 0,
          borderBottom: mostrandoGraficos ? '1px solid var(--border-soft)' : 0,
          overflow: 'auto',
          containerType: 'inline-size',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
            alignItems: 'stretch',
            gap: '16px',
            '@container (max-width: 1060px)': {
              gridTemplateColumns: 'minmax(0, 1fr)',
            },
          }}
        >
          <EvolucionInversiones
            maxFecha={hoy}
            moneda={moneda}
            tipoDolar={tipoDolar}
            filtros={filtros}
            onResumenHistorial={setResumenHistorial}
          />
          <ComposicionInversiones
            datosPorTipo={datosPorTipoInstrumento}
            datosPorRenta={datosPorRenta}
            datosPorBroker={datosPorBroker}
            totalValor={totalValor}
            simbolo={simboloMoneda}
          />
        </Box>
      </Box>

      <Box sx={styles.gridToolbar}>
        <Box sx={styles.totalCarteraInline} title="Variación contra el primer Total del histórico consultado">
          <Box component="span" sx={styles.totalCarteraLabel}>
            Total cartera
          </Box>
          <Box component="span" sx={styles.totalCarteraValue}>
            {totalCartera}
          </Box>
          {resumenHistorial && variacionCartera != null && (
            <Box
              component="span"
              sx={variacionCartera >= 0 ? styles.totalCarteraDeltaUp : styles.totalCarteraDeltaDown}
            >
              {variacionCartera >= 0 ? (
                <NorthEastIcon sx={{ fontSize: 14 }} />
              ) : (
                <SouthEastIcon sx={{ fontSize: 14 }} />
              )}
              {`${formatearVariacion(variacionCartera)} vs. primer Total del histórico (${resumenHistorial.fechaInicial})`}
            </Box>
          )}
        </Box>
        <TextField
          select
          size="small"
          label="Agrupar por"
          value={agrupamiento}
          onChange={(event) => setAgrupamiento(event.target.value)}
          sx={styles.groupByField}
        >
          {AGRUPAMIENTOS.map((opcion) => (
            <MenuItem key={opcion.value} value={opcion.value} sx={styles.groupByMenuItem}>
              {opcion.label}
            </MenuItem>
          ))}
          <MenuItem value="" sx={styles.groupByMenuItem}>
            Sin agrupar
          </MenuItem>
        </TextField>
        {cantidadSeleccionada > 0 && (
          <Box component="span" sx={styles.selectionChip}>
            <Box component="strong" sx={styles.selectionChipCount}>
              {cantidadSeleccionada}
            </Box>
            {`${cantidadSeleccionada === 1 ? 'seleccionada' : 'seleccionadas'} ·`}
            <Box component="span" sx={styles.selectionChipSum}>
              {totalSeleccionado == null
                ? '—'
                : `${simboloMoneda} ${transformNumberToCurrenty(totalSeleccionado, 0) ?? '-'}`}
            </Box>
          </Box>
        )}
      </Box>

      <InversionesFiltros filtros={filtros} opciones={opcionesFiltros} onFiltrosChange={setFiltros} />

      <Box
        sx={{
          display: 'flex',
          '& .mrt-group-row .MuiCheckbox-root:not(.mrt-group-select-all)': { display: 'none' },
        }}
      >
        <MaterialReactTable table={table} />
      </Box>
      <CrearEditarInversion
        key={String(createDialogOpen)}
        createDialogOpen={createDialogOpen}
        handleCloseCreateDialog={handleCloseCreateDialog}
        instrumentos={instrumentos}
        brokers={brokers}
        isPending={createMutation.isPending}
        handleCreate={(nuevoInstrumento) => createMutation.mutate(nuevoInstrumento)}
      />
      <ConfirmDeleteModal
        open={deleteRow !== null}
        description={` la inversión en ${deleteRow?.original.instrumento.nombre ?? ''}`}
        handleDelete={handleDeleteConfirm}
        handleCancel={handleDeleteCancel}
      />
      <Notificacion configuracionProp={configNotificacion} />
    </Box>
  );
};

export default InversionesPage;
