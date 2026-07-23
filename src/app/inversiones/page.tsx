'use client';

import {
  Inversion,
  InversionCreatePayload,
  INSTRUMENTO_INVERSION_TIPO,
  INSTRUMENTO_MONEDA,
  InstrumentoPrecio,
  InstrumentoMoneda,
} from '@/lib/definitions';
import {
  crearInversion,
  createPrecio,
  eliminarInversion,
  getCotizacionDolarOficial,
  obtenerInstrumentos,
  obtenerInversiones,
  obtenerMetaInversiones,
} from '@/lib/api';
import { PRECIO_FETCHERS, findTodayPrecio, todayISO } from '@/lib/inversiones/precios';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { MaterialReactTable, MRT_Row, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, CircularProgress } from '@mui/material';
import { ConfirmDeleteModal } from '@/components/comun/ConfirmDeleteModal';
import { CrearEditarInversion } from '@/components/inversiones/CrearEditarInversion';
import { InversionesRowActions } from '@/components/inversiones/InversionesRowActions';
import { InversionesToolbar } from '@/components/inversiones/InversionesToolbar';

const InversionesPage = () => {
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState<MRT_Row<Inversion> | null>(null);
  const [preciosPorInstrumento, setPreciosPorInstrumento] = useState<Map<string, InstrumentoPrecio>>(
    new Map(),
  );
  // Instrumentos whose live-precio fetch finished without a usable value (error or
  // no price returned). Used to stop showing the spinner for them.
  const [precioFetchFailed, setPrecioFetchFailed] = useState<Set<string>>(new Set());
  const [moneda, setMoneda] = useState<InstrumentoMoneda>(INSTRUMENTO_MONEDA.PESO);

  const inversionesQuery = useQuery({
    queryKey: ['inversiones'],
    queryFn: obtenerInversiones,
  });

  const instrumentosQuery = useQuery({
    queryKey: ['instrumentos'],
    queryFn: obtenerInstrumentos,
  });

  const metaQuery = useQuery({
    queryKey: ['metaInversiones'],
    queryFn: obtenerMetaInversiones,
  });

  const cotizacionDolarQuery = useQuery({
    queryKey: ['cotizacionDolarOficial'],
    queryFn: getCotizacionDolarOficial,
  });

  const createMutation = useMutation({
    mutationFn: (payload: InversionCreatePayload) => crearInversion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
      handleCloseCreateDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eliminarInversion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
    },
  });

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  // For each instrumento missing today's precio, fetch the live cotización, persist
  // it as a new Precio record, and merge it into local state. The fetch itself is
  // cached in localStorage (see @/lib/inversiones/precios). Instrumentos that already
  // have today's precio in the DB are resolved directly in the memo below.
  useEffect(() => {
    let cancelled = false;

    const instrumentos = instrumentosQuery.data ?? [];

    for (const ins of instrumentos) {
      if (findTodayPrecio(ins.precios)) continue;
      const fetcher = PRECIO_FETCHERS.find((f) => f.tipos.includes(ins.tipo || ''));
      if (!fetcher) continue;
      fetcher
        .fetchPrecio(ins)
        .then(async (precio) => {
          if (cancelled) return;
          if (precio == null) {
            setPrecioFetchFailed((prev) => new Set(prev).add(ins.id));
            return;
          }
          const created = await createPrecio({
            monto: precio,
            fecha: todayISO(),
            instrumento_id: ins.id,
          });
          if (cancelled) return;
          setPreciosPorInstrumento((prev) => {
            const next = new Map(prev);
            next.set(ins.id, created);
            return next;
          });
        })
        .catch((error) => {
          console.error(`Failed to fetch/create precio for instrumento ${ins.id}:`, error);
          if (!cancelled) setPrecioFetchFailed((prev) => new Set(prev).add(ins.id));
        });
    }

    return () => {
      cancelled = true;
    };
  }, [instrumentosQuery.data]);

  const precioPorInstrumento = useMemo(() => {
    const map = new Map<string, { simbolo: string; precio: string; monto: number; loading: boolean }>();
    const dolares: string[] = [INSTRUMENTO_MONEDA.DOLAR, INSTRUMENTO_MONEDA.DOLAR_CCL];
    instrumentosQuery.data?.forEach((inst) => {
      const precio = preciosPorInstrumento.get(inst.id) ?? findTodayPrecio(inst.precios);
      const simboloMoneda = dolares.includes(inst.moneda) ? 'US$' : '$';
      const monto = precio?.monto ?? 0;
      const hasFetcher = PRECIO_FETCHERS.some((f) => f.tipos.includes(inst.tipo || ''));
      const loading = !precio && hasFetcher && !precioFetchFailed.has(inst.id);
      map.set(inst.id, {
        simbolo: simboloMoneda,
        precio: precio ? transformNumberToCurrenty(monto) || '-' : '-',
        monto,
        loading,
      });
    });
    return map;
  }, [instrumentosQuery.data, preciosPorInstrumento, precioFetchFailed]);

  const totalDisplay = useMemo(() => {
    const dolares: string[] = [INSTRUMENTO_MONEDA.DOLAR, INSTRUMENTO_MONEDA.DOLAR_CCL];
    const ventaDolar = cotizacionDolarQuery.data?.venta ?? null;
    const enPesos = moneda === INSTRUMENTO_MONEDA.PESO;
    const simbolo = enPesos ? '$' : 'US$';

    if (!ventaDolar) return `${simbolo} -`;

    const totalPesos = (inversionesQuery.data ?? []).reduce((acc, inv) => {
      const monto = precioPorInstrumento.get(inv.instrumento.id)?.monto ?? 0;
      const valorNativo = inv.cantidad * monto;
      const esDolar = dolares.includes(inv.instrumento.moneda);
      return acc + (esDolar ? valorNativo * ventaDolar : valorNativo);
    }, 0);

    const valor = enPesos ? totalPesos : totalPesos / ventaDolar;
    return `${simbolo} ${transformNumberToCurrenty(valor) ?? '-'}`;
  }, [inversionesQuery.data, precioPorInstrumento, moneda, cotizacionDolarQuery.data]);

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
        accessorKey: 'broker',
        header: 'Broker',
        size: 130,
      },
      {
        id: 'precio',
        header: 'Precio',
        size: 130,
        Cell: ({ row }) => {
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
          const p = precioPorInstrumento.get(row.original.instrumento.id);
          if (p?.loading) return <CircularProgress size={16} />;
          const total = transformNumberToCurrenty(row.original.cantidad * (p?.monto || 0));
          return `${p?.simbolo ?? ''} ${total?.replace(',00', '')}`;
        },
      },
    ],
    [precioPorInstrumento],
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

   const handleMonedaChanged = (event: React.MouseEvent<HTMLElement>, nuevaMoneda: InstrumentoMoneda | null) => {
     setMoneda(nuevaMoneda || INSTRUMENTO_MONEDA.PESO);
   };

  const instrumentos = instrumentosQuery.data ?? [];
  const brokers = metaQuery.data?.brokers ?? [];
  const isLoading = inversionesQuery.isLoading || instrumentosQuery.isLoading || metaQuery.isLoading;
  const isSaving = createMutation.isPending || deleteMutation.isPending;

  const table = useMaterialReactTable({
    columns,
    data: inversionesQuery.data ?? [],
    enableRowActions: true,
    displayColumnDefOptions: {
      'mrt-row-actions': {
        size: 100,
      },
    },
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
    state: {
      isLoading,
      isSaving,
    },
    muiTableProps: {
      size: 'small',
    },
    layoutMode: 'grid-no-grow',
    renderRowActions: ({ row, table }) => (
      <InversionesRowActions row={row} table={table} onDelete={openDeleteConfirmModal} />
    ),
    renderTopToolbarCustomActions: () => (
      <InversionesToolbar
        moneda={moneda}
        total={totalDisplay}
        dolarVenta={cotizacionDolarQuery.data?.venta ?? null}
        onNuevaInversion={() => setCreateDialogOpen(true)}
        onMonedaChange={handleMonedaChanged}
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
    </Box>
  );
};

export default InversionesPage;
