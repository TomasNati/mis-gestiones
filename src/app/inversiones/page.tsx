'use client';

import { Inversion, InversionCreatePayload, INSTRUMENTO_INVERSION_TIPO, INSTRUMENTO_MONEDA } from '@/lib/definitions';
import {
  crearInversion,
  eliminarInversion,
  obtenerInstrumentos,
  obtenerInversiones,
  obtenerMetaInversiones,
} from '@/lib/api';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { MaterialReactTable, MRT_Row, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { ConfirmDeleteModal } from '@/components/comun/ConfirmDeleteModal';
import { CrearEditarInversion } from '@/components/inversiones/CrearEditarInversion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const InversionesPage = () => {
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState<MRT_Row<Inversion> | null>(null);

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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eliminarInversion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inversiones'] });
    },
  });

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const precioPorInstrumento = useMemo(() => {
    const map = new Map<string, { simbolo: string; precio: string; monto: number }>();
    const dolares = [INSTRUMENTO_MONEDA.DOLAR, INSTRUMENTO_MONEDA.DOLAR_CCL];
    instrumentosQuery.data?.forEach((inst) => {
      const precio = inst.precios?.[0];
      const simboloMoneda = dolares.includes(inst.moneda) ? 'US$' : '$';
      map.set(inst.id, {
        simbolo: simboloMoneda,
        precio: precio ? transformNumberToCurrenty(precio.monto) || '-' : '-',
        monto: precio.monto,
      });
    });
    return map;
  }, [instrumentosQuery.data]);

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
        accessorFn: (row) => {
          const p = precioPorInstrumento.get(row.instrumento.id);
          return p ? `${p.simbolo} ${p.precio}` : '-';
        },
        id: 'precio',
        header: 'Precio',
        size: 130,
      },
      {
        accessorFn: (row) => {
          const { simbolo, monto } = precioPorInstrumento.get(row.instrumento.id) || {};
          const total = transformNumberToCurrenty(row.cantidad * (monto || 0));
          return `${simbolo} ${total?.replace(',00', '')}`;
        },
        id: 'total',
        header: 'Total',
        size: 130,
        muiTableBodyCellProps: {
          align: 'right',
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
      <Box sx={{ display: 'flex', gap: 0, whiteSpace: 'nowrap' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
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
