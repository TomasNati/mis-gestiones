'use server';

import { z } from 'zod';
import {
  ImportarMovimientoUI,
  ImportarMovimientosResult,
  MovimientoGastoAImportar,
  MovimientoUI,
  ResultadoAPI,
  TipoDeMovimientoGasto,
} from './definitions';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { logMessage, mapearTiposDeConceptoExcelASubcategorias, transformCurrencyToNumber } from './helpers';

const FormSchema = z.object({
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

const CrearMovimiento = FormSchema.omit({ id: true });

export async function crearMovimientos(nuevosMovimientos: MovimientoUI[]) {
  const resultadoFinal: ResultadoAPI = {
    exitoso: true,
    errores: [],
  };

  for (const movimiento of nuevosMovimientos) {
    const mensajeError = await crearMovimiento(movimiento);
    if (mensajeError) {
      resultadoFinal.errores.push(`Error al crear el movimiento ${movimiento.filaId}. 
        Detalle: ${mensajeError}`);
      resultadoFinal.exitoso = false;
    }
  }
  //Revalidate the cache
  revalidatePath('/finanzas');
  revalidatePath('/finanzas/movimientosDelMes');
  return resultadoFinal;
}

export async function crearMovimiento(nuevoMovimiento: MovimientoUI) {
  let resultadoMensaje = '';

  const camposValidados = CrearMovimiento.safeParse(nuevoMovimiento);
  if (!camposValidados.success) {
    const errores = camposValidados.error.flatten().fieldErrors;
    resultadoMensaje = 'Hubo errores de validación.';
  } else {
    const { fecha, subcategoriaId, detalleSubcategoriaId, tipoDeGasto, monto, comentarios } = camposValidados.data;
    const fechaString = fecha.toISOString().replace('T', ' ');
    const detalleSubcategoriaIdFinal = detalleSubcategoriaId ? detalleSubcategoriaId : null;
    try {
      await sql`
      INSERT INTO misgestiones.finanzas_movimientogasto 
        (fecha, subcategoria, detallesubcategoria, tipodepago, monto, comentarios) 
      VALUES (${fechaString}, ${subcategoriaId}, ${detalleSubcategoriaIdFinal}, ${tipoDeGasto}, ${monto}, ${comentarios})
    `;
    } catch (error) {
      resultadoMensaje = `Error al insertar en base de datos: ${error}`;
    }
    resultadoMensaje && logMessage(resultadoMensaje, 'error');

    return resultadoMensaje;
  }
}

export const importarMovimientos = async (datos: ImportarMovimientoUI): Promise<ImportarMovimientosResult> => {
  const resultadoFinal: ImportarMovimientosResult = {
    lineasInvalidas: [],
    exitoso: true,
  };
  const movimientosExcel: MovimientoGastoAImportar[] = [];
  const textoAImportar = datos.textoAImportar;
  const lineas = textoAImportar.split('\n');

  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i];
    const secciones = linea.split('\t');
    if (secciones.length != 5) {
      resultadoFinal.lineasInvalidas.push({
        linea: linea,
        razon: 'La línea no tiene 5 columnas',
      });
      continue;
    }

    const { subcategoriaId, detalleSubcategoriaId, sinComentarios } = mapearTiposDeConceptoExcelASubcategorias(
      secciones[1],
      secciones[4],
    );
    if (!subcategoriaId) {
      resultadoFinal.lineasInvalidas.push({
        linea: linea,
        razon: 'No se encontró la subcategoría',
      });
      continue;
    }

    movimientosExcel.push({
      dia: parseInt(secciones[0]),
      subcategoria: subcategoriaId,
      detalleSubcategoria: detalleSubcategoriaId,
      tipoDePago: Object.keys(TipoDeMovimientoGasto)[
        Object.values(TipoDeMovimientoGasto).indexOf(secciones[2] as unknown as TipoDeMovimientoGasto)
      ] as TipoDeMovimientoGasto,
      monto: transformCurrencyToNumber(secciones[3]) || 0,
      comentarios: sinComentarios ? '' : secciones[4],
    });
  }

  console.log(resultadoFinal.lineasInvalidas);

  if (resultadoFinal.lineasInvalidas.length > 0) {
    resultadoFinal.exitoso = false;
    return Promise.resolve(resultadoFinal);
  }

  let insertScriptSQL =
    //'';
    `INSERT INTO misgestiones.finanzas_movimientogasto (fecha, subcategoria, detallesubcategoria, tipodepago, monto, comentarios) VALUES `;
  movimientosExcel.forEach((movimiento, index) => {
    const fecha = new Date(datos.anio, datos.mes - 1, movimiento.dia);
    const fechaString = fecha.toISOString().replace('T', ' ');
    insertScriptSQL += `('${fechaString}', '${movimiento.subcategoria}', ${
      movimiento.detalleSubcategoria ? `'${movimiento.detalleSubcategoria}'` : 'NULL'
    }, '${movimiento.tipoDePago}', ${movimiento.monto}, '${movimiento.comentarios}')${
      index < movimientosExcel.length - 1 ? ',' : ''
    }`;
  });

  resultadoFinal.script = insertScriptSQL;
  // try {
  //   await sql`INSERT INTO misgestiones.finanzas_movimientogasto
  //   (fecha, subcategoria, detallesubcategoria, tipodepago, monto, comentarios) VALUES
  //   ${insertScriptSQL}`;
  // } catch (error) {
  //   resultadoFinal.exitoso = false;
  //   resultadoFinal.lineasInvalidas.push({
  //     linea: '',
  //     razon: `Error al insertar en base de datos: ${error}`,
  //   });
  // }

  //Revalidate the cache
  revalidatePath('/finanzas');
  revalidatePath('/finanzas/movimientosDelMes');
  return Promise.resolve(resultadoFinal);
};
