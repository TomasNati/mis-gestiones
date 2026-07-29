'use client';

import {
  CotizacionDolar,
  DolarCotizaciones,
  GuardarEstadoInversionesPayload,
  Inversion,
  InversionCreatePayload,
  INSTRUMENTO_INVERSION_TIPO,
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
import { useInversiones } from '@/hooks/inversiones/useInversiones';
import {
  MaterialReactTable,
  MRT_Row,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
  type MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table';
import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs, { type Dayjs } from 'dayjs';
import { Alert, Box, CircularProgress, Divider, IconButton } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { ConfirmDeleteModal } from '@/components/comun/ConfirmDeleteModal';
import { CrearEditarInversion } from '@/components/inversiones/CrearEditarInversion';
import { EditarInversion } from '@/components/inversiones/EditarInversion';
import { HistorialInversiones } from '@/components/inversiones/HistorialInversiones';
import { InversionesRowActions } from '@/components/inversiones/InversionesRowActions';
import { InversionesToolbar } from '@/components/inversiones/InversionesToolbar';
import { InversionesPorCategoria } from '@/components/graficos/';
import { Notificacion, ConfiguracionNotificacion } from '@/components/Notificacion';

const FORMATO_DIA = 'YYYY-MM-DD';

const TIPOS_DOLAR_HISTORICO = ['oficial', 'blue', 'bolsa', 'contadoconliqui'] as const;

// The top section splits into three equal columns, collapsing to fewer when the
// viewport can't fit 300px per column.
const COLUMNA_SUPERIOR = { flex: '1 1 300px', display: 'flex', justifyContent: 'center' } as const;
const COLUMNA_HISTORIAL = { ...COLUMNA_SUPERIOR, justifyContent: 'flex-start' } as const;

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
  const [mostrandoGraficos, setMostrandoGraficos] = useState(false);
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

  const { precioPorInstrumento, totalDisplay, datosPorBroker, datosPorRenta } = useInversiones({
    instrumentos: instrumentosQuery.data,
    inversiones: inversionesQuery.data,
    moneda,
    ventaDolar,
    preciosHistoricos,
    rowSelection,
  });

  const simboloMoneda = moneda === INSTRUMENTO_MONEDA.PESO ? '$' : 'US$';

  const columns = useMemo<MRT_ColumnDef<Inversion>[]>(
    () => [
      {
        accessorFn: (row) => {
          if (row.instrumento.tipo === INSTRUMENTO_INVERSION_TIPO.CEDEAR) {
            return <span title={row.instrumento.nombre}>{row.instrumento.codigo}</span>;
          }
          return row.instrumento.nombre;
        },
        id: 'instrumento',
        header: 'Instrumento',
        size: 200,
      },
      {
        accessorFn: (row) => row.instrumento.tipo,
        id: 'tipo',
        header: 'Tipo',
        size: 100,
      },
      {
        accessorKey: 'cantidad',
        header: 'Cantidad',
        size: 150,
      },
      {
        accessorFn: (row) => row.instrumento.clase_renta,
        id: 'renta',
        header: 'Tipo de Renta',
        size: 130,
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
        Cell: ({ row }) => {
          if (sinCotizacionDelDia) return '-';
          const p = precioPorInstrumento.get(row.original.instrumento.id);
          if (p?.loading) return <CircularProgress size={16} />;
          return p ? `${p.simbolo} ${p.precio}` : '-';
        },
      },
      {
        id: 'total',
        header: 'Total',
        size: 130,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }) => {
          if (sinCotizacionDelDia) return '-';
          const p = precioPorInstrumento.get(row.original.instrumento.id);
          if (p?.loading) return <CircularProgress size={16} />;
          const total = transformNumberToCurrenty(row.original.cantidad * (p?.monto || 0));
          return `${p?.simbolo ?? ''} ${total?.replace(',00', '')}`;
        },
      },
    ],
    [precioPorInstrumento, sinCotizacionDelDia],
  );

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
  const isLoading =
    inversionesQuery.isLoading ||
    instrumentosQuery.isLoading ||
    metaQuery.isLoading ||
    dolarHistoricoQuery.isLoading ||
    preciosDelDiaQuery.isLoading;
  const isSaving = createMutation.isPending || deleteMutation.isPending || updateMutation.isPending;

  const table = useMaterialReactTable({
    columns,
    data: inversionesQuery.data ?? [],
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
    enableRowActions: !viendoHistorial,
    displayColumnDefOptions: {
      'mrt-row-actions': {
        size: 100,
      },
    },
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableRowSelection: true,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    initialState: {
      pagination: { pageSize: 50, pageIndex: 0 },
    },
    muiPaginationProps: {
      rowsPerPageOptions: [10, 25, 50, 100],
    },
    state: {
      isLoading,
      isSaving,
      rowSelection,
    },
    muiTableProps: {
      size: 'small',
    },
    layoutMode: 'grid-no-grow',
    renderRowActions: ({ row, table }) => (
      <InversionesRowActions row={row} table={table} onDelete={openDeleteConfirmModal} />
    ),
    renderEditRowDialogContent: ({ row, table }) => <EditarInversion row={row} table={table} />,
    onEditingRowSave: handleEditingRowSave,
    localization: {
      cancel: 'Cancelar',
      save: 'Guardar',
    },
    renderTopToolbarCustomActions: () => (
      <InversionesToolbar
        moneda={moneda}
        tipoDolar={tipoDolar}
        total={totalDisplay}
        dolarVenta={ventaDolar}
        guardandoEstado={guardarEstadoMutation.isPending}
        sobreescribir={sobreescribir}
        fecha={fecha}
        maxFecha={hoy}
        viendoHistorial={viendoHistorial}
        esFechaHabilitada={esFechaHabilitada}
        onFechaChange={handleFechaChanged}
        onNuevaInversion={() => setCreateDialogOpen(true)}
        onGuardarEstado={handleGuardarEstado}
        onSobreescribirChange={handleSobreescribirChanged}
        onMonedaChange={handleMonedaChanged}
        onTipoDolarChange={handleTipoDolarChanged}
      />
    ),
    muiTablePaperProps: {
      sx: { display: 'flex', flexDirection: 'column', inlineSize: '100%', overflow: 'auto', flex: 1 },
    },
    muiCircularProgressProps: {
      color: 'secondary',
      thickness: 5,
      size: 55,
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, blockSize: '100%', overflow: 'hidden' }}>
      <Box>
        <h2>Inversiones</h2>
      </Box>
      {inversionesQuery.isError && <p>Hubo un error al cargar las inversiones.</p>}
      {sinCotizacionDelDia && (
        <Alert severity="error" sx={{ flexShrink: 0 }}>
          No hay cotización del dólar guardada para el {diaSeleccionado}: no se pueden calcular precios ni totales.
        </Alert>
      )}
      {instrumentosSinPrecio.length > 0 && (
        <Alert severity="warning" sx={{ flexShrink: 0 }}>
          Sin precio guardado para el {diaSeleccionado}: {instrumentosSinPrecio.join(', ')}
        </Alert>
      )}
      <Box
        sx={{
          display: mostrandoGraficos ? 'flex' : 'none',
          flexShrink: 0,
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 3,
          overflow: 'auto',
        }}
      >
        <Box sx={COLUMNA_HISTORIAL}>
          <HistorialInversiones maxFecha={hoy} />
        </Box>
        <Box sx={COLUMNA_SUPERIOR}>
          <InversionesPorCategoria titulo="Total por broker" data={datosPorBroker} simbolo={simboloMoneda} />
        </Box>
        <Box sx={COLUMNA_SUPERIOR}>
          <InversionesPorCategoria titulo="Total por tipo de renta" data={datosPorRenta} simbolo={simboloMoneda} />
        </Box>
      </Box>
      <Divider sx={{ flexShrink: 0 }}>
        <IconButton
          onClick={() => setMostrandoGraficos((v) => !v)}
          aria-label={mostrandoGraficos ? 'Ocultar gráficos' : 'Mostrar gráficos'}
        >
          {mostrandoGraficos ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Divider>
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
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
