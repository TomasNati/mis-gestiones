import { Button } from '@mui/material';
import { GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { generateUUID } from '@/lib/helpers';
import { eliminarMovimientos } from '@/lib/orm/actions';
import { ConsoleLogWriter } from 'drizzle-orm';
import { ResultadoAPI } from '@/lib/definitions';

interface GrillaToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
  selectedRows: string[];
  anio: number;
  mes: number;
  onMovimientosEliminados: (resultado: ResultadoAPI) => void;
}
const GrillaToolbar = ({
  setRows,
  setRowModesModel,
  anio,
  mes,
  selectedRows,
  onMovimientosEliminados,
}: GrillaToolbarProps) => {
  const handleAgregarNuevoMovimiento = () => {
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

  const handleEliminarMovimientos = async () => {
    const resultadoEliminacion = await eliminarMovimientos(selectedRows);
    if (resultadoEliminacion.exitoso) {
      setRows((oldRows) => oldRows.filter((row) => !selectedRows.includes(row.id as string)));
    }
    onMovimientosEliminados(resultadoEliminacion);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={() => handleAgregarNuevoMovimiento()}>
        Agregar
      </Button>
      <Button
        color="primary"
        startIcon={<DeleteIcon />}
        onClick={() => handleEliminarMovimientos()}
        disabled={selectedRows.length === 0}
      >
        Eliminar
      </Button>
    </GridToolbarContainer>
  );
};

export type { GrillaToolbarProps };
export { GrillaToolbar };
