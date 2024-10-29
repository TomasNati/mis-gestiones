'use server';

import {
  CategoriaUIMovimiento,
  DetalleSubcategoria,
  GastoEstimadoAnual,
  MovimientoGasto,
  MovimientoGastoGrilla,
  Subcategoria,
  TipoDeGasto,
  TipoDeMovimientoGasto,
  months,
} from '../definitions';
import { db } from './database';
import { categorias, detalleSubcategorias, gastoEstimado, movimientosGasto, subcategorias } from './tables';
import { eq, and, desc, between, asc } from 'drizzle-orm';
import { generateUUID, obtenerCategoriaUIMovimiento, transformCurrencyToNumber } from '../helpers';
import { esES } from '@mui/x-data-grid';

type GastoPresupuestoItem = {
  id: string | null;
  fecha: Date | null;
  monto: string | null;
  comentarios: string | null;
  subCategoriaNombre: string;
  subCategoriaId: string;
  categoriaNombre: string;
  categoriaId: string;
  esEstimado?: boolean;
};

const obtenerSubCategorias = async (): Promise<Subcategoria[]> => {
  // avoids caching. See explanation on https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering.
  // For this method, caching data seems to be a good idea, so this is commented out
  // noStore();
  try {
    const result = await db
      .select({
        id: subcategorias.id,
        nombre: subcategorias.nombre,
        tipoDeGasto: subcategorias.tipoDeGasto,
        categoriaId: categorias.id,
        categoriaNombre: categorias.nombre,
      })
      .from(subcategorias)
      .innerJoin(categorias, and(eq(subcategorias.categoria, categorias.id), eq(categorias.active, true)))
      .where(eq(subcategorias.active, true))
      .orderBy(subcategorias.nombre);

    const subcategoriasUI = result.map((subcategoriaDB) => ({
      id: subcategoriaDB.id,
      nombre: subcategoriaDB.nombre,
      tipoDeGasto: subcategoriaDB.tipoDeGasto as TipoDeGasto,
      categoria: {
        id: subcategoriaDB.categoriaId,
        nombre: subcategoriaDB.categoriaNombre,
      },
    }));

    return subcategoriasUI;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener las subcategorias');
  }
};

const obtenerDetalleSubCategorias = async (): Promise<DetalleSubcategoria[]> => {
  // avoids caching. See explanation on https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering.
  // For this method, caching data seems to be a good idea, so this is commented out
  // noStore();
  try {
    const result = await db
      .select({
        id: detalleSubcategorias.id,
        nombre: detalleSubcategorias.nombre,
        subCategoriaId: subcategorias.id,
        subCategoriaNombre: subcategorias.nombre,
        subCategoriaTipoDeGasto: subcategorias.tipoDeGasto,
        categoriaId: categorias.id,
        categoriaNombre: categorias.nombre,
      })
      .from(detalleSubcategorias)
      .innerJoin(
        subcategorias,
        and(eq(detalleSubcategorias.subcategoria, subcategorias.id), eq(subcategorias.active, true)),
      )
      .innerJoin(categorias, and(eq(subcategorias.categoria, categorias.id), eq(categorias.active, true)))
      .where(eq(detalleSubcategorias.active, true))
      .orderBy(detalleSubcategorias.nombre);

    const detalleSubcategoriasUI = result.map((detalleSubcategoriaDB) => ({
      id: detalleSubcategoriaDB.id,
      nombre: detalleSubcategoriaDB.nombre,
      subcategoria: {
        id: detalleSubcategoriaDB.subCategoriaId,
        nombre: detalleSubcategoriaDB.subCategoriaNombre,
        tipoDeGasto: detalleSubcategoriaDB.subCategoriaTipoDeGasto as TipoDeGasto,
        categoria: {
          id: detalleSubcategoriaDB.categoriaId,
          nombre: detalleSubcategoriaDB.categoriaNombre,
        },
      },
    }));

    return detalleSubcategoriasUI;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener las subcategorias');
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

const obtenerMovimientos = async (
  limiteDeMovimientos?: number,
  fechaDesde?: Date,
  fechaHasta?: Date,
): Promise<MovimientoGastoGrilla[]> => {
  // noStore();
  try {
    const limite = limiteDeMovimientos ? limiteDeMovimientos : 500;
    const fechaDesdeFiltro = fechaDesde || new Date(Date.UTC(1900, 0, 1));
    const fechaHastaFiltro = fechaHasta || new Date(Date.UTC(2100, 0, 1));

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
      .where(
        and(eq(movimientosGasto.active, true), between(movimientosGasto.fecha, fechaDesdeFiltro, fechaHastaFiltro)),
      )
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

    return movimientos.map((movimiento) => ({
      ...movimiento,
      categoria: movimiento.subcategoria.categoria.nombre,
      concepto: obtenerCategoriaUIMovimiento(movimiento),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener los movimientos');
  }
};

export const obtenerUltimosMovimientos = async (): Promise<MovimientoGastoGrilla[]> => {
  return await obtenerMovimientos(10);
};

export const obtenerMovimientosPorFecha = async (fecha: Date): Promise<MovimientoGastoGrilla[]> => {
  const fechaDesde = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), 1, 0, 0, 0));
  const fechaHasta = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59));
  return await obtenerMovimientos(undefined, fechaDesde, fechaHasta);
};

