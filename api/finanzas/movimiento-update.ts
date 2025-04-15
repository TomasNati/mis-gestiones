import { NextApiRequest, NextApiResponse } from 'next';
import { MovimientoPayloadMobile, MovimientoUI, ResultadoAPI, ResultadoAPICrear } from '../../src/lib/definitions';
import { crearMovimientos, actualizarMovimiento, eliminarMovimientos } from '../../src/lib/orm/actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
      return;
    }

    const movimientos: MovimientoPayloadMobile[] = req.body;

    if (!Array.isArray(movimientos)) {
      res.status(400).json({ error: 'Request body must be an array of MovimientoPayloadMobile' });
      return;
    }

    // Separate movimientos by state
    const addedMovimientos = movimientos.filter((mov) => mov.state === 'added');
    const updatedMovimientos = movimientos.filter((mov) => mov.state === 'updated');
    const deletedMovimientos = movimientos.filter((mov) => mov.state === 'deleted');

    // Map to MovimientoUI
    const addedMovimientoUI = addedMovimientos.map(mapToMovimientoUI);
    const updatedMovimientoUI = updatedMovimientos.map(mapToMovimientoUI);
    const deletedMovimientoIds = deletedMovimientos.map((mov) => mov.id);

    // Process each group
    const results: { added?: ResultadoAPICrear; updated?: ResultadoAPI[]; deleted?: ResultadoAPI } = {};

    if (addedMovimientoUI.length > 0) {
      results.added = await crearMovimientos(addedMovimientoUI, false);
    }

    if (updatedMovimientoUI.length > 0) {
      results.updated = await Promise.all(updatedMovimientoUI.map((mov) => actualizarMovimiento(mov, false)));
    }

    if (deletedMovimientoIds.length > 0) {
      results.deleted = await eliminarMovimientos(deletedMovimientoIds, false);
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const mapToMovimientoUI = (payload: MovimientoPayloadMobile): MovimientoUI => {
  const { id, fecha, concepto, tipoDeGasto, monto, comentarios, state } = payload;

  if (!fecha) {
    throw new Error('Fecha is required');
  }

  return {
    id: state === 'added' ? undefined : id,
    fecha: new Date(fecha),
    subcategoriaId: concepto.subcategoriaId,
    detalleSubcategoriaId: concepto.detalleSubcategoriaId,
    tipoDeGasto,
    monto,
    comentarios,
    valido: true,
    filaId: 0,
  };
};
