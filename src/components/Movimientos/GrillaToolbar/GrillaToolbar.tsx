import { Box, Button, Divider } from '@mui/material';
import {
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarExport,
  GridSlotsComponentsProps,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { generateUUID, transformNumberToCurrenty } from '@/lib/helpers';
import { eliminarMovimientos } from '@/lib/orm/actions';
import { MovimientoGastoGrilla, ResultadoAPI, CategoriaUIMovimiento, GrupoMovimiento } from '@/lib/definitions';
import { useState } from 'react';
import { GrupoModal } from '../editores/GrupoModal/GrupoModal';
import { styles } from './GrillaToolbar.styles';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
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
}

const GrillaToolbar = ({
  setRows = () => {},
  setRowModesModel = () => {},
  anio = new Date().getFullYear(),
  mes = new Date().getMonth(),
  movimientosElegidos = [],
  sumaTotalDelMes = 0,
  onMovimientosEliminados = () => {},
  onRefrescarMovimientos = () => {},
  onGuardarGrupoMovimiento = () => {},
  categoriasMovimiento = [],
}: NonNullable<GridSlotsComponentsProps['toolbar']>) => {
  const [openAgregarGrupo, setOpenAgregarGrupo] = useState(false);

  const handleAgregarGrupoOpen = () => {
    setOpenAgregarGrupo(true);
  };

  const handleAgregarGrupoClose = () => {
    setOpenAgregarGrupo(false);
  };

  const handleAgregarNuevoMovimiento = () => {
    const id = generateUUID();
    const fechaActual = new Date();
    const dia = fechaActual.getFullYear() === anio && fechaActual.getMonth() === mes ? fechaActual.getDate() : 1;

    const nuevoMovimiento = {
      id,
      isNew: true,
      fecha: new Date(anio || 1900, mes, dia),
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
  const sumaFormateada = transformNumberToCurrenty(sumaDeMovimientosElegidos, 0);

  return (
    <GridToolbarContainer sx={styles.toolbar}>
      <GrupoModal
        open={openAgregarGrupo}
        onClose={handleAgregarGrupoClose}
        anio={anio}
        mes={mes}
        categoriasMovimiento={categoriasMovimiento}
        onGuardar={onGuardarGrupoMovimiento}
      />

      <Button size="small" color="primary" onClick={handleAgregarNuevoMovimiento} startIcon={<AddIcon />}>
        Agregar
      </Button>

      <Button size="small" color="primary" onClick={handleAgregarGrupoOpen} startIcon={<LibraryAddIcon />}>
        Agregar grupo
      </Button>

      <Button size="small" color="primary" onClick={onRefrescarMovimientos} startIcon={<RefreshIcon />}>
        Refrescar
      </Button>

      <Button
        size="small"
        color="primary"
        onClick={handleEliminarMovimientos}
        startIcon={<DeleteIcon />}
        disabled={movimientosElegidos.length === 0}
      >
        Eliminar
      </Button>

      <Box sx={styles.toolBtn}>
        <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
      </Box>

      <Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--border-soft)' }} />

      <Box sx={styles.sumaLabel}>
        Suma parcial:
        <Box component="span" className="num" sx={styles.sumaValue}>
          {sumaFormateada}
        </Box>
      </Box>

      <Box sx={styles.spacer} />
    </GridToolbarContainer>
  );
};

export { GrillaToolbar };
