import { NextApiRequest, NextApiResponse } from 'next';
import { MovimientoUI, ResultadoAPI, ResultadoAPICrear } from '../../src/lib/definitions';
import { crearMovimientos, actualizarMovimiento, eliminarMovimientos } from '../../src/lib/orm/actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    switch (req.method) {
      case 'POST': // Create
        const movimientoData: MovimientoUI = createMovimientoFromBody(req.body);
        if (!movimientoData) {
          res.status(400).json({ error: 'Movimiento data is required' });
          return;
        }
        const createdMovimiento: ResultadoAPICrear = await crearMovimientos([movimientoData], false);
        if (!createdMovimiento) {
          res.status(500).json({ error: 'Failed to create movimiento' });
          return;
        }
        res.status(201).json(createdMovimiento);
        break;

      case 'PUT': // Update
        const updatedMovimientoData: MovimientoUI = createMovimientoFromBody(req.body);
        if (!updatedMovimientoData) {
          res.status(400).json({ error: 'Movimiento data is required' });
          return;
        }
        const updatedMovimiento: ResultadoAPI = await actualizarMovimiento(updatedMovimientoData);
        if (!updatedMovimiento) {
          res.status(500).json({ error: 'Failed to update movimiento' });
          return;
        }
        res.status(200).json(updatedMovimiento);
        break;

      case 'DELETE': // Delete
        const { id } = req.query; // Assuming the ID is passed as a query parameter
        if (!id) {
          res.status(400).json({ error: 'ID is required for deletion' });
          return;
        }
        const deleteMovimiento: ResultadoAPI = await eliminarMovimientos([id as string]);
        if (!deleteMovimiento) {
          res.status(500).json({ error: 'Failed to delete movimiento' });
          return;
        }
        res.status(200).json(deleteMovimiento);
        break;

      default:
        res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const createMovimientoFromBody = (body: any): MovimientoUI => {
  if (!body) {
    throw new Error('Request body is missing');
  }

  const { id, fecha, subcategoriaId, detalleSubcategoriaId, tipoDeGasto, monto, comentarios } = body;

  if (!fecha) {
    throw new Error('Fecha is required');
  }

  return {
    id: id || undefined, // Optional ID for updates
    fecha: new Date(fecha), // Convert fecha string to Date object
    subcategoriaId,
    detalleSubcategoriaId: detalleSubcategoriaId || null, // Default to null if not provided
    tipoDeGasto,
    monto: parseFloat(monto), // Ensure monto is a number
    comentarios: comentarios || null, // Default to null if not provided
    valido: true,
    filaId: 0,
  };
};