const obtenerGastosEstimados = async (fechaDesde: Date, fechaHasta: Date): Promise<GastoPresupuestoItem[]> => {
  const dbResults: GastoPresupuestoItem[] = await db
    .select({
      id: gastoEstimado?.id,
      fecha: gastoEstimado?.fecha,
      monto: gastoEstimado?.monto,
      comentarios: gastoEstimado?.comentarios,
      subCategoriaNombre: subcategorias.nombre,
      subCategoriaId: subcategorias.id,
      categoriaNombre: categorias.nombre,
      categoriaId: categorias.id,
    })
    .from(subcategorias)
    .innerJoin(categorias, and(eq(subcategorias.categoria, categorias.id), eq(categorias.active, true)))
    .leftJoin(
      gastoEstimado,
      and(
        eq(gastoEstimado.subcategoria, subcategorias.id),
        eq(gastoEstimado.active, true),
        between(gastoEstimado.fecha, fechaDesde, fechaHasta),
      ),
    )
    .where(eq(subcategorias.active, true))
    .orderBy(asc(categorias.nombre), asc(subcategorias.nombre));

  dbResults.forEach((gasto) => (gasto.esEstimado = true));

  return dbResults;
};

const obtenerGastosReales = async (fechaDesde: Date, fechaHasta: Date): Promise<GastoPresupuestoItem[]> => {
  const dbResults: GastoPresupuestoItem[] = await db
    .select({
      id: movimientosGasto.id,
      fecha: movimientosGasto.fecha,
      monto: movimientosGasto.monto,
      comentarios: movimientosGasto.comentarios,
      subCategoriaNombre: subcategorias.nombre,
      subCategoriaId: subcategorias.id,
      categoriaNombre: categorias.nombre,
      categoriaId: categorias.id,
    })
    .from(movimientosGasto)
    .innerJoin(subcategorias, and(eq(movimientosGasto.subcategoria, subcategorias.id), eq(subcategorias.active, true)))
    .innerJoin(categorias, and(eq(subcategorias.categoria, categorias.id), eq(categorias.active, true)))
    .where(and(eq(movimientosGasto.active, true), between(movimientosGasto.fecha, fechaDesde, fechaHasta)))
    .orderBy(asc(categorias.nombre), asc(subcategorias.nombre));

  return dbResults;
};

