import { Box, Button } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { GastoEstimadoAnual } from '@/lib/definitions';
import PercentageTextField from './InputPorcentaje';
import { exportarGastosEstimados } from '@/lib/helpers';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';

interface GrillaToolbarProps {
  gastosEstimadosElegidos: GastoEstimadoAnual[];
  gastosEstimados: GastoEstimadoAnual[];
  mesesVisibles: string[];
  sumaTotalDelMes: number;
  hasUnsavedRows: boolean;
  saveChanges: () => void;
  discardChanges: () => void;
}
const GrillaToolbar = ({
  gastosEstimadosElegidos,
  gastosEstimados,
  mesesVisibles,
  sumaTotalDelMes,
  hasUnsavedRows,
  saveChanges,
  discardChanges,
}: GrillaToolbarProps) => {
  const sumaDeGastosEstimadosElegidos = 0; // gastosEstimadosElegidos.reduce((acc, movimiento) => acc + movimiento.monto!, 0);

  const sumaFormateada = transformNumberToCurrenty(sumaDeGastosEstimadosElegidos);
  const totalDeMontosFormateada = transformNumberToCurrenty(sumaTotalDelMes);

  const onExportarClicked = () => {
    exportarGastosEstimados(gastosEstimadosElegidos.length ? gastosEstimadosElegidos : gastosEstimados, mesesVisibles);
  };

  return (
    <GridToolbarContainer>
      <Button disabled={!hasUnsavedRows} onClick={saveChanges} startIcon={<SaveOutlinedIcon />}>
        <span>Save</span>
      </Button>
      <Button disabled={!hasUnsavedRows} onClick={discardChanges} startIcon={<RestoreOutlinedIcon />}>
        Discard all changes
      </Button>
      <Button color="primary" startIcon={<SaveAltOutlinedIcon />} onClick={onExportarClicked}>
        Exportar
      </Button>
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
