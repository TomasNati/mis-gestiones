import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { AgendaTomiDia } from '@/lib/definitions';
import { obtenerAgendaTomiDias } from '@/lib/orm/data';
import { formatDate, minutesToTimeString, nombreMesCorto, obtenerMinutosDeSuenio } from '@/lib/helpers';
import { BarChart } from '@mui/x-charts/BarChart';
import { ChartPanel } from '@/components/ui';

interface DiaDescripcion {
  fecha: string;
  minutosDeSuenio: number;
}

interface SuenioTomiProps {
  rangoFechas?: { desde: Date; hasta: Date };
  diasIniciales?: AgendaTomiDia[];
}

/** Bandas de color del gráfico (leyenda del mockup). */
const BANDAS = [
  { color: 'var(--danger)', label: 'Menos de 6 h' },
  { color: 'var(--attention)', label: '6 a 8 h' },
  { color: 'var(--accent)', label: '8 a 10 h' },
  { color: 'var(--success)', label: '10 h o más' },
];

const estilos = {
  leyenda: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px 14px',
    fontSize: 'var(--fs-12)',
    color: 'var(--text-secondary)',
  },
  leyendaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  swatch: {
    width: '10px',
    height: '10px',
    borderRadius: '2px',
    flex: '0 0 auto',
  },
} as const;

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

  const hasta = rangoFechas?.hasta;
  const hint = hasta ? `hasta el ${hasta.getUTCDate()} ${nombreMesCorto(hasta.getUTCMonth())}` : undefined;

  return (
    <ChartPanel
      title="Horas de sueño por día"
      hint={hint}
      aside={
        <Box sx={estilos.leyenda}>
          {BANDAS.map(({ color, label }) => (
            <Box component="span" key={label} sx={estilos.leyendaItem}>
              <Box component="span" sx={{ ...estilos.swatch, backgroundColor: color }} />
              {label}
            </Box>
          ))}
        </Box>
      }
    >
      <BarChart
        height={280}
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
              // Bandas semánticas del mockup (`--danger` / `--attention` /
              // `--accent` / `--success`). Van como hex y no como `var()` porque
              // en el hover MUI X pasa el color por d3-color y una CSS var rompe.
              colors: ['#F85149', '#D29922', '#4493F8', '#3FB950'],
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
      />
    </ChartPanel>
  );
};

export { SuenioTomi };
