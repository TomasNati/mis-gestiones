'use client';

import { BuscarMovimientosPayload, Categoria, CategoriaUIMovimiento } from '@/lib/definitions';
import { obtenerCategorias, obtenerCategoriasDeMovimientos } from '@/lib/orm/data';
import { FiltrosMovimientos } from '@/components/FiltrosMovimientos';
import { BuscarMovimientosResultadosMRT } from '@/components/Movimientos';
import { useEffect, useState } from 'react';
import { buscarMovimientos } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const sortByNombre = (a: { nombre: string }, b: { nombre: string }) => {
  if (a.nombre < b.nombre) {
    return -1;
  } else if (a.nombre > b.nombre) {
    return 1;
  } else {
    return 0;
  }
};

const BuscarMovimientos = () => {
  const [subcategorias, setSubcategorias] = useState<CategoriaUIMovimiento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [buscarPayload, setBuscarPayload] = useState<BuscarMovimientosPayload | null>(null);

  const buscarMovimientosQuery = useQuery({
    queryKey: ['buscarMovimientos', buscarPayload],
    enabled: Boolean(buscarPayload),
    queryFn: ({ queryKey }) => {
      const [, payload] = queryKey as [string, BuscarMovimientosPayload];
      return buscarMovimientos(payload);
    },
  });

  useEffect(() => {
    const fetchSubcategoriasAndCategorias = async () => {
      const promises = [obtenerCategoriasDeMovimientos(), obtenerCategorias()];
      const [subcategorias, categorias] = await Promise.all(promises);

      (subcategorias as CategoriaUIMovimiento[]).sort((a, b) => {
        if (a.categoriaNombre < b.categoriaNombre) {
          return -1;
        }
        if (a.categoriaNombre > b.categoriaNombre) {
          return 1;
        }
        return 0;
      });

      categorias.sort(sortByNombre);
      setSubcategorias(subcategorias as CategoriaUIMovimiento[]);
      setCategorias(categorias);
    };

    fetchSubcategoriasAndCategorias();
  }, []);

  const handleBuscar = async (payload: BuscarMovimientosPayload) => {
    const pageSize = buscarPayload?.page_size ?? 10;
    setBuscarPayload({ ...payload, page_number: 1, page_size: pageSize });
  };

  const handlePageChange = (page: number, size: number) => {
    if (buscarPayload) {
      setBuscarPayload({ ...buscarPayload, page_number: page, page_size: size });
    }
  };

  const handleSortingChange = (sortField: string | null, sortBy: string | null) => {
    if (buscarPayload) {
      setBuscarPayload({ ...buscarPayload, sort_field: sortField, sort_by: sortBy, page_number: 1 });
    }
  };

  const movimientosResponse = buscarMovimientosQuery.data ?? {
    movimientos: [],
    total: 0,
    page_number: 1,
    page_size: 10,
  };

  return (
    <>
      <h2>Buscar Movimientos</h2>
      <FiltrosMovimientos subcategorias={subcategorias} categorias={categorias} onBuscar={handleBuscar} />
      {buscarMovimientosQuery.isError && <p>Hubo un error al buscar movimientos.</p>}
      <BuscarMovimientosResultadosMRT
        movimientos={movimientosResponse.movimientos}
        total={movimientosResponse.total}
        pageNumber={movimientosResponse.page_number}
        pageSize={movimientosResponse.page_size}
        isLoading={buscarMovimientosQuery.isFetching}
        onPageChange={handlePageChange}
        onSortingChange={handleSortingChange}
      />
    </>
  );
};

export default BuscarMovimientos;
