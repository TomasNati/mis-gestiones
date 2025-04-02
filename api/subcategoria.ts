import { NextApiRequest, NextApiResponse } from 'next';
import { obtenerSubCategorias } from '../src/lib/orm/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const subcategorias = await obtenerSubCategorias();
  if (subcategorias) {
    res.status(200).json(subcategorias);
  } else {
    res.status(404).json({ error: 'No se encontraron subcategorías' });
  }
}
