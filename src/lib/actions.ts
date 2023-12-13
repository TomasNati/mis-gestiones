'use server';

import { z } from 'zod';

// const FormSchema = z.object({
//   id: z.string(),
//   fecha: z.date({
//     invalid_type_error: 'Por favor elegir una fecha',
//   }),
//   amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
//   status: z.enum(['pending', 'paid'], {
//     invalid_type_error: 'Please select an invoice status.',
//   }),
//   date: z.string(),
// });

export async function crearMovimiento(formData: FormData) {
  const rawFormData = {
    fechaElegida: formData.get('fechaElegida'),
    concepto: formData.get('concepto'),
    tipoDePago: formData.get('tipoDePago'),
    monto: formData.get('monto'),
    detalle: formData.get('detalle'),
  };
  // Test it out:
  console.log(rawFormData);
}
