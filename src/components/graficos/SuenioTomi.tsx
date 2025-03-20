import { useEffect } from 'react';
import { useState } from 'react';
import { AgendaTomiDia } from '@/lib/definitions';
import { obtenerAgendaTomiDias } from '@/lib/orm/data';
import { formatDate, minutesToTimeString, timeStringToMinutes } from '@/lib/helpers';
import { BarChart } from '@mui/x-charts/BarChart';

interface DiaDescripcion {
  fecha: string;
  horasDeSuenio: number;
}

const obtenerHorasDeSuenio = (dia: AgendaTomiDia): number => {
  let minutoStart = 0;
  return dia.eventos.reduce((acc, evento) => {
    const minutosEnd = timeStringToMinutes(evento.hora);
    if (evento.tipo === 'Despierto') {
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
        fecha: formatDate(dia.fecha).split('-').reverse().slice(0, 2).join('/'),
        horasDeSuenio: obtenerHorasDeSuenio(dia),
      }));

      setDias(diasConDescripcion);
    };
    obtenerDatosIniciales();
  }, []);

  if (dias.length > 0) console.log(dias);

  return (
    <div>
      <BarChart
        width={800}
        height={300}
        grid={{ horizontal: true }}
        series={[
          {
            dataKey: 'horasDeSuenio',
            valueFormatter: (value) => (value ? minutesToTimeString(value) : '0'),
          },
        ]}
        yAxis={[
          {
            dataKey: 'horasDeSuenio',
            valueFormatter: (value) => (value ? (value / 60).toFixed(1) : '0'),
          },
        ]}
        xAxis={[
          {
            dataKey: 'fecha',
            scaleType: 'band',
            valueFormatter: (value) => value.slice(0, -5),
          },
        ]}
        dataset={dias.map(({ fecha, horasDeSuenio }) => ({ fecha, horasDeSuenio }))}
        margin={{
          top: 20,
          right: 30,
          left: 50,
          bottom: 50,
        }}
      ></BarChart>
    </div>
  );
};

export { SuenioTomi };
