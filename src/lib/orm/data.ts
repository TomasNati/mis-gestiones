'use server';

import { MovimientoGasto, TipoDeGasto, TipoDeMovimientoGasto } from '../definitions';
import { db } from './database';
import { CategoriaDB, categorias, detalleSubcategorias, movimientosGasto, subcategorias } from './tables';
import { unstable_noStore as noStore } from 'next/cache';
import { eq, and, gte, desc } from 'drizzle-orm';

export const obtenerCategorias = async (): Promise<CategoriaDB[]> => {
  const selectResult = await db.select().from(categorias);
  return selectResult;
};

const obtenerMovimientos = async (limiteDeMovimientos?: number, fechaDesde?: Date): Promise<MovimientoGasto[]> => {
  noStore();
  try {
    const limite = limiteDeMovimientos ? limiteDeMovimientos : 500;
    const fechaDesdeString = fechaDesde ? fechaDesde.toISOString().split('T')[0] : '1900-01-01';
    const fechaFiltro = new Date(fechaDesdeString);

    const result = await db
      .select({
        id: movimientosGasto.id,
        fecha: movimientosGasto.fecha,
        tipoDeGasto: movimientosGasto.tipodepago,
        monto: movimientosGasto.monto,
        comentarios: movimientosGasto.comentarios,
        detalleSubCategoriaId: detalleSubcategorias.id,
        detalleSubCategoriaNombre: detalleSubcategorias.nombre,
        subCategoriaId: subcategorias.id,
        subCategoriaNombre: subcategorias.nombre,
        subCategoriaTipoDeGasto: subcategorias.tipoDeGasto,
        categoriaId: categorias.id,
        categoriaNombre: categorias.nombre,
      })
      .from(movimientosGasto)
      .innerJoin(
        subcategorias,
        and(eq(movimientosGasto.subcategoria, subcategorias.id), eq(subcategorias.active, true)),
      )
      .innerJoin(categorias, and(eq(subcategorias.categoria, categorias.id), eq(categorias.active, true)))
      .leftJoin(
        detalleSubcategorias,
        and(eq(movimientosGasto.detallesubcategoria, detalleSubcategorias.id), eq(detalleSubcategorias.active, true)),
      )
      .where(and(eq(movimientosGasto.active, true), gte(movimientosGasto.fecha, fechaFiltro)))
      .limit(limite)
      .orderBy(desc(movimientosGasto.fecha));

    const movimientos: MovimientoGasto[] = result.map((movimientoDB) => {
      const movimiento: MovimientoGasto = {
        id: movimientoDB.id,
        fecha: movimientoDB.fecha,
        tipoDeGasto: movimientoDB.tipoDeGasto as TipoDeMovimientoGasto,
        monto: Number.parseFloat(movimientoDB.monto),
        comentarios: movimientoDB.comentarios || undefined,
        subcategoria: {
          id: movimientoDB.subCategoriaId,
          nombre: movimientoDB.subCategoriaNombre,
          tipoDeGasto: movimientoDB.subCategoriaTipoDeGasto as TipoDeGasto,
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
    });

    return movimientos;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener los movimientos');
  }
};

export const obtenerUltimosMovimientos = async (): Promise<MovimientoGasto[]> => {
  return await obtenerMovimientos(10);
};

export const obtenerMovimientosPorFecha = async (fecha: Date): Promise<MovimientoGasto[]> => {
  return await obtenerMovimientos(undefined, fecha);
};
