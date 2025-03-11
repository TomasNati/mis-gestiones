'use server';

import { z } from 'zod';
import { between, eq, inArray } from 'drizzle-orm';
import {
  ImportarMovimientoUI,
  ImportarResult,
  MovimientoGastoAImportar,
  MovimientoUI,
  ResultadoAPI,
  MovimientoGastoInsertarDB,
  ImportarUI,
  conceptoExcelGastosEstimadosTemplate,
  ConceptoExcelGastosEstimadoFila,
  GastoEstimadoItemDelMes,
  GastoEstimadoDB,
  ResultadoAPICrear,
  ResultadoCrearMovimiento,
} from '../definitions';
import { revalidatePath } from 'next/cache';
import {
  generateUUID,
  logMessage,
  mapearTiposDeConceptoExcelASubcategorias,
  obtenerTipoDeMovimientoGasto,
  parseTextoSuenioTomi,
  transformCurrencyToNumber,
} from '../helpers';
import { db } from './database';
import {
  GastoEstimadoAInsertarDB,
  TomiAgendaEventoSuenioDB,
  gastoEstimado,
  movimientosGasto,
  tomiAgendaDia,
  tomiAgendaEventoSuenio,
} from './tables';
import { error } from 'console';

const FormMovimientoSchema = z.object({
  id: z.string(),
  comentarios: z.string().optional(),
  fecha: z.date({
    invalid_type_error: 'Por favor elegir una fecha',
  }),
  subcategoriaId: z.string(),
  detalleSubcategoriaId: z.string().optional(),
  tipoDeGasto: z.enum(['Credito', 'Debito', 'Efectivo'], {
    invalid_type_error: 'Por favor elegir un tipo de gasto',
  }),
  monto: z.coerce.number().gt(0, { message: 'Por favor ingresar un monto mayor a $0.' }),
});

const CrearMovimiento = FormMovimientoSchema.omit({ id: true });

const GastoEstimadoSchema = z
  .object({
    id: z.string(),
    subcategoria: z.string(),
    fecha: z.date({
      invalid_type_error: 'Por favor elegir una fecha',
    }),
    monto: z.coerce.number().gte(0, { message: 'Por favor ingresar un monto mayor o igual a $0.' }),
    comentarios: z.string().optional(),
  })
  .omit({ id: true });

export async function crearMovimientos(nuevosMovimientos: MovimientoUI[]) {
  const resultadoFinal: ResultadoAPICrear = {
    exitoso: true,
    errores: [],
    idsCreados: [],
  };

  for (const movimiento of nuevosMovimientos) {
    const { error, id } = await crearMovimiento(movimiento);
    if (error) {
      resultadoFinal.errores.push(`Error al crear el movimiento ${movimiento.filaId}. 
        Detalle: ${error}`);
      resultadoFinal.exitoso = false;
    } else if (id) {
      resultadoFinal.idsCreados.push(id);
    }
  }
  //Revalidate the cache
  revalidatePath('/finanzas');
  revalidatePath('/finanzas/movimientosDelMes');
  return resultadoFinal;
}

export async function eliminarMovimientos(ids: string[]) {
  const resultadoFinal: ResultadoAPI = {
    exitoso: true,
    errores: [],
  };

  let resultadoMensaje = '';

  try {
    await db.delete(movimientosGasto).where(inArray(movimientosGasto.id, ids));
  } catch (error: unknown) {
    if (error instanceof Error) {
      resultadoMensaje = `Error al eliminar movimientos: ${error.message}.\n ${error.stack}`;
    } else {
      resultadoMensaje = ` Error al eliminar movimientos ${error}.\n`;
    }
    resultadoFinal.errores.push(resultadoMensaje);
  }
  //Revalidate the cache
  revalidatePath('/finanzas');
  revalidatePath('/finanzas/movimientosDelMes');
  return resultadoFinal;
}