const obtenerTotales = (
  anio: number,
  mes: number,
  esCategoria: boolean,
  id: string,
  dbResults: GastoPresupuestoItem[],
): { totalMes: number; gastoEstimadoId?: string } => {
  // obtengo los gastos para todas las subcategorias de la categoria y el mes dado
  const gastosMes = dbResults.filter(
    (gasto) =>
      gasto.id &&
      gasto.fecha &&
      ((esCategoria && gasto.categoriaId === id) || gasto.subCategoriaId === id) &&
      gasto.fecha.getUTCMonth() === mes &&
      gasto.fecha.getUTCFullYear() === anio,
  );
  const totalMes = gastosMes.reduce((total, gasto) => total + (transformCurrencyToNumber(gasto.monto || '') || 0), 0);
  return {
    totalMes,
    gastoEstimadoId: gastosMes[0]?.id && gastosMes[0]?.esEstimado ? gastosMes[0].id : undefined,
  };
};

export const obtenerGastosEstimadosPorAnio = async (anio: number): Promise<GastoEstimadoAnual[]> => {
  const resultado: GastoEstimadoAnual[] = [];

  const fechaDesde = new Date(Date.UTC(anio, 0, 1, 0, 0, 0));
  const fechaHasta = new Date(Date.UTC(anio, 11, 31, 23, 59, 59));

  try {
    const fechaDesdeFiltro = fechaDesde || new Date(Date.UTC(1900, 0, 1));
    const fechaHastaFiltro = fechaHasta || new Date(Date.UTC(2100, 0, 1));

    const dbGastosEstimados: GastoPresupuestoItem[] = await obtenerGastosEstimados(fechaDesdeFiltro, fechaHastaFiltro);
    const dbGastosReales: GastoPresupuestoItem[] = await obtenerGastosReales(fechaDesdeFiltro, fechaHastaFiltro);

    for (const gastoDB of dbGastosEstimados) {
      if (!resultado.find((gasto) => gasto.id === gastoDB.categoriaId)) {
        resultado.push({
          id: gastoDB.categoriaId,
          dbId: `categoria-${generateUUID()}`,
          descripcion: `${gastoDB.categoriaNombre} - Total mensual`,
        });
      }

      if (!resultado.find((gasto) => gasto.id === gastoDB.subCategoriaId)) {
        resultado.push({
          id: gastoDB.subCategoriaId,
          dbId: gastoDB.id,
          categoriaId: gastoDB.categoriaId,
          descripcion: `-------------  ${gastoDB.subCategoriaNombre}`,
        });
      }
    }

    for (const fila of resultado) {
      months.forEach((mes, mesIndex) => {
        const totalEstimado = obtenerTotales(
          anio,
          mesIndex,
          fila.dbId?.startsWith('categoria-') || false,
          fila.id,
          dbGastosEstimados,
        );
        const totalReal = obtenerTotales(
          anio,
          mesIndex,
          fila.dbId?.startsWith('categoria-') || false,
          fila.id,
          dbGastosReales,
        );
        fila[mes] = {
          estimado: totalEstimado.totalMes,
          real: totalReal.totalMes,
          gastoEstimadoDBId: totalEstimado.gastoEstimadoId,
        };
      });
    }

    return resultado;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error al obtener los gastos estimados');
  }
};

export const obtenerGastosEstimadosTotalesPorFecha = async (fecha: Date): Promise<number> => {
  const fechaDesde = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), 1, 0, 0, 0));
  const fechaHasta = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59));

  try {
    const fechaDesdeFiltro = fechaDesde || new Date(Date.UTC(1900, 0, 1));
    const fechaHastaFiltro = fechaHasta || new Date(Date.UTC(2100, 0, 1));

    const dbResults = await db
      .select({
        monto: gastoEstimado.monto,
      })
      .from(gastoEstimado)
      .where(and(eq(gastoEstimado.active, true), between(gastoEstimado.fecha, fechaDesdeFiltro, fechaHastaFiltro)));

    const totalEstimado = dbResults.reduce((total, gasto) => total + (transformCurrencyToNumber(gasto.monto) || 0), 0);
    return totalEstimado;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener los gastos estimados');
  }
};
