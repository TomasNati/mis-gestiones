import { SafeParseReturnType, z } from 'zod';
import { MovimientoUI } from '../definitions';

const FormMovimientoSchema = z.object({
  id: z.string(),
  comentarios: z.string().nullable().optional(),
  fecha: z.date({
    invalid_type_error: 'Por favor elegir una fecha',
  }),
  subcategoriaId: z.string(),
  detalleSubcategoriaId: z.string().nullable().optional(),
  tipoDeGasto: z.enum(['Credito', 'Debito', 'Efectivo'], {
    invalid_type_error: 'Por favor elegir un tipo de gasto',
  }),
  monto: z.coerce.number().gt(0, { message: 'Por favor ingresar un monto mayor a $0.' }),
});
type FormMovimiento = z.infer<typeof FormMovimientoSchema>;
type SafeParseTypeEditMovimiento = SafeParseReturnType<FormMovimiento, FormMovimiento>;

const CrearMovimientoSchema = FormMovimientoSchema.omit({ id: true });

type CrearMovimiento = z.infer<typeof CrearMovimientoSchema>;
type SafeParseCrearMovimiento = SafeParseReturnType<CrearMovimiento, CrearMovimiento>;

const GastoEstimadoSchema = z.object({
  id: z.string(),
  subcategoria: z.string(),
  fecha: z.date({
    invalid_type_error: 'Por favor elegir una fecha',
  }),
  monto: z.coerce.number().gte(0, { message: 'Por favor ingresar un monto mayor o igual a $0.' }),
  comentarios: z.string().optional(),
});
type GastoEstimado = z.infer<typeof GastoEstimadoSchema>;
type SafeParseTypeEditarGastoEstimado = SafeParseReturnType<GastoEstimado, GastoEstimado>;

const CrearGastoEstimadoSchema = GastoEstimadoSchema.omit({ id: true });

type CrearGastoEstimado = z.infer<typeof CrearGastoEstimadoSchema>;
type SafeParseCrearGastoEstimado = SafeParseReturnType<CrearGastoEstimado, CrearGastoEstimado>;

const processErrors = (error: z.ZodError) => {
  const errores = error.flatten().fieldErrors;
  return Object.entries(errores)
    .map(([campo, mensajes]) => `${campo}: ${mensajes?.join(', ')}`)
    .join('; ');
};

export const validarCrearMovimiento = (movimiento: MovimientoUI): [SafeParseCrearMovimiento, string] => {
  const result = CrearMovimientoSchema.safeParse(movimiento);
  let errors = '';
  if (!result.success) {
    errors = processErrors(result.error);
  }
  return [result, errors];
};

export const validarActualizarMovimiento = (movimiento: MovimientoUI): [SafeParseTypeEditMovimiento, string] => {
  const result = FormMovimientoSchema.safeParse(movimiento);
  let errors = '';
  if (!result.success) {
    errors = processErrors(result.error);
  }
  return [result, errors];
};

export const validarCrearGastoEstimado = (gastoEstimado: any): [SafeParseCrearGastoEstimado, string] => {
  const result = CrearGastoEstimadoSchema.safeParse(gastoEstimado);
  let errors = '';
  if (!result.success) {
    const errores = result.error.flatten().fieldErrors;
    errors = processErrors(result.error);
  }
  return [result, errors];
};

export const validarActualizarGastoEstimado = (gastoEstimado: any): [SafeParseTypeEditarGastoEstimado, string] => {
  const result = GastoEstimadoSchema.safeParse(gastoEstimado);
  let errors = '';
  if (!result.success) {
    errors = processErrors(result.error);
  }
  return [result, errors];
};
