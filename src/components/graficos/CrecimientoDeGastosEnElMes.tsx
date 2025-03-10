import { MovimientoGastoGrilla } from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { LineChart } from '@mui/x-charts/LineChart';

type GastoPorDia = {
  dia: number;
  totalPorDia: number;
  totalAcumulado: number;
  pendienteDeGastar: number;
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
      acc.push({ dia, totalPorDia: monto, totalAcumulado: 0, pendienteDeGastar: totalEstimado });
    } else {
      const gastosDelDia = acc.find((gasto) => gasto.dia === dia);
      if (gastosDelDia) {
        gastosDelDia.totalPorDia += monto;
      } else {
        acc.push({ dia, totalPorDia: monto, totalAcumulado: 0, pendienteDeGastar: totalEstimado });
      }
    }

    return acc;
  }, []);

  gastosAcumuladosPorDia.forEach((gasto, index) => {
    gasto.totalAcumulado = gastosAcumuladosPorDia
      .slice(0, index + 1) //obtengo todos los dias hasta el actual
      .reduce((acc, gasto) => acc + gasto.totalPorDia, 0); //sumo los gastos de cada dia
    gasto.pendienteDeGastar -= gasto.totalAcumulado;
  });

  return (
    <LineChart
      width={700}
      height={300}
      dataset={gastosAcumuladosPorDia}
      series={[
        {
          dataKey: 'pendienteDeGastar',
          valueFormatter: (item) => transformNumberToCurrenty(item || 0) || '',
          label: 'Pendiente de gastar',
          color: 'red',
        },
        {
          dataKey: 'totalAcumulado',
          valueFormatter: (item) => transformNumberToCurrenty(item || 0) || '',
          label: 'Total acumulado',
          color: '#8884d8',
        },
        {
          dataKey: 'totalPorDia',
          valueFormatter: (item) => transformNumberToCurrenty(item || 0) || '',
          label: 'Total por día',
          color: '#82ca9d',
        },
      ]}
      xAxis={[{ dataKey: 'dia', label: 'Dia' }]} // Defines the X-axis property
    />
  );
};

export { CrecimientoDeGastosEnElMes };