export async function actualizarMovimiento(movimiento: MovimientoUI): Promise<ResultadoAPI> {
  const resultadoFinal: ResultadoAPI = {
    exitoso: true,
    errores: [],
  };
  let resultadoMensaje = '';

  const camposValidados = CrearMovimiento.safeParse(movimiento);
  if (!camposValidados.success) {
    const errores = camposValidados.error.flatten().fieldErrors;
    resultadoMensaje = 'Hubo errores de validación.';
  } else if (!movimiento.id) {
    resultadoMensaje = 'El movimiento a actualizar no tiene id';
  } else {
    const { fecha, subcategoriaId, detalleSubcategoriaId, tipoDeGasto, monto, comentarios } = camposValidados.data;
    const fechaString = fecha.toISOString().replace('T', ' ');
    const detalleSubcategoriaIdFinal = detalleSubcategoriaId ? detalleSubcategoriaId : null;

    try {
      await db
        .update(movimientosGasto)
        .set({
          fecha: new Date(fechaString),
          monto: monto.toString(),
          subcategoria: subcategoriaId,
          detallesubcategoria: detalleSubcategoriaIdFinal,
          tipodepago: tipoDeGasto,
          comentarios: comentarios || null,
        })
        .where(eq(movimientosGasto.id, movimiento.id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        resultadoMensaje = `Error al actualizar en base de datos: ${error.message}.\n ${error.stack}`;
      } else {
        resultadoMensaje = ` Error al actualizr en base de datos: ${error}.\n`;
      }
    }
    resultadoMensaje && logMessage(resultadoMensaje, 'error');

    if (resultadoMensaje) {
      resultadoFinal.errores.push(resultadoMensaje);
      resultadoFinal.exitoso = false;
    }
  }
  //Revalidate the cache
  revalidatePath('/finanzas');
  revalidatePath('/finanzas/movimientosDelMes');
  revalidatePath('/finanzas/presupuestoDelMes');
  return resultadoFinal;
}

export async function crearMovimiento(nuevoMovimiento: MovimientoUI): Promise<ResultadoCrearMovimiento> {
  const resultado: ResultadoCrearMovimiento = {};

  const camposValidados = CrearMovimiento.safeParse(nuevoMovimiento);
  if (!camposValidados.success) {
    const errores = camposValidados.error.flatten().fieldErrors;
    resultado.error = 'Hubo errores de validación.';
  } else {
    const { fecha, subcategoriaId, detalleSubcategoriaId, tipoDeGasto, monto, comentarios } = camposValidados.data;
    const fechaString = fecha.toISOString().replace('T', ' ');
    const detalleSubcategoriaIdFinal = detalleSubcategoriaId ? detalleSubcategoriaId : null;

    try {
      const newId = await db
        .insert(movimientosGasto)
        .values({
          fecha: new Date(fechaString),
          monto: monto.toString(),
          subcategoria: subcategoriaId,
          detallesubcategoria: detalleSubcategoriaIdFinal,
          tipodepago: tipoDeGasto,
          comentarios: comentarios || null,
        })
        .returning({ insertedId: movimientosGasto.id });

      resultado.id = newId[0].insertedId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        resultado.error = `Error al insertar en base de datos: ${error.message}.\n ${error.stack}`;
      } else {
        resultado.error = ` Error al insertar en base de datos: ${error}.\n`;
      }
    }
    resultado.error && logMessage(resultado.error, 'error');
  }
  return resultado;
}

export const importarDatos = async (datos: ImportarUI): Promise<ImportarResult> => {
  if (datos.tipo === 'Gastos del mes') {
    return await importarMovimientos(datos);
  } else if (datos.tipo === 'Presupuesto del mes') {
    return await importarPresupuestos(datos);
  } else if (datos.tipo === 'Horas sueño Tomi') {
    return await importarHorasSuenioTomi(datos);
  } else {
    return Promise.resolve({ exitoso: false, lineasInvalidas: [] });
  }
};

const importarPresupuestos = async (datos: ImportarUI): Promise<ImportarResult> => {
  const resultadoFinal: ImportarResult = {
    lineasInvalidas: [],
    exitoso: true,
  };

  const textoAImportar = datos.textoAImportar;
  const lineas = textoAImportar.split('\n');

  const conceptoExcelGastosEstimados: ConceptoExcelGastosEstimadoFila[] = JSON.parse(
    JSON.stringify(conceptoExcelGastosEstimadosTemplate),
  );

  if (lineas.length !== conceptoExcelGastosEstimados.length) {
    resultadoFinal.exitoso = false;
    resultadoFinal.lineasInvalidas.push({
      linea: '',
      razon: `El archivo debe tener ${conceptoExcelGastosEstimados.length} líneas`,
    });
    logMessage(`El archivo debe tener ${conceptoExcelGastosEstimados.length} líneas`, 'error');
    return Promise.resolve(resultadoFinal);
  }

  for (let i = 0; i < lineas.length; i++) {
    try {
      const monto = transformCurrencyToNumber(lineas[i].replace(',', ''));
      if (monto == null && conceptoExcelGastosEstimados[i].tipo !== 'XXXX') {
        throw new Error('No es un número');
      }
      conceptoExcelGastosEstimados[i].monto = monto === null ? undefined : monto;
    } catch (error) {
      resultadoFinal.lineasInvalidas.push({
        linea: i.toString(),
        razon: `El monto ${lineas[i]} no es un número`,
      });
      logMessage(`El monto ${lineas[i]} no es un número`, 'error');
      continue;
    }
  }

  resultadoFinal.exitoso = resultadoFinal.lineasInvalidas.length === 0;
  resultadoFinal.temporal = conceptoExcelGastosEstimados;
  if (!resultadoFinal.exitoso) {
    logMessage(`Hubo ${resultadoFinal.lineasInvalidas.length} líneas inválidas`, 'error');
    return Promise.resolve(resultadoFinal);
  }

  const gastosEstimadosAInsertar: GastoEstimadoAInsertarDB[] = conceptoExcelGastosEstimados
    .filter((gasto) => gasto.tipo == 'subcategoria' && gasto.monto !== undefined && gasto.subcategoriaId !== undefined)
    .map((gasto) => ({
      fecha: new Date(Date.UTC(datos.anio, datos.mes - 1, 1, 0, 0, 0, 0)),
      monto: gasto.monto?.toString() || '',
      subcategoria: gasto.subcategoriaId || '',
      comentarios: null,
    }));

  try {
    await db.insert(gastoEstimado).values(gastosEstimadosAInsertar);
  } catch (error: unknown) {
    if (error instanceof Error) {
      resultadoFinal.error = `Error al insertar en base de datos: ${error.message}.\n ${error.stack}`;
    } else {
      resultadoFinal.error = ` Error al insertar en base de datos: ${error}.\n`;
    }
  }
  if (resultadoFinal.error) {
    logMessage(resultadoFinal.error, 'error');
    resultadoFinal.exitoso = false;
  }

  //Revalidate the cache
  revalidatePath('/finanzas');
  revalidatePath('/finanzas/presupuestoDelMes');

  return resultadoFinal;
};

