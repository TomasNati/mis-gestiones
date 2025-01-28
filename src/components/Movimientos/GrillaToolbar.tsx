import { Box, Button } from '@mui/material';
import {
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { generateUUID, transformNumberToCurrenty } from '@/lib/helpers';
import { eliminarMovimientos } from '@/lib/orm/actions';
import { MovimientoGastoGrilla, ResultadoAPI, CategoriaUIMovimiento, GrupoMovimiento } from '@/lib/definitions';
import { useState } from 'react';
import { GrupoModal } from './editores/GrupoModal/GrupoModal';
import { GastosProgressBar } from './GastosProgressBar';

interface GrillaToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
  movimientosElegidos: MovimientoGastoGrilla[];
  anio: number;
  mes: number;
  sumaTotalDelMes: number;
  totalMensualEstimado: number;
  onMovimientosEliminados: (resultado: ResultadoAPI) => void;
  onRefrescarMovimientos: () => void;
  onGuardarGrupoMovimiento: (grupoMovimiento: GrupoMovimiento) => void;
  categoriasMovimiento: CategoriaUIMovimiento[];
}
const GrillaToolbar = ({
  setRows,
  setRowModesModel,
  anio,
  mes,
  movimientosElegidos,
  sumaTotalDelMes,
  totalMensualEstimado,
  onMovimientosEliminados,
  onRefrescarMovimientos,
  onGuardarGrupoMovimiento,
  categoriasMovimiento,
}: GrillaToolbarProps) => {
  const [openAgregarGrupo, setOpenAgregarGrupo] = useState(false);

  const handleAgregarGrupoOpen = () => {
    setOpenAgregarGrupo(true);
  };

  const handleAgregarGrupoClose = () => {
    setOpenAgregarGrupo(false);
  };

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

  const sumaDeMovimientosElegidos = movimientosElegidos.reduce((acc, movimiento) => acc + movimiento.monto!, 0);
  const sumaFormateada = transformNumberToCurrenty(sumaDeMovimientosElegidos);
  const sumaTotalFormateada = transformNumberToCurrenty(sumaTotalDelMes);
  const pendiente = totalMensualEstimado - sumaTotalDelMes;

  return (
    <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 3 }}>
      <GrupoModal
        open={openAgregarGrupo}
        onClose={handleAgregarGrupoClose}
        anio={anio}
        mes={mes}
        categoriasMovimiento={categoriasMovimiento}
        onGuardar={onGuardarGrupoMovimiento}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 'auto' }}>
        <Button color="primary" startIcon={<RefreshIcon />} onClick={onRefrescarMovimientos}>
          Refrescar
        </Button>
        <Button color="primary" startIcon={<AddIcon />} onClick={() => handleAgregarNuevoMovimiento()}>
          Agregar
        </Button>
        <Button color="primary" startIcon={<LibraryAddIcon />} onClick={handleAgregarGrupoOpen}>
          Agregar grupo
        </Button>
        <Button
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={handleEliminarMovimientos}
          disabled={movimientosElegidos.length === 0}
        >
          Eliminar
        </Button>
        <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
        <Box>
          <span style={{ marginRight: '5px', marginLeft: '5px' }}>Suma parcial:</span>
          <span>{sumaFormateada}</span>
        </Box>
        {totalMensualEstimado <= 0 ? (
          <Box>
            <span style={{ marginRight: '5px', marginLeft: '5px' }}>Suma Total:</span>
            <span>{sumaTotalFormateada}</span>
          </Box>
        ) : null}
      </Box>
      {totalMensualEstimado > 0 ? (
        <GastosProgressBar presupuesto={totalMensualEstimado} gastado={sumaTotalDelMes} />
      ) : null}
    </GridToolbarContainer>
  );
};

export type { GrillaToolbarProps };
export { GrillaToolbar };
