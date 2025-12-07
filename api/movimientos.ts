import { NextApiRequest, NextApiResponse } from 'next';
import { obtenerMovimientos } from '../src/lib/orm/data';
import { MovimientoGastoGrilla } from '../src/lib/definitions';
import { setDateAsUTC } from '../src/lib/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { desde, hasta } = req.query;

  // Validate that both parameters are provided
  if (!desde || !hasta) {
    res.status(400).json({ error: 'Missing required parameters: desde and hasta' });
    return;
  }

  const desdeDate = setDateAsUTC(new Date(desde as string));
  desdeDate.setUTCHours(0, 0, 0, 0);
  const hastaDate = setDateAsUTC(new Date(hasta as string));
  hastaDate.setUTCHours(23, 59, 59, 999);
  const movimientos: MovimientoGastoGrilla[] = await obtenerMovimientos(undefined, desdeDate, hastaDate);

  if (movimientos) {
    res.status(200).json(movimientos);
  } else {
    res.status(404).json({ error: 'No se encontraron movimientos' });
  }
}
