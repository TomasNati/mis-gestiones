'use client';

import { BuscarMovimientoGasto } from '@/lib/definitions';
import { formatDate, transformNumberToCurrenty, obtenerStringDeTipoDeMovimientoGasto } from '@/lib/helpers';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import { useMemo, useState } from 'react';

const FECHA_COLUMN_WIDTH = 150;
const MONTO_COLUMN_WIDTH = 150;
const TIPO_PAGO_COLUMN_WIDTH = 180;
const CATEGORIA_COLUMN_WIDTH = 200;
const SUBCATEGORIA_COLUMN_WIDTH = 220;

const BuscarMovimientosResultadosMRT = ({
  movimientos,
  total,
  pageNumber,
  pageSize,
  isLoading,
  onPageChange,
  onSortingChange,
}: {
  movimientos: BuscarMovimientoGasto[];
  total: number;
  pageNumber: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number, size: number) => void;
  onSortingChange: (field: string | null, by: string | null) => void;
}) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: pageNumber - 1,
    pageSize,
  });
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const columns = useMemo<MRT_ColumnDef<BuscarMovimientoGasto>[]>(
    () => [
      {
        accessorFn: (row) => formatDate(new Date(row.fecha), false, { timeZone: 'UTC' }),
        id: 'fecha',
        header: 'Fecha',
        size: FECHA_COLUMN_WIDTH,
      },
      {
        accessorFn: (row) => transformNumberToCurrenty(row.monto),
        id: 'monto',
        header: 'Monto',
        size: MONTO_COLUMN_WIDTH,
      },
      {
        accessorFn: (row) => obtenerStringDeTipoDeMovimientoGasto(row.tipoDePago),
        accessorKey: 'tipoDePago',
        header: 'Tipo de Pago',
        size: TIPO_PAGO_COLUMN_WIDTH,
      },
      {
        accessorFn: (row) => row.subcategoria?.categoria?.nombre || row.subcategoria?.categoria?.id || '-',
        id: 'categoria',
        header: 'Categoría',
        size: CATEGORIA_COLUMN_WIDTH,
      },
      {
        accessorFn: (row) => row.subcategoria?.nombre || row.subcategoria?.id || '-',
        id: 'subcategoria',
        header: 'Subcategoría',
        size: SUBCATEGORIA_COLUMN_WIDTH,
      },
      {
        accessorKey: 'comentarios',
        header: 'Comentarios',
        size: 200,
        muiTableBodyCellProps: { sx: { flexGrow: 1 } },
        muiTableHeadCellProps: { sx: { flexGrow: 1 } },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: movimientos,
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
    manualPagination: true,
    manualSorting: true,
    rowCount: total,
    state: {
      pagination,
      sorting,
      isLoading,
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(newPagination);
      onPageChange(newPagination.pageIndex + 1, newPagination.pageSize);
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);

      if (newSorting.length === 0) {
        onSortingChange(null, null);
      } else {
        const { id, desc } = newSorting[0];
        onSortingChange(id, desc ? 'desc' : 'asc');
      }
    },
    muiTableProps: {
      size: 'small',
    },
    muiTablePaperProps: {
      sx: {
        display: 'flex',
        flexDirection: 'column',
        inlineSize: '100%',
        overflow: 'auto',
        flex: 1,
      },
    },
    muiCircularProgressProps: {
      color: 'secondary',
      thickness: 5,
      size: 55,
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Acciones',
      },
    },
    layoutMode: 'grid-no-grow',
  });

  return <MaterialReactTable table={table} />;
};

export { BuscarMovimientosResultadosMRT };
