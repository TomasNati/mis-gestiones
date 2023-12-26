'use server';

import { z } from 'zod';
import { MovimientoUI, ResultadoAPI } from './definitions';

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
  nuevosMovimientos.forEach(async (movimiento: MovimientoUI) => {
    const resultado = await crearMovimiento(movimiento);
    if (!resultado) {
      resultadoFinal.errores.push(`Error al crear el movimiento ${movimiento.filaId}`);
      resultadoFinal.exitoso = false;
    }
  });

  return resultadoFinal;
}

export async function crearMovimiento(nuevoMovimiento: MovimientoUI) {
  const camposValidados = CrearMovimiento.safeParse(nuevoMovimiento);
  if (!camposValidados.success) {
    const errores = camposValidados.error.flatten().fieldErrors;
    console.log(errores);
    return Promise.resolve(false);
  } else {
    const movimiento = camposValidados.data;
    console.log(movimiento);
    return Promise.resolve(true);
  }
}
