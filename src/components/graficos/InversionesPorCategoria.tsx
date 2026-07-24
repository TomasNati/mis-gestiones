import { Box, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { DatoGrafico } from '@/hooks/inversiones/useInversiones';
import { transformNumberToCurrenty } from '@/lib/helpers';

const PALETA = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];

interface InversionesPorCategoriaProps {
  titulo: string;
  data: DatoGrafico[];
  simbolo: string;
}

const InversionesPorCategoria = ({ titulo, data, simbolo }: InversionesPorCategoriaProps) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  const series = data.map((d, i) => ({ ...d, color: PALETA[i % PALETA.length] }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {titulo}
      </Typography>
      {total > 0 ? (
        <PieChart
          width={280}
          height={280}
          margin={{ top: 5, right: 5, bottom: 55, left: 5 }}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: 0,
              itemMarkWidth: 12,
              itemMarkHeight: 12,
              labelStyle: { fontSize: 12 },
            },
          }}
          series={[
            {
              data: series,
              innerRadius: 30,
              paddingAngle: 1,
              cornerRadius: 4,
              highlightScope: { fade: 'global', highlight: 'item' },
              arcLabel: ({ value }) => `${((value / total) * 100).toFixed(1)}%`,
              arcLabelMinAngle: 20,
              arcLabelRadius: '65%',
              valueFormatter: (item) =>
                `${simbolo} ${transformNumberToCurrenty(item.value)?.replace(',00', '') ?? item.value}`,
            },
          ]}
        />
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ py: 8 }}>
          Sin datos para mostrar
        </Typography>
      )}
    </Box>
  );
};

export { InversionesPorCategoria };
