import { useEffect } from 'react';
import { useState } from 'react';
import { AgendaTomiDia } from '@/lib/definitions';
import { obtenerAgendaTomiDias } from '@/lib/orm/data';
import { formatDate, timeStringToMinutes } from '@/lib/helpers';
import { BarChart } from '@mui/x-charts/BarChart';

interface DiaDescripcion {
  fecha: string;
  horasDeSuenio: number;
}

const obtenerHorasDeSuenio = (dia: AgendaTomiDia): number => {
  let minutoStart = 0;
  return dia.eventos.reduce((acc, evento) => {
    const minutosEnd = timeStringToMinutes(evento.hora);
    if (evento.tipo === 'Dormido') {
      return acc + (minutosEnd - minutoStart);
    }
    minutoStart = minutosEnd;
    return acc;
  }, 0);
};

interface SuenioTomiProps {
  desde: Date;
  hasta: Date;
}
const SuenioTomi = ({ desde, hasta }: SuenioTomiProps) => {
  const [dias, setDias] = useState<DiaDescripcion[]>([]);

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      const datos = await obtenerAgendaTomiDias(desde, hasta);
      const diasConDescripcion: DiaDescripcion[] = datos.map((dia) => ({
        fecha: formatDate(dia.fecha),
        horasDeSuenio: obtenerHorasDeSuenio(dia),
      }));

      setDias(diasConDescripcion);
    };
    obtenerDatosIniciales();
  }, []);

  return (
    <div>
      <BarChart
        width={600}
        height={300}
        series={[{ dataKey: 'horasDeSuenio' }]}
        xAxis={[{ dataKey: 'fecha' }]}
        dataset={dias.map(({ fecha, horasDeSuenio }) => ({ fecha, horasDeSuenio }))}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      ></BarChart>
    </div>
  );
};

export { SuenioTomi };
