import { MovimientoGastoGrilla } from '@/lib/definitions';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ReferenceLine } from 'recharts';

type GastoPorDia = {
  dia: number;
  totalPorDia: number;
  totalAcumulado: number;
};

const CrecimientoDeGastosEnElMes = ({
  movimientos,
  totalEstimado,
}: {
  movimientos: MovimientoGastoGrilla[];
  totalEstimado: number;
}) => {
  const sortedMovimientos = [...movimientos].sort((a, b) => {
    const diaA = new Date(a.fecha).getDate();
    const diaB = new Date(b.fecha).getDate();
    return diaA - diaB;
  });

  let totalAcumulado = 0;
  const gastosAcumuladosPorDia: GastoPorDia[] = sortedMovimientos.reduce((acc: GastoPorDia[], movimiento) => {
    const dia = new Date(movimiento.fecha).getDate();
    const monto = movimiento.monto;
    totalAcumulado += monto;

    if (acc.length === 0) {
      acc.push({ dia, totalPorDia: monto, totalAcumulado: monto });
    } else {
      const gastosDelDia = acc.find((gasto) => gasto.dia === dia);
      if (gastosDelDia) {
        gastosDelDia.totalPorDia += monto;
        gastosDelDia.totalAcumulado += monto;
      } else {
        totalAcumulado += monto;
        acc.push({ dia, totalPorDia: monto, totalAcumulado });
      }
    }

    return acc;
  }, []);

  console.log(totalEstimado);

  return (
    <LineChart width={700} height={300} data={gastosAcumuladosPorDia}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="dia" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="totalAcumulado" stroke="#8884d8" name="Acumulado" />
      <Line type="monotone" dataKey="totalPorDia" stroke="#82ca9d" name="Gastos del día" />
      <ReferenceLine y={totalEstimado} stroke="red" label="Gastos estimados" />
    </LineChart>
  );
};

export { CrecimientoDeGastosEnElMes };
