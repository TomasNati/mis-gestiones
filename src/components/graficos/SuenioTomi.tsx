import { useEffect } from 'react';
import { useState } from 'react';
import { AgendaTomiDia } from '@/lib/definitions';
import { obtenerAgendaTomiDias } from '@/lib/orm/data';

interface SuenioTomiProps {
  desde: Date;
  hasta: Date;
}
const SuenioTomi = ({ desde, hasta }: SuenioTomiProps) => {
  const [dias, setDias] = useState<AgendaTomiDia[]>([]);

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      const datos = await obtenerAgendaTomiDias(desde, hasta);
      setDias(datos);
    };
    obtenerDatosIniciales();
  }, []);
};

export { SuenioTomi };
