'use client';

import {
  Inversion,
  InversionCreatePayload,
  INSTRUMENTO_INVERSION_TIPO,
  INSTRUMENTO_MONEDA,
  InstrumentoMoneda,
  TIPO_DOLAR,
  TipoDolar,
} from '@/lib/definitions';
import {
  crearInversion,
  eliminarInversion,
  getCotizacionesDolar,
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
  useMaterialReactTable,
} from 'material-react-table';
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, CircularProgress, Divider, IconButton } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { ConfirmDeleteModal } from '@/components/comun/ConfirmDeleteModal';
import { CrearEditarInversion } from '@/components/inversiones/CrearEditarInversion';
import { InversionesRowActions } from '@/components/inversiones/InversionesRowActions';
import { InversionesToolbar } from '@/components/inversiones/InversionesToolbar';
import { InversionesPorCategoria } from '@/components/graficos/';

const InversionesPage = () => {
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState<MRT_Row<Inversion> | null>(null);
  const [moneda, setMoneda] = useState<InstrumentoMoneda>(INSTRUMENTO_MONEDA.PESO);
  const [tipoDolar, setTipoDolar] = useState<TipoDolar>(TIPO_DOLAR.OFICIAL);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [mostrandoGraficos, setMostrandoGraficos] = useState(false);

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

  const cotizacionesDolarQuery = useQuery({
    queryKey: ['cotizacionesDolar'],
    queryFn: getCotizacionesDolar,
  });

  const cotizacionDolarSeleccionada = useMemo(
    () => cotizacionesDolarQuery.data?.find((c) => c.tipo === tipoDolar) ?? null,
    [cotizacionesDolarQuery.data, tipoDolar],
  );

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

  const { precioPorInstrumento, totalDisplay, datosPorBroker, datosPorRenta } = useInversiones({
    instrumentos: instrumentosQuery.data,
    inversiones: inversionesQuery.data,
    moneda,
    cotizacionDolarSeleccionada,
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

   const handleTipoDolarChanged = (event: React.MouseEvent<HTMLElement>, nuevoTipoDolar: TipoDolar | null) => {
     if (nuevoTipoDolar) setTipoDolar(nuevoTipoDolar);
   };

  const instrumentos = instrumentosQuery.data ?? [];
  const brokers = metaQuery.data?.brokers ?? [];
  const isLoading = inversionesQuery.isLoading || instrumentosQuery.isLoading || metaQuery.isLoading;
  const isSaving = createMutation.isPending || deleteMutation.isPending;

  const table = useMaterialReactTable({
    columns,
    data: inversionesQuery.data ?? [],
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
    enableRowActions: true,
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
    renderTopToolbarCustomActions: () => (
      <InversionesToolbar
        moneda={moneda}
        tipoDolar={tipoDolar}
        total={totalDisplay}
        dolarVenta={cotizacionDolarSeleccionada?.venta ?? null}
        onNuevaInversion={() => setCreateDialogOpen(true)}
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
      <Box
        sx={{
          display: mostrandoGraficos ? 'flex' : 'none',
          flexShrink: 0,
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 3,
          overflow: 'auto',
        }}
      >
        <InversionesPorCategoria titulo="Total por broker" data={datosPorBroker} simbolo={simboloMoneda} />
        <InversionesPorCategoria titulo="Total por tipo de renta" data={datosPorRenta} simbolo={simboloMoneda} />
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
    </Box>
  );
};

export default InversionesPage;