const importarMovimientos = async (datos: ImportarMovimientoUI): Promise<ImportarResult> => {
  const resultadoFinal: ImportarResult = {
    lineasInvalidas: [],
    exitoso: true,
  };
  const movimientosExcel: MovimientoGastoAImportar[] = [];
  const textoAImportar = datos.textoAImportar;
  const lineas = textoAImportar.split('\n');

  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i];
    const secciones = linea.split('\t');
    if (secciones.length !== 5) {
      resultadoFinal.lineasInvalidas.push({
        linea: linea,
        razon: 'La línea no tiene 5 columnas',
      });
      continue;
    }

    const [dia, tipoDeConcepto, tipoDePago, monto, comentario] = secciones;

    const { subcategoriaId, detalleSubcategoriaId, sinComentarios } = mapearTiposDeConceptoExcelASubcategorias(
      tipoDeConcepto,
      comentario,
    );
    if (!subcategoriaId) {
      resultadoFinal.lineasInvalidas.push({
        linea: linea,
        razon: 'No se encontró la subcategoría',
      });
      logMessage(
        `No se encontró la subcategoría para la línea ${
          i + 1
        }. Tipo de concepto: ${tipoDeConcepto}. Comentario: ${comentario}`,
        'error',
      );
      continue;
    }

    movimientosExcel.push({
      dia: parseInt(dia),
      subcategoria: subcategoriaId,
      detalleSubcategoria: detalleSubcategoriaId,
      tipoDePago: obtenerTipoDeMovimientoGasto(tipoDePago),
      monto: transformCurrencyToNumber(monto) || 0,
      comentarios: sinComentarios ? '' : comentario,
    });
  }

  if (resultadoFinal.lineasInvalidas.length > 0) {
    resultadoFinal.exitoso = false;
    logMessage(`Hubo ${resultadoFinal.lineasInvalidas.length} líneas inválidas`, 'error');
    return Promise.resolve(resultadoFinal);
  }

  const movimientosAInsertar: MovimientoGastoInsertarDB[] = movimientosExcel.map((movimiento) => ({
    fecha: new Date(Date.UTC(datos.anio, datos.mes - 1, movimiento.dia, 0, 0, 0, 0)),
    monto: movimiento.monto.toString(),
    subcategoria: movimiento.subcategoria,
    detallesubcategoria: movimiento.detalleSubcategoria || null,
    tipodepago: movimiento.tipoDePago,
    comentarios: movimiento.comentarios || null,
  }));

  try {
    await db.insert(movimientosGasto).values(movimientosAInsertar);
  } catch (error: unknown) {
    if (error instanceof Error) {
      resultadoFinal.error = `Error al insertar en base de datos: ${error.message}.\n ${error.stack}`;
    } else {
      resultadoFinal.error = ` Error al insertar en base de datos: ${error}.\n`;
    }
  }
  if (resultadoFinal.error) {
    logMessage(resultadoFinal.error, 'error');
    resultadoFinal.exitoso = false;
  }

  //Revalidate the cache
  revalidatePath('/finanzas');
  revalidatePath('/finanzas/movimientosDelMes');
  return Promise.resolve(resultadoFinal);
};

