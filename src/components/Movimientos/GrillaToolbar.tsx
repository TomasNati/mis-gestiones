import { Button } from '@mui/material';
import { GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { MovimientoGastoGrillaNullable } from '@/lib/definitions';
import { generateUUID } from '@/lib/helpers';

interface GrillaToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
  anio: number;
  mes: number;
}
const GrillaToolbar = ({ setRows, setRowModesModel, anio, mes }: GrillaToolbarProps) => {
  const handleClick = () => {
    const id = generateUUID();
    const nuevoMovimiento = {
      id,
      isNew: true,
      fecha: new Date(anio, mes, new Date().getDate()),
      concepto: null,
      monto: null,
      categoria: null,
      tipoDeGasto: null,
    };
    setRows((oldRows) => [nuevoMovimiento, ...oldRows]);
    setRowModesModel((oldModel) => ({
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'fecha' },
      ...oldModel,
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={() => handleClick()}>
        Agregar movimiento
      </Button>
    </GridToolbarContainer>
  );
};

export type { GrillaToolbarProps };
export { GrillaToolbar };
