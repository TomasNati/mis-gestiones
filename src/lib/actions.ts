'use server';

import { z } from 'zod';
import { MovimientoUI, ResultadoAPI } from './definitions';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { logMessage } from './helpers';

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
