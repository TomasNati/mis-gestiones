import { MovimientoGastoGrilla } from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { PieChart, Pie, Cell, Tooltip, TooltipProps } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const MontoTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${payload[0].name} : ${transformNumberToCurrenty(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
};

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
      { name: 'Efectivo', value: 0 },
      { name: 'Débito', value: 0 },
      { name: 'Crédito', value: 0 },
    ],
  );

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={gastosPorTipoDeGasto}
        cx={200}
        cy={200}
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {gastosPorTipoDeGasto.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<MontoTooltip />} />
    </PieChart>
  );
};

export { TipoDeGastoPorMes };
