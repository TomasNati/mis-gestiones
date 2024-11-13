import { Box, Button } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';
import { cloneObject, transformNumberToCurrenty } from '@/lib/helpers';
import { GastoEstimadoAnual, GastoEstimadoItemDelMes } from '@/lib/definitions';
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
  gastosIncreasedByPercentage: (gastosUpdated: GastoEstimadoAnual[]) => void;
}
const GrillaToolbar = ({
  gastosEstimadosElegidos,
  gastosEstimados,
  mesesVisibles,
  sumaTotalDelMes,
  hasUnsavedRows,
  saveChanges,
  discardChanges,
  gastosIncreasedByPercentage,
}: GrillaToolbarProps) => {
  const sumaDeGastosEstimadosElegidos = 0; // gastosEstimadosElegidos.reduce((acc, movimiento) => acc + movimiento.monto!, 0);

  const sumaFormateada = transformNumberToCurrenty(sumaDeGastosEstimadosElegidos);
  const totalDeMontosFormateada = transformNumberToCurrenty(sumaTotalDelMes);

  const onExportarClicked = () => {
    exportarGastosEstimados(gastosEstimadosElegidos.length ? gastosEstimadosElegidos : gastosEstimados, mesesVisibles);
  };

  const onPercentageUpdateClicked = (valor?: number) => {
    if (!valor) return;

    const mesAActualizar = mesesVisibles[mesesVisibles.length - 1];
    const copiasDeGastosEstimadosElegidos = cloneObject(gastosEstimadosElegidos);

    copiasDeGastosEstimadosElegidos.forEach((gasto) => {
      const gastoEstimadoDelMes = gasto[mesAActualizar] as GastoEstimadoItemDelMes;
      if (gastoEstimadoDelMes) {
        gastoEstimadoDelMes.estimado = gastoEstimadoDelMes.estimado + (gastoEstimadoDelMes.estimado * valor) / 100;
      }
    });

    gastosIncreasedByPercentage(copiasDeGastosEstimadosElegidos);
  };

  return (
    <GridToolbarContainer>
      <Button disabled={!hasUnsavedRows} onClick={saveChanges} startIcon={<SaveOutlinedIcon />}>
        <span>Guardar</span>
      </Button>
      <Button disabled={!hasUnsavedRows} onClick={discardChanges} startIcon={<RestoreOutlinedIcon />}>
        Descartar cambios
      </Button>
      <Button color="primary" startIcon={<SaveAltOutlinedIcon />} onClick={onExportarClicked}>
        Exportar
      </Button>
      <Box>
        <PercentageTextField onChange={onPercentageUpdateClicked} />
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