const eliminarHorasSuenioTomi = async (anio: number, mes: number): Promise<void> => {
  try {
    const fechaDesde = new Date(Date.UTC(anio, mes - 1, 1, 0, 0, 0));
    const fechaHasta = new Date(Date.UTC(anio, mes, 0, 23, 59, 59));

    const ids = await db
      .select({ id: tomiAgendaDia.id })
      .from(tomiAgendaDia)
      .where(between(tomiAgendaDia.fecha, fechaDesde, fechaHasta));

    const idsArray = ids.map((record) => record.id);

    if (idsArray.length === 0) return Promise.resolve();

    await db.delete(tomiAgendaEventoSuenio).where(inArray(tomiAgendaEventoSuenio.dia, idsArray));
    await db.delete(tomiAgendaDia).where(inArray(tomiAgendaDia.id, idsArray));
  } catch (error: unknown) {
    return Promise.reject(error);
  }
  return Promise.resolve();
};

const importarHorasSuenioTomi = async ({ anio, mes, textoAImportar }: ImportarUI): Promise<ImportarResult> => {
  const resultadoFinal: ImportarResult = {
    lineasInvalidas: [],
    exitoso: true,
  };

  // Validate input
  if (mes < 1 || mes > 12) {
    resultadoFinal.error = 'El mes debe ser un número entre 1 y 12';
    resultadoFinal.exitoso = false;
    logMessage(resultadoFinal.error, 'error');
    return Promise.resolve(resultadoFinal);
  }

  const daysInMonth = new Date(anio, mes, 0).getDate();
  const datosAImportar = parseTextoSuenioTomi(textoAImportar);

  try {
    // Borro datos previos
    await eliminarHorasSuenioTomi(anio, mes);

    const registrosAInsertarDias = [];

    // Iterate over each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      // Create a date object for the current day
      const fecha = new Date(Date.UTC(anio, mes - 1, day));
      const diaIndex = day - 1; // Convert to 0-based index

      registrosAInsertarDias.push({
        id: datosAImportar[diaIndex]?.id || generateUUID(),
        fecha,
      });
    }

    await db.insert(tomiAgendaDia).values(registrosAInsertarDias);

    const eventosAImportar: { dia: string; hora: string; tipo: string }[] = [];

    datosAImportar.forEach((dia, diaIndex) => {
      if (dia?.eventos?.length > 0) {
        dia.eventos.forEach((evento) => {
          const eventoDB = {
            dia: datosAImportar[diaIndex].id,
            hora: evento.tiempo,
            tipo: evento.tipo === 'DOR' ? 'Dormido' : 'Despierto',
          };
          eventosAImportar.push(eventoDB);
        });
      }
    });

    await db.insert(tomiAgendaEventoSuenio).values(eventosAImportar);
  } catch (error: unknown) {
    if (error instanceof Error) {
      resultadoFinal.error = `Error al insertar en base de datos: ${error.message}.\n ${error.stack}`;
    } else {
      resultadoFinal.error = ` Error al insertar en base de datos: ${error}.\n`;
    }
  }
  if (resultadoFinal.error) {
    logMessage(resultadoFinal.error, 'error');
    resultadoFinal.exitoso = false;
  }

  return Promise.resolve(resultadoFinal);
};

export const persistirGastoEstimado = async ({
  id,
  subcategoriaId,
  monto,
  mes,
  anio,
}: GastoEstimadoDB): Promise<{ error: string; id: string | null }> => {
  const resultado: { error: string; id: string | null } = {
    error: '',
    id: null,
  };

  const utcToday = new Date(Date.UTC(anio, mes, 1, 11, 0, 0));

  const objetoGastoEstimado = {
    id,
    subcategoria: subcategoriaId,
    fecha: utcToday,
    monto,
  };

  const camposValidados = GastoEstimadoSchema.safeParse(objetoGastoEstimado);
  if (!camposValidados.success) {
    const errores = camposValidados.error.flatten().fieldErrors;
    resultado.error = `Hubo errores de validación: ${errores}`;
  } else {
    try {
      if (objetoGastoEstimado.id) {
        await db
          .update(gastoEstimado)
          .set({
            monto: objetoGastoEstimado.monto.toString(),
          })
          .where(eq(gastoEstimado.id, objetoGastoEstimado.id));
        resultado.id = objetoGastoEstimado.id;
      } else {
        const newId = await db
          .insert(gastoEstimado)
          .values({
            ...objetoGastoEstimado,
            monto: objetoGastoEstimado.monto.toString(),
            comentarios: null,
          })
          .returning({ insertedId: gastoEstimado.id });
        resultado.id = newId[0].insertedId;
      }
      revalidatePath('/finanzas/presupuestoDelMes');
    } catch (error: unknown) {
      if (error instanceof Error) {
        resultado.error = `Error al insertar en base de datos: ${error.message}.\n ${error.stack}`;
      } else {
        resultado.error = ` Error al insertar en base de datos: ${error}.\n`;
      }
    }
  }

  return resultado;
};
