import { MovimientoGastoGrilla } from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';
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

  const gastosAcumuladosPorDia: GastoPorDia[] = sortedMovimientos.reduce((acc: GastoPorDia[], movimiento) => {
    const dia = new Date(movimiento.fecha).getDate();
    const monto = movimiento.monto;

    if (acc.length === 0) {
      acc.push({ dia, totalPorDia: monto, totalAcumulado: 0 });
    } else {
      const gastosDelDia = acc.find((gasto) => gasto.dia === dia);
      if (gastosDelDia) {
        gastosDelDia.totalPorDia += monto;
      } else {
        acc.push({ dia, totalPorDia: monto, totalAcumulado: 0 });
      }
    }

    return acc;
  }, []);

  gastosAcumuladosPorDia.forEach((gasto, index) => {
    gasto.totalAcumulado = gastosAcumuladosPorDia
      .slice(0, index + 1) //obtengo todos los dias hasta el actual
      .reduce((acc, gasto) => acc + gasto.totalPorDia, 0); //sumo los gastos de cada dia
  });

  return (
    <LineChart width={700} height={300} data={gastosAcumuladosPorDia}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="dia" />
      <YAxis />
      <Tooltip formatter={(value: number) => transformNumberToCurrenty(value)} />
      <Legend />
      <Line type="monotone" dataKey="totalAcumulado" stroke="#8884d8" name="Acumulado" />
      <Line type="monotone" dataKey="totalPorDia" stroke="#82ca9d" name="Gastos del día" />
      <ReferenceLine y={totalEstimado} stroke="red" label="Gastos estimados" />
    </LineChart>
  );
};

export { CrecimientoDeGastosEnElMes };
