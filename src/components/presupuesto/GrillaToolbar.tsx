import { Box } from '@mui/material';
import { GridRowModesModel, GridRowsProp, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { GastosEstimado } from '@/lib/definitions';

interface GrillaToolbarProps {
  gastosEstimadosElegidos: GastosEstimado[];
  sumaTotalDelMes: number;
}
const GrillaToolbar = ({ gastosEstimadosElegidos, sumaTotalDelMes }: GrillaToolbarProps) => {
  const sumaDeGastosEstimadosElegidos = gastosEstimadosElegidos.reduce((acc, movimiento) => acc + movimiento.monto!, 0);

  const sumaFormateada = transformNumberToCurrenty(sumaDeGastosEstimadosElegidos);
  const totalDeMontosFormateada = transformNumberToCurrenty(sumaTotalDelMes);

  return (
    <GridToolbarContainer>
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
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
