import { SafeParseReturnType, z } from 'zod';
import { MovimientoUI, AgendaTomiDia, EventoSuenio } from '../definitions';

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

const VencimientoSchema = z.object({
  id: z.string(),
  subcategoria: z.string(),
  fecha: z.date({
    invalid_type_error: 'Por favor elegir una fecha',
  }),
  monto: z.coerce.number().gte(0, { message: 'Por favor ingresar un monto mayor o igual a $0.' }),
  comentarios: z.string().optional(),
  esAnual: z.boolean(),
  pago: z.string(),
});

type Vencimiento = z.infer<typeof VencimientoSchema>;
type SafeParseTypeEditVencimiento = SafeParseReturnType<Vencimiento, Vencimiento>;

const CrearVencimientoSchema = VencimientoSchema.omit({ id: true });

type CrearVencimiento = z.infer<typeof CrearVencimientoSchema>;
type SafeParseCrearVencimiento = SafeParseReturnType<CrearVencimiento, CrearVencimiento>;

const TipoEventoSuenioSchema = z.enum(['Despierto', 'Dormido']);

const EventoSuenioSchema = z.object({
  id: z.string(),
  hora: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora debe tener el formato hh:mm (24 horas)',
  }), // Validate "hh:mm" format
  comentarios: z.string().optional(),
  tipo: TipoEventoSuenioSchema,
  tipoDeActualizacion: z.enum(['nuevo', 'modificado', 'eliminado']).optional(),
});

const CrearEventoSuenioSchema = EventoSuenioSchema.omit({ id: true });

const AgendaTomiDiaSchema = z.object({
  id: z.string(),
  fecha: z.date(),
  comentarios: z.string().optional(),
  eventos: z.array(EventoSuenioSchema),
  esNuevo: z.boolean().optional(),
});

const CrearAgendaTomiDiaSchema = AgendaTomiDiaSchema.omit({ id: true }).extend({
  eventos: z.array(CrearEventoSuenioSchema),
});

type CrearAgendaTomiDia = z.infer<typeof CrearAgendaTomiDiaSchema>;
type EditarAgendaTomiDia = z.infer<typeof AgendaTomiDiaSchema>;
type SafeParseCrearAgendaTomiDia = SafeParseReturnType<CrearAgendaTomiDia, CrearAgendaTomiDia>;
type SafeParseEditarAgendaTomiDia = SafeParseReturnType<EditarAgendaTomiDia, EditarAgendaTomiDia>;

type CrearEventoSuenio = z.infer<typeof CrearEventoSuenioSchema>;
type EditarEventoSuenio = z.infer<typeof EventoSuenioSchema>;
type SafeParseTypeCrearEventoSuenio = SafeParseReturnType<CrearEventoSuenio, CrearEventoSuenio>;
type SafeParseEditarEventoSuenio = SafeParseReturnType<EditarEventoSuenio, EditarEventoSuenio>;

const processErrors = (error: z.ZodError) => {
  const errores = error.flatten().fieldErrors;
  return Object.entries(errores)
    .map(([campo, mensajes]) => `${campo}: ${mensajes?.join(', ')}`)
    .join('; ');
};

export const validarCrearAgendaTomiDia = (agenda: AgendaTomiDia): [SafeParseCrearAgendaTomiDia, string] => {
  const result = CrearAgendaTomiDiaSchema.safeParse(agenda);
  let errors = '';
  if (!result.success) {
    errors = processErrors(result.error);
  }
  return [result, errors];
};

export const validarActualizarAgendaTomiDia = (agenda: AgendaTomiDia): [SafeParseEditarAgendaTomiDia, string] => {
  const result = AgendaTomiDiaSchema.safeParse(agenda);
  let errors = '';
  if (!result.success) {
    errors = processErrors(result.error);
  }
  return [result, errors];
};

export const validarCrearEventoSuenio = (evento: EventoSuenio): [SafeParseTypeCrearEventoSuenio, string] => {
  const result = EventoSuenioSchema.safeParse(evento);
  let errors = '';
  if (!result.success) {
    errors = processErrors(result.error);
  }
  return [result, errors];
};

export const validarActualizarEventoSuenio = (evento: EventoSuenio): [SafeParseEditarEventoSuenio, string] => {
  const result = EventoSuenioSchema.safeParse(evento);
  let errors = '';
  if (!result.success) {
    errors = processErrors(result.error);
  }
  return [result, errors];
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

export const validarCrearVencimiento = (vencimiento: any): [SafeParseCrearVencimiento, string] => {
  const result = CrearVencimientoSchema.safeParse(vencimiento);
  let errors = '';
  if (!result.success) {
    errors = processErrors(result.error);
  }
  return [result, errors];
};

export const validarActualizarVencimiento = (vencimiento: any): [SafeParseTypeEditVencimiento, string] => {
  const result = VencimientoSchema.safeParse(vencimiento);
  let errors = '';
  if (!result.success) {
    errors = processErrors(result.error);
  }
  return [result, errors];
};

// Schema for validating query parameters
const dateRangeSchema = z.object({
  desde: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'desde must be a valid date',
  }),
  hasta: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'hasta must be a valid date',
  }),
});

type DateRange = z.infer<typeof dateRangeSchema>;
type SafeParseDateRange = SafeParseReturnType<DateRange, DateRange>;

export const validarRangoFechas = (query: { desde: string; hasta: string }): [SafeParseDateRange, string] => {
  const result = dateRangeSchema.safeParse(query);
  let errors = '';
  if (!result.success) {
    errors = processErrors(result.error);
  }
  return [result, errors];
};
