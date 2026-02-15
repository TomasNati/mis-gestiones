'use client';

import { BuscarMovimientoGasto } from '@/lib/definitions';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useMemo } from 'react';

const BuscarMovimientosResultadosMRT = ({
  movimientos,
}: {
  movimientos: BuscarMovimientoGasto[];
}) => {
  const columns = useMemo<MRT_ColumnDef<BuscarMovimientoGasto>[]>(
    () => [
      {
        accessorFn: (row) => new Date(row.fecha).toLocaleString(),
        id: 'fecha',
        header: 'Fecha',
        size: 130,
      },
      {
        accessorFn: (row) => `$${row.monto}`,
        id: 'monto',
        header: 'Monto',
        size: 100,
      },
      {
        accessorKey: 'tipoDePago',
        header: 'Tipo de Pago',
        size: 120,
      },
      {
        accessorFn: (row) => row.subcategoria?.nombre || row.subcategoria?.id || '-',
        id: 'subcategoria',
        header: 'Subcategoría',
        size: 150,
      },
      {
        accessorFn: (row) =>
          row.subcategoria?.categoria?.nombre || row.subcategoria?.categoria?.id || '-',
        id: 'categoria',
        header: 'Categoría',
        size: 150,
      },
      {
        accessorKey: 'comentarios',
        header: 'Comentarios',
        size: 200,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: movimientos,
    enableSorting: true,
    enableColumnFilters: false,
    enablePagination: true,
    muiTableProps: {
      size: 'small',
    },
  });

  return <MaterialReactTable table={table} />;
};

export { BuscarMovimientosResultadosMRT };
