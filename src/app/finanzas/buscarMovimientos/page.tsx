'use client';

import { Categoria, CategoriaUIMovimiento, Subcategoria } from '@/lib/definitions';
import { obtenerCategorias, obtenerCategoriasDeMovimientos, obtenerSubCategorias } from '@/lib/orm/data';
import { FiltrosMovimientos } from "@/components/FiltrosMovimientos";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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

  const handleBuscar = async () => {
    try {
      const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000/api';
      console.log({ url: `${backendBaseUrl}/movimientos-gasto` });
      const res = await fetch(`${backendBaseUrl}/movimientos-gasto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      console.log('Search results:', data);
    } catch (err: any) {
      console.error('Error searching:', err);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <h2>Buscar Movimientos</h2>
      <FiltrosMovimientos subcategorias={subcategorias} categorias={categorias} onBuscar={handleBuscar} />
    </LocalizationProvider>
  );

}

export default BuscarMovimientos;
