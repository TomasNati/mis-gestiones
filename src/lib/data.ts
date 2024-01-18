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
    const data = await sql<SubcategoriaDB>`
      select fs2.id , fs2.nombre, fs2.tipodegasto as "tipoDeGasto",
      fc.id as "categoriaId", fc.nombre as "categoriaNombre"
      from misgestiones.finanzas_subcategoria fs2  
      inner join misgestiones.finanzas_categoria fc on fs2.categoria  = fc.id
         and fc.active = true
      where fs2.active = true`;

    const subcategorias = data.rows.map((subcategoriaDB) => ({
      id: subcategoriaDB.id,
      nombre: subcategoriaDB.nombre,
      tipoDeGasto: subcategoriaDB.tipoDeGasto,
      categoria: {
        id: subcategoriaDB.categoriaId,
        nombre: subcategoriaDB.categoriaNombre,
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
     select fd.id , fd.nombre,
      fs2.id as "subCategoriaId" , fs2.nombre as "subCategoriaNombre", fs2.tipodegasto as "subCategoriaTipoDeGasto" ,
      fc.id as "categoriaId", fc.nombre as "categoriaNombre"
      from misgestiones.finanzas_detallesubcategoria fd 
      inner join misgestiones.finanzas_subcategoria fs2 on fs2.id = fd.subcategoria
         and fs2.active = true
      inner join misgestiones.finanzas_categoria fc on fs2.categoria  = fc.id
         and fc.active = true
      where fd.active = true`;

    const detalleSubcategorias = data.rows.map((detalleSubcategoriaDB) => ({
      id: detalleSubcategoriaDB.id,
      nombre: detalleSubcategoriaDB.nombre,
      subcategoria: {
        id: detalleSubcategoriaDB.subCategoriaId,
        nombre: detalleSubcategoriaDB.subCategoriaNombre,
        tipoDeGasto: detalleSubcategoriaDB.subCategoriaTipoDeGasto,
        categoria: {
          id: detalleSubcategoriaDB.categoriaId,
          nombre: detalleSubcategoriaDB.categoriaNombre,
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
