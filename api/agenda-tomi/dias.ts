import { NextApiRequest, NextApiResponse } from 'next';
import { actualizarAgendaTomiDia } from '../../src/lib/orm/actions';
import { obtenerAgendaTomiDias } from '../../src/lib/orm/data';
import { validarRangoFechas } from '../../src/lib/orm/validaciones';
import { AgendaTomiDia } from '../../src/lib/definitions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Validate query parameters
      const { desde: desdeString, hasta: hastaString } = req.query;
      const [result, error] = validarRangoFechas({
        desde: (desdeString as string) || '',
        hasta: (hastaString as string) || '',
      });
      if (!result.success) {
        return res.status(400).json({ error: error });
      }

      const { desde, hasta } = result.data;

      // Call obtenerAgendaTomiDias
      const desdeUTC = new Date(desde);
      desdeUTC.setUTCHours(0, 0, 0, 0);

      const hastaUTC = new Date(hasta);
      hastaUTC.setUTCHours(23, 59, 59, 999);
      const agendaTomiDias = await obtenerAgendaTomiDias(desdeUTC, hastaUTC);
      return res.status(200).json(agendaTomiDias);
    }

    if (req.method === 'POST') {
      const dia = parseAgendaTomiDiaFromBody(req.body);
      const resultado = await actualizarAgendaTomiDia(dia);
      if (!resultado.exitoso) {
        return res.status(400).json({ error: resultado.errores });
      }

      return res.status(200).json({ message: 'Agenda Tomi Dia updated successfully' });
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

const parseAgendaTomiDiaFromBody = (body: any): AgendaTomiDia => {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const { id, fecha, comentarios, eventos, esNuevo } = body;

  if (!fecha) {
    throw new Error('The "fecha" field is required');
  }

  const fechaUTC = new Date(fecha);
  fechaUTC.setUTCHours(0, 0, 0, 0);

  return {
    id,
    fecha: fechaUTC,
    comentarios: comentarios || '',
    eventos: Array.isArray(eventos)
      ? eventos.map((evento) => ({
          id: evento.id,
          hora: evento.hora,
          tipo: evento.tipo,
          comentarios: evento.comentarios || '',
          tipoDeActualizacion: evento.tipoDeActualizacion,
        }))
      : [],
    esNuevo: esNuevo || false,
  };
};
