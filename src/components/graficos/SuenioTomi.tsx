import { useEffect } from 'react';
import { useState } from 'react';
import { AgendaTomiDia } from '@/lib/definitions';
import { obtenerAgendaTomiDias } from '@/lib/orm/data';
import { formatDate, minutesToTimeString, obtenerMinutosDeSuenio } from '@/lib/helpers';
import { BarChart } from '@mui/x-charts/BarChart';

interface DiaDescripcion {
  fecha: string;
  minutosDeSuenio: number;
}

interface SuenioTomiProps {
  rangoFechas?: { desde: Date; hasta: Date };
  diasIniciales?: AgendaTomiDia[];
}
const SuenioTomi = ({ rangoFechas, diasIniciales }: SuenioTomiProps) => {
  const [dias, setDias] = useState<DiaDescripcion[]>([]);

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      let datos = diasIniciales || [];
      if (!datos.length && rangoFechas) {
        datos = await obtenerAgendaTomiDias(rangoFechas.desde, rangoFechas.hasta);
      }
      const diasConDescripcion: DiaDescripcion[] = datos.map((dia) => ({
        fecha: formatDate(dia.fecha, false, { timeZone: 'UTC' }).split('-').reverse().slice(0, 2).join('/'),
        minutosDeSuenio: obtenerMinutosDeSuenio(dia),
      }));

      setDias(diasConDescripcion);
    };
    obtenerDatosIniciales();
  }, [rangoFechas, diasIniciales]);

  if (!dias.length) return null;

  return (
    <div>
      <BarChart
        width={800}
        height={300}
        grid={{ horizontal: true }}
        series={[
          {
            dataKey: 'minutosDeSuenio',
            valueFormatter: (value) => (value ? minutesToTimeString(value) : '0'),
          },
        ]}
        yAxis={[
          {
            dataKey: 'minutosDeSuenio',
            valueFormatter: (value) => (value ? (value / 60).toFixed(1) : '0'),
            colorMap: {
              type: 'piecewise',
              thresholds: [6 * 60, 8 * 60, 10 * 60], // hora * minutos
              colors: ['#df5e5e', 'orange', '#199db3', '#58ff58bf'],
            },
          },
        ]}
        xAxis={[
          {
            dataKey: 'fecha',
            scaleType: 'band',
            valueFormatter: (value) => value.slice(0, -5),
          },
        ]}
        dataset={dias.map((dia) => ({ ...dia }))}
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
