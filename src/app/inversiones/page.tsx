'use client';

import { Inversion, InversionCreatePayload } from '@/lib/definitions';
import { crearInversion, obtenerInstrumentos, obtenerInversiones, obtenerMetaInversiones } from '@/lib/api';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button } from '@mui/material';
import { CrearEditarInversion } from '@/components/inversiones/CrearEditarInversion';

const InversionesPage = () => {
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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

  const createMutation = useMutation({
    mutationFn: (payload: InversionCreatePayload) => crearInversion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
      handleCloseCreateDialog();
    },
  });

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const precioPorInstrumento = useMemo(() => {
    const map = new Map<string, string>();
    instrumentosQuery.data?.forEach((inst) => {
      const precio = inst.precios?.[0];
      map.set(inst.id, precio ? transformNumberToCurrenty(precio.monto) || '-' : '-');
    });
    return map;
  }, [instrumentosQuery.data]);

  const columns = useMemo<MRT_ColumnDef<Inversion>[]>(
    () => [
      {
        accessorFn: (row) => row.instrumento.nombre,
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
        accessorFn: (row) => precioPorInstrumento.get(row.instrumento.id) ?? '-',
        id: 'precio',
        header: 'Precio',
        size: 130,
      },
    ],
    [precioPorInstrumento],
  );

  const instrumentos = instrumentosQuery.data ?? [];
  const brokers = metaQuery.data?.brokers ?? [];

  const table = useMaterialReactTable({
    columns,
    data: inversionesQuery.data ?? [],
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
    state: {
      isLoading: inversionesQuery.isLoading,
    },
    muiTableProps: {
      size: 'small',
    },
    layoutMode: 'grid-no-grow',
    renderTopToolbarCustomActions: () => (
      <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
        Nueva Inversión
      </Button>
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
    </Box>
  );
};

export default InversionesPage;
