'use client';

import { Subcategoria, Categoria } from "@/lib/definitions";
import { obtenerCategorias, obtenerSubCategorias } from "@/lib/orm/data";
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
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
      const fetchSubcategoriasAndCategorias = async () => {
        const promises = [obtenerSubCategorias(), obtenerCategorias()];
        const [subcategorias, categorias] = await Promise.all(promises);
        subcategorias.sort(sortByNombre);
        categorias.sort(sortByNombre);
        setSubcategorias(subcategorias);
        setCategorias(categorias);
      };
  
      fetchSubcategoriasAndCategorias();
    }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <h2>Buscar Movimientos</h2>
      <FiltrosMovimientos subcategorias={subcategorias} categorias={categorias} onBuscar={() => {}} />
    </LocalizationProvider>
  );

}

export default BuscarMovimientos;
