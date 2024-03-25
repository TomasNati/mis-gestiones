import { Button } from '@mui/material';
import { GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { generateUUID } from '@/lib/helpers';
import { eliminarMovimientos } from '@/lib/orm/actions';
import { MovimientoGastoGrilla, ResultadoAPI } from '@/lib/definitions';
import { useState } from 'react';
import { ExportarMovimiento } from './Exportar/Exportar';

interface GrillaToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
  movimientosElegidos: MovimientoGastoGrilla[];
  anio: number;
  mes: number;
  onMovimientosEliminados: (resultado: ResultadoAPI) => void;
}
const GrillaToolbar = ({
  setRows,
  setRowModesModel,
  anio,
  mes,
  movimientosElegidos,
  onMovimientosEliminados,
}: GrillaToolbarProps) => {
  const [abrirDialogoExportar, setAbrirDialogoExportar] = useState(false);

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
    const movimientosAEliminar = movimientosElegidos.map((movimiento) => movimiento.id as string);
    const resultadoEliminacion = await eliminarMovimientos(movimientosAEliminar);
    if (resultadoEliminacion.exitoso) {
      setRows((oldRows) => oldRows.filter((row) => !movimientosAEliminar.includes(row.id as string)));
    }
    onMovimientosEliminados(resultadoEliminacion);
  };

  const handleExportarMovimientos = () => {
    setAbrirDialogoExportar(true);
  };

  const handleCerrarDialogoExportar = () => {
    setAbrirDialogoExportar(false);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={() => handleAgregarNuevoMovimiento()}>
        Agregar
      </Button>
      <Button
        color="primary"
        startIcon={<DeleteIcon />}
        onClick={handleEliminarMovimientos}
        disabled={movimientosElegidos.length === 0}
      >
        Eliminar
      </Button>
      <Button
        color="primary"
        startIcon={<ImportExportIcon />}
        onClick={handleExportarMovimientos}
        disabled={movimientosElegidos.length === 0}
      >
        Exportar
      </Button>
      <ExportarMovimiento
        open={abrirDialogoExportar}
        movimientos={movimientosElegidos}
        onDialogClosed={handleCerrarDialogoExportar}
      />
    </GridToolbarContainer>
  );
};

export type { GrillaToolbarProps };
export { GrillaToolbar };
