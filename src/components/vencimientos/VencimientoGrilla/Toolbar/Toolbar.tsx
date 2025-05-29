import { Box, Button, Tooltip } from '@mui/material';
import { GridSlotProps, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { VencimientoUI } from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    handleAddClick: () => void;
    vencimientosElegidos?: VencimientoUI[];
  }
}

export const Toolbar = ({ handleAddClick, vencimientosElegidos }: GridSlotProps['toolbar']) => {
  const sumaMontos = vencimientosElegidos?.reduce((acc, vencimiento) => acc + (vencimiento.monto || 0), 0) || 0;
  const sumaFormateada = transformNumberToCurrenty(sumaMontos);

  return (
    <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 3 }}>
      <Tooltip title="Agregar Vencimiento">
        <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick} variant="outlined" />
      </Tooltip>
      <Box>
        <span style={{ marginRight: '5px', marginLeft: '5px' }}>Suma parcial:</span>
        <span>{sumaFormateada}</span>
      </Box>
    </GridToolbarContainer>
  );
};
