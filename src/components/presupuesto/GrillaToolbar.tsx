import { Box } from '@mui/material';
import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { GastoEstimadoAnual } from '@/lib/definitions';
import PercentageTextField from './InputPorcentaje';

interface GrillaToolbarProps {
  gastosEstimadosElegidos: GastoEstimadoAnual[];
  sumaTotalDelMes: number;
}
const GrillaToolbar = ({ gastosEstimadosElegidos, sumaTotalDelMes }: GrillaToolbarProps) => {
  const sumaDeGastosEstimadosElegidos = 0; // gastosEstimadosElegidos.reduce((acc, movimiento) => acc + movimiento.monto!, 0);

  const sumaFormateada = transformNumberToCurrenty(sumaDeGastosEstimadosElegidos);
  const totalDeMontosFormateada = transformNumberToCurrenty(sumaTotalDelMes);

  return (
    <GridToolbarContainer>
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
      <Box>
        <PercentageTextField onChange={(valor?: number) => console.log(valor)} />
      </Box>
      <Box>
        <span style={{ marginRight: '5px' }}>Suma parcial:</span>
        <span>{sumaFormateada}</span>
      </Box>
      <Box>
        <span style={{ marginRight: '5px' }}>Suma total:</span>
        <span>{totalDeMontosFormateada}</span>
      </Box>
    </GridToolbarContainer>
  );
};

export type { GrillaToolbarProps };
export { GrillaToolbar };
