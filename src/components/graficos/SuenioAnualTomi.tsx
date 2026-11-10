import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { SuenioTomiPorPeriodo } from '@/lib/definitions';
import { obtenerSuenioTomiPorPeriodo } from '@/lib/orm/data';
import { nombreMesCorto } from '@/lib/helpers';
import { BarChart } from '@mui/x-charts/BarChart';
import { ChartPanel } from '@/components/ui';

interface SuenioAnualTomiProps {
  fechaHasta: Date;
}

const estilos = {
  hint: {
    fontSize: 'var(--fs-12)',
    color: 'var(--text-tertiary)',
  },
} as const;

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
    <ChartPanel
      title="Promedio por mes"
      hint="últimos 12"
      aside={<Box component="span" sx={estilos.hint}>sueño nocturno</Box>}
    >
      <BarChart
        height={280}
        grid={{ horizontal: true }}
        series={[
          {
            dataKey: 'horasDeSuenio',
            // Mismo celeste que el gráfico diario (`--accent`). Hex literal porque
            // MUI X pasa el color por d3-color en el hover y una `var()` rompe.
            color: '#4493F8',
          },
        ]}
        xAxis={[
          {
            dataKey: 'fecha',
            scaleType: 'band',
            // Mes corto (`oct`, `nov`, …): 12 etiquetas de 3 letras entran en el panel.
            valueFormatter: (value: Date) => nombreMesCorto(value.getUTCMonth()),
          },
        ]}
        dataset={datos.map((dia) => ({ ...dia }))}
        barLabel={({ value }) => (value ? value.toFixed(1) : '0')}
        // El número dentro de la barra resume el valor: el tooltip era redundante.
        tooltip={{ trigger: 'none' }}
        slotProps={{
          barLabel: {
            style: { fontFamily: 'var(--font-mono)', fontSize: '10.5px' },
          },
        }}
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

export { SuenioAnualTomi };
