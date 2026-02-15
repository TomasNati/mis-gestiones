'use client';

import {
  BuscarMovimientosPayload,
  BuscarMovimientosResponse,
  Categoria,
  CategoriaUIMovimiento,
} from '@/lib/definitions';
import { obtenerCategorias, obtenerCategoriasDeMovimientos } from '@/lib/orm/data';
import { FiltrosMovimientos } from "@/components/FiltrosMovimientos";
import { BuscarMovimientosResultadosMRT } from "@/components/Movimientos";
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
    setBuscarPayload(payload);
  };

  const movimientosResponse = buscarMovimientosQuery.data ?? null;

  return (
    <>
      <h2>Buscar Movimientos</h2>
      <FiltrosMovimientos subcategorias={subcategorias} categorias={categorias} onBuscar={handleBuscar} />
      {buscarMovimientosQuery.isFetching && <p>Buscando movimientos...</p>}
      {buscarMovimientosQuery.isError && <p>Hubo un error al buscar movimientos.</p>}
      {movimientosResponse && (
        <div>
          <h3>Resultados:</h3>
          {movimientosResponse.movimientos.length === 0 ? (
            <p>No se encontraron movimientos.</p>
          ) : (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Total:</strong> {movimientosResponse.total} &nbsp;|&nbsp;
                <strong>Página:</strong> {movimientosResponse.page_number} &nbsp;|&nbsp;
                <strong>Por página:</strong> {movimientosResponse.page_size}
              </div>
              <BuscarMovimientosResultadosMRT movimientos={movimientosResponse.movimientos} />
            </div>
          )}
        </div>
      )}
    </>
  );

}

export default BuscarMovimientos;
