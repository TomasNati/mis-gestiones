import { Box, Button, Tooltip } from '@mui/material';
import { GridSlotProps, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { VencimientoUI } from '@/lib/definitions';
import { transformNumberToCurrenty } from '@/lib/helpers';

import { toolbarStyles } from './Toolbar.styles';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    handleAddClick: () => void;
    handleCopyClick: (ids: string[]) => void;
    vencimientosElegidos?: VencimientoUI[];
  }
}

export const Toolbar = ({ handleAddClick, handleCopyClick, vencimientosElegidos }: GridSlotProps['toolbar']) => {
  const sumaMontos = vencimientosElegidos?.reduce((acc, vencimiento) => acc + (vencimiento.monto || 0), 0) || 0;
  const sumaFormateada = transformNumberToCurrenty(sumaMontos);

  const idsElegidos: string[] = vencimientosElegidos?.filter((v) => v.id).map((v) => v.id || '') || [];
  const onCopyClicked = () => handleCopyClick(idsElegidos);

  return (
    <GridToolbarContainer sx={toolbarStyles.container}>
      <Tooltip title="Agregar Vencimiento">
        <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick} variant="outlined" />
      </Tooltip>
      <Tooltip title="Copiar Vencimiento">
        <Button
          color="primary"
          startIcon={<ContentCopyIcon />}
          onClick={onCopyClicked}
          disabled={!vencimientosElegidos?.length}
          variant="outlined"
        />
      </Tooltip>
      <Box>
        <span>Suma parcial:</span>
        <span>{sumaFormateada}</span>
      </Box>
    </GridToolbarContainer>
  );
};
