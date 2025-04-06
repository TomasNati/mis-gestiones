import { NextApiRequest, NextApiResponse } from 'next';
import { obtenerCategoriasDeMovimientos } from '../src/lib/orm/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const conceptos = await obtenerCategoriasDeMovimientos();
    if (conceptos) {
      res.status(200).json(conceptos);
    } else {
      res.status(404).json({ error: 'No se encontraron conceptos' });
    }
  } catch (error) {
    console.error('Error fetching movimientos:', error);
    res.status(500).json({ error: 'Error fetching movimientos' });
  }
}
