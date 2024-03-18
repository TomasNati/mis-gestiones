import { Button } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

interface GrillaToolbarProps {
  onNuevoMovimiento: () => void;
}
const GrillaToolbar = ({ onNuevoMovimiento }: GrillaToolbarProps) => {
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={() => onNuevoMovimiento()}>
        Agregar movimiento
      </Button>
    </GridToolbarContainer>
  );
};

export type { GrillaToolbarProps };
export { GrillaToolbar };
