import { VencimientoPago, MovimientoDeVencimiento } from '@/lib/definitions';
import { obtenerMovimientosParaVencimientos} from '@/lib/orm/data'

export const obtenerMovimientosParaVencimientosUI = async (subcategoriaId: string, pago?: VencimientoPago) => {
  const posiblesMovimientos = await obtenerMovimientosParaVencimientos(subcategoriaId);
  if (pago && !posiblesMovimientos.find((m) => m.id === pago?.id)) {
    const pagoRelacionado: MovimientoDeVencimiento = {
      id: pago.id,
      fecha: pago.fecha,
      monto: pago.monto,
    };
    posiblesMovimientos.unshift(pagoRelacionado);
  }

  return posiblesMovimientos;
};
