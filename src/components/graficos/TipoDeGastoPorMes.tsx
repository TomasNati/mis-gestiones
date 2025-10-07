import { MovimientoGastoGrilla } from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { PieChart } from '@mui/x-charts/PieChart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const TipoDeGastoPorMes = ({ movimientos }: { movimientos: MovimientoGastoGrilla[] }) => {
  const gastosPorTipoDeGasto = movimientos.reduce(
    (acc, movimiento) => {
      const tipoDeGasto = movimiento.tipoDeGasto;
      switch (tipoDeGasto) {
        case 'Efectivo':
          acc[0].value += movimiento.monto;
          break;
        case 'Debito':
          acc[1].value += movimiento.monto;
          break;
        case 'Credito':
          acc[2].value += movimiento.monto;
          break;
      }
      return acc;
    },
    [
      { label: 'Efectivo', value: 0, color: COLORS[0] },
      { label: 'Débito', value: 0, color: COLORS[2] },
      { label: 'Crédito', value: 0, color: COLORS[1] },
    ],
  );

  const total = gastosPorTipoDeGasto.reduce((acc, gasto) => acc + gasto.value, 0);

  return (
    <PieChart
      width={400}
      height={300}
      series={[
        {
          arcLabel: ({ label, value }) => {
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label} ${percentage}%`;
          },
          arcLabelMinAngle: 15,
          arcLabelRadius: '60%',
          data: gastosPorTipoDeGasto,
          valueFormatter: (item) => transformNumberToCurrenty(item.value) || item.value.toString(),
        },
      ]}
    />
  );
};

export { TipoDeGastoPorMes };
