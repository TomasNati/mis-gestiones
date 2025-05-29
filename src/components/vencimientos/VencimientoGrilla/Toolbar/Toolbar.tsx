import { Button, Tooltip } from "@mui/material";
import { GridSlotProps, GridToolbarContainer} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { VencimientoUI } from "@/lib/definitions";

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    handleAddClick: () => void;
  }
}

export const  Toolbar = (props: GridSlotProps['toolbar']) => {
 const { handleAddClick } = props;

  return (
    <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 3 }}>
      <Tooltip title="Agregar Vencimiento">
        <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick} variant="outlined" />
      </Tooltip>
    </GridToolbarContainer>
  );
}
