import { useEffect } from 'react';
import { useState } from 'react';
import { SuenioTomiPorPeriodo } from '@/lib/definitions';
import { obtenerSuenioTomiPorPeriodo } from '@/lib/orm/data';
import { BarChart } from '@mui/x-charts/BarChart';

interface SuenioAnualTomiProps {
  fechaHasta: Date;
}
const SuenioAnualTomi = ({ fechaHasta }: SuenioAnualTomiProps) => {
  const [datos, setDatos] = useState<SuenioTomiPorPeriodo[]>([]);

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      const datos = await obtenerSuenioTomiPorPeriodo(fechaHasta);
      setDatos(datos);
    };
    obtenerDatosIniciales();
  }, [fechaHasta]);

  return (
    <div>
      <BarChart
        width={800}
        height={300}
        grid={{ horizontal: true }}
        series={[
          {
            dataKey: 'horasDeSuenio',
            valueFormatter: (value) => (value ? value.toFixed(1) : '0'),
          },
        ]}
        xAxis={[
          {
            dataKey: 'fecha',
            scaleType: 'band',
            valueFormatter: (value: Date) => `${value.getFullYear()}/${value.getMonth() + 1}`,
          },
        ]}
        dataset={datos.map((dia) => ({ ...dia }))}
        barLabel={({ value }) => (value ? value.toFixed(1) : '0')}
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

export { SuenioAnualTomi };
