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
  AgendaTomiDia,
  TipoEventoSuenio,
  SuenioTomiPorPeriodo,
} from '@/lib/definitions';
import { db } from './database';
import {
  categorias,
  detalleSubcategorias,
  gastoEstimado,
  movimientosGasto,
  subcategorias,
  tomiAgendaDia,
  tomiAgendaEventoSuenio,
} from './tables';
import { eq, and, desc, between, asc } from 'drizzle-orm';
import {
  generateUUID,
  obtenerCategoriaUIMovimiento,
  transformCurrencyToNumber,
  obtenerDiasEnElMes,
  obtenerHorasDeSuenio,
} from '../helpers';

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

export const obtenerSubCategorias = async (): Promise<Subcategoria[]> => {
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

export const obtenerGastosEstimadosPorAnio = async (desde: Date, hasta: Date): Promise<GastoEstimadoAnual[]> => {
  const resultado: GastoEstimadoAnual[] = [];

  try {
    if (hasta.getFullYear() * 12 + hasta.getMonth() - (desde.getFullYear() * 12 + desde.getMonth()) > 11) {
      throw new Error('El rango de fechas no puede ser mayor a 12 meses');
    }
    const fechaDesdeFiltro = new Date(Date.UTC(desde.getFullYear(), desde.getMonth(), 1, 0, 0, 0));
    const fechaHastaFiltro = new Date(
      Date.UTC(hasta.getFullYear(), hasta.getMonth(), obtenerDiasEnElMes(hasta), 23, 59, 59),
    );

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
      let currentDate = new Date(desde);

      // Continue the loop until the current month/year is after the to month/year
      while (currentDate <= hasta) {
        const anio = currentDate.getFullYear();
        const mesIndex = currentDate.getMonth();
        const mes = months[mesIndex];

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

        // Increase the current date by 1 month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
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

export const obtenerAgendaTomiDias = async (fechaDesde: Date, fechaHasta: Date): Promise<AgendaTomiDia[]> => {
  try {
    const dbResults = await db
      .select({
        id: tomiAgendaEventoSuenio.id,
        hora: tomiAgendaEventoSuenio.hora,
        tipo: tomiAgendaEventoSuenio.tipo,
        comentarios: tomiAgendaEventoSuenio.comentarios,
        diaId: tomiAgendaDia.id,
        diaComentarios: tomiAgendaDia.comentarios,
        diaFecha: tomiAgendaDia.fecha,
      })
      .from(tomiAgendaEventoSuenio)
      .innerJoin(tomiAgendaDia, and(eq(tomiAgendaEventoSuenio.dia, tomiAgendaDia.id)))
      .where(and(eq(tomiAgendaDia.active, true), between(tomiAgendaDia.fecha, fechaDesde, fechaHasta)))
      .orderBy(asc(tomiAgendaDia.fecha), asc(tomiAgendaEventoSuenio.hora));

    const agendaTomiDias: AgendaTomiDia[] = [];
    dbResults.forEach((dbResult) => {
      const dia = agendaTomiDias.find((agendaTomiDia) => agendaTomiDia.id === dbResult.diaId);
      if (dia) {
        dia.eventos.push({
          id: dbResult.id,
          hora: dbResult.hora,
          tipo: (dbResult.tipo as TipoEventoSuenio) || 'Despierto',
          comentarios: dbResult.comentarios || '',
        });
      } else {
        agendaTomiDias.push({
          id: dbResult.diaId,
          fecha: dbResult.diaFecha,
          comentarios: dbResult.diaComentarios || '',
          eventos: [
            {
              id: dbResult.id,
              hora: dbResult.hora,
              tipo: (dbResult.tipo as TipoEventoSuenio) || 'Despierto',
              comentarios: dbResult.comentarios || '',
            },
          ],
        });
      }
    });

    return agendaTomiDias;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener obtenerAgendaTomiDias');
  }
};

export const obtenerSuenioTomiPorPeriodo = async (
  hasta: Date,
  mesesAIncluir: number = 12,
): Promise<SuenioTomiPorPeriodo[]> => {
  const fechaDesde = new Date(Date.UTC(hasta.getFullYear(), hasta.getMonth() - mesesAIncluir + 1, 1));
  const fechaHasta = new Date(Date.UTC(hasta.getFullYear(), hasta.getMonth(), obtenerDiasEnElMes(hasta), 23, 59, 59));
  const dias = await obtenerAgendaTomiDias(fechaDesde, fechaHasta);

  const suenioPorPeriodo: SuenioTomiPorPeriodo[] = [];

  let currentDate = new Date(Date.UTC(fechaDesde.getUTCFullYear(), fechaDesde.getUTCMonth(), 1));

  while (currentDate <= hasta) {
    const diasEnElMes = dias.filter(
      ({ fecha }) =>
        fecha.getUTCFullYear() == currentDate.getUTCFullYear() && fecha.getUTCMonth() == currentDate.getUTCMonth(),
    );

    const horasDeSuenio = diasEnElMes.reduce((acc, dia) => acc + obtenerHorasDeSuenio(dia), 0);
    suenioPorPeriodo.push({
      fecha: new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 10)),
      horasDeSuenio: horasDeSuenio / diasEnElMes.length,
    });
    currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
  }

  return suenioPorPeriodo;
};
