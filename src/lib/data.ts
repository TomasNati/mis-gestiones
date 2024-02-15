'use server';

import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
  Categoria,
  CategoriaUIMovimiento,
  DetalleSubcategoria,
  DetalleSubcategoriaDB,
  MovimientoGasto,
  MovimientoGastoDB,
  Subcategoria,
  SubcategoriaDB,
} from './definitions';
import { movimientos } from './placeholder-data';

const mapearMovimientoDBaMovimiento = (movimientoDB: MovimientoGastoDB): MovimientoGasto => {
  const movimiento: MovimientoGasto = {
    id: movimientoDB.id,
    fecha: movimientoDB.fecha,
    tipoDeGasto: movimientoDB.tipoDeGasto,
    monto: movimientoDB.monto,
    comentarios: movimientoDB.comentarios || undefined,
    subcategoria: {
      id: movimientoDB.subCategoriaId,
      nombre: movimientoDB.subCategoriaNombre,
      tipoDeGasto: movimientoDB.subCategoriaTipoDeGasto,
      categoria: {
        id: movimientoDB.categoriaId,
        nombre: movimientoDB.categoriaNombre,
      },
    },
  };
  if (movimientoDB.detalleSubCategoriaId) {
    movimiento.detalleSubcategoria = {
      id: movimientoDB.detalleSubCategoriaId,
      nombre: movimientoDB.detalleSubCategoriaNombre || '',
      subcategoria: movimiento.subcategoria,
    };
  }

  return movimiento;
};

const obtenerMovimientos = async (limiteDeMovimientos?: number, fechaDesde?: Date): Promise<MovimientoGasto[]> => {
  noStore();
  try {
    const limite = limiteDeMovimientos ? limiteDeMovimientos : 500;
    const fechaDesdeString = fechaDesde ? fechaDesde.toISOString().split('T')[0] : '1900-01-01';

    const data = await sql<MovimientoGastoDB>`
     select fmg.id , fmg.fecha , fmg.tipodepago as "tipoDeGasto" , fmg.monto , fmg.comentarios ,
	    fd.id as "detalleSubCategoriaId", fd.nombre as "detalleSubCategoriaNombre",
      fs.id as "subCategoriaId" , fs.nombre as "subCategoriaNombre", fs.tipodegasto as "subCategoriaTipoDeGasto" ,
      fc.id as "categoriaId", fc.nombre as "categoriaNombre"
      from misgestiones.finanzas_movimientogasto fmg 
      inner join misgestiones.finanzas_subcategoria fs on fs.id = fmg.subcategoria
         and fs.active = true
      inner join misgestiones.finanzas_categoria fc on fs.categoria  = fc.id
         and fc.active = true
      left join misgestiones.finanzas_detallesubcategoria fd on fd.subcategoria = fmg.detallesubcategoria
      	and fd.active = true
      where fmg.active = true
        and fmg.fecha >= ${fechaDesdeString}
      order by fmg.fecha desc
      limit ${limite};`;

    const movimientos = data.rows.map((movimientoDB) => mapearMovimientoDBaMovimiento(movimientoDB));

    return movimientos;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener los movimientos');
  }
};

export const obtenerUltimosMovimientos = async (): Promise<MovimientoGasto[]> => {
  return await obtenerMovimientos(5);
};

export const obtenerMovimientosPorFecha = async (fecha: Date): Promise<MovimientoGasto[]> => {
  return await obtenerMovimientos(undefined, fecha);
};

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

export const obtenerMovimientosDelMes = async (fecha: Date): Promise<MovimientoGasto[]> => {
  return Promise.resolve(movimientos);
};
