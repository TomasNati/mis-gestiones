'use server';

import { sql } from '@vercel/postgres';
// import { unstable_noStore as noStore } from 'next/cache';
import {
  Categoria,
  CategoriaUIMovimiento,
  DetalleSubcategoria,
  DetalleSubcategoriaDB,
  MovimientoGasto,
  Subcategoria,
  SubcategoriaDB,
  TipoDeGasto,
} from './definitions';
import { movimientos } from './placeholder-data';

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  // noStore();
  try {
    const data = await sql<Categoria>`
      select fc.id , fc.nombre 
      from misgestiones.finanzas_categoria fc 
      where fc.active = true`;

    const categorias = data.rows.map((categoria) => ({
      ...categoria,
    }));
    return categorias;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener las categorias');
  }
};

export const obtenerSubCategorias = async (): Promise<Subcategoria[]> => {
  // avoids caching. See explanation on https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering.
  // For this method, caching data seems to be a good idea, so this is commented out
  // noStore();
  try {
    const categorias = await obtenerCategorias();
    const data = await sql<SubcategoriaDB>`
      select fs2.id , fs2.nombre, fs2.categoria, fs2.tipodegasto  
      from misgestiones.finanzas_subcategoria fs2  
      where fs2.active = true`;

    const subcategorias = data.rows.map((subcategoria) => ({
      ...subcategoria,
      categoria: categorias.find((categoria) => categoria.id === subcategoria.categoria) || {
        id: '0',
        nombre: 'Sin categoria',
      },
    }));

    return subcategorias;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener las subcategorias');
  }
};

export const obtenerDetalleSubCategorias = async (): Promise<DetalleSubcategoria[]> => {
  // avoids caching. See explanation on https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering.
  // For this method, caching data seems to be a good idea, so this is commented out
  // noStore();
  try {
    const subcategorias = await obtenerSubCategorias();
    const data = await sql<DetalleSubcategoriaDB>`
      select fd.id , fd.nombre , fd.subcategoria 
      from misgestiones.finanzas_detallesubcategoria fd 
      where fd.active = true`;

    const detalleSubcategorias = data.rows.map((detalleSubcategoria) => ({
      ...detalleSubcategoria,
      subcategoria: subcategorias.find((subcategoria) => subcategoria.id === detalleSubcategoria.subcategoria) || {
        id: '0',
        nombre: 'Sin subcategoria',
        tipoDeGasto: TipoDeGasto.Fijo,
        categoria: {
          id: '0',
          nombre: 'Sin categoria',
        },
      },
    }));

    return detalleSubcategorias;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener los detalles de las subcategorias');
  }
};

export const obtenerCategoriasDeMovimientos = async (): Promise<CategoriaUIMovimiento[]> => {
  const [subcategorias, detalleSubcategorias] = await Promise.all([
    obtenerSubCategorias(),
    obtenerDetalleSubCategorias(),
  ]);

  const categoriasUIMovimiento: CategoriaUIMovimiento[] = [];

  subcategorias
    .filter(
      (subcategoria) =>
        !detalleSubcategorias.find((detalleSubcategoria) => detalleSubcategoria.subcategoria.id === subcategoria.id),
    )
    .forEach((subcategoria) => {
      categoriasUIMovimiento.push({
        id: subcategoria.id,
        nombre: subcategoria.nombre,
        subcategoriaId: subcategoria.id,
        categoriaNombre: subcategoria.categoria.nombre,
      });
    });

  detalleSubcategorias.forEach((detalleSubcategoria) => {
    categoriasUIMovimiento.push({
      id: detalleSubcategoria.id,
      nombre: `(${detalleSubcategoria.subcategoria.nombre}) ${detalleSubcategoria.nombre}`,
      subcategoriaId: detalleSubcategoria.subcategoria.id,
      detalleSubcategoriaId: detalleSubcategoria.id,
      categoriaNombre: detalleSubcategoria.subcategoria.categoria.nombre,
    });
  });

  return Promise.resolve(categoriasUIMovimiento);
};

export const obtenerUltimosMovimientos = () => {
  return movimientos;
};

export const obtenerMovimientosDelMes = async (fecha: Date): Promise<MovimientoGasto[]> => {
  return Promise.resolve(movimientos);
};
