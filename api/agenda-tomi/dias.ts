import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
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
      const agendaTomiDias = await obtenerAgendaTomiDias(new Date(desde), new Date(hasta));
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

  return {
    id,
    fecha: new Date(fecha), // Convert fecha to a Date object
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
