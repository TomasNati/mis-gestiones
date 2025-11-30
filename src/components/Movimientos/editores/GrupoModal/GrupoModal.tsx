import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Autocomplete, Box, Button, DialogContent, Grid2 as Grid, TextField } from '@mui/material';
import { obtenerDiasEnElMes, generateUUID } from '@/lib/helpers';
import { Fecha } from '../Fecha/Fecha';
import { TipoDePagoEdicion } from '../TipoDePago/TipoDePago';
import {
  CategoriaUIMovimiento,
  GrupoMovimiento,
  InfoFilaMovimientoGrupo,
  TipoDeMovimientoGasto,
} from '@/lib/definitions';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect, FocusEvent } from 'react';
import { FilaGrupoModal } from './FilaGrupoModal';
import { NumberInput } from '../Monto/Monto';

const establecimientos = ['Changomás', 'Farmacity', 'Oriente', 'Super Más', 'Vea', 'Kiosco Urquiza'];

const categoriaDiarioSugeridos = ['Comida', 'Gaseosas', 'Alcohol', 'Cig', 'Productos personales'];
const categoriaHogarSugeridos = ['Cosas para la casa'];

const initializeCategoriaMovimientos = (categoriasMovimiento: CategoriaUIMovimiento[]) => {
  const categoriasFiltradas = categoriasMovimiento.filter(
    (categoria) =>
      (categoriaDiarioSugeridos.includes(categoria.nombre) && categoria.categoriaNombre === 'Diario') ||
      (categoriaHogarSugeridos.includes(categoria.nombre) && categoria.categoriaNombre === 'Hogar'),
  );
  const restantesCategorias = categoriasMovimiento.filter(
    (categoria) => !categoriasFiltradas.some((cat) => cat.id === categoria.id),
  );

  const categoriasSugeridas: CategoriaUIMovimiento[] = categoriasFiltradas.map((categoria) => ({
    ...categoria,
    categoriaNombre: 'Sugeridos',
  }));

  return [...categoriasSugeridas, ...restantesCategorias];
};

export interface GrupoModalProps {
  open: boolean;
  onClose: () => void;
  onGuardar: (grupoMovimiento: GrupoMovimiento) => void;
  anio: number;
  mes: number;
  categoriasMovimiento: CategoriaUIMovimiento[];
}

export const GrupoModal = ({ onClose, onGuardar, open, anio, mes, categoriasMovimiento }: GrupoModalProps) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [grupoMovimiento, setGrupoMovimiento] = useState<GrupoMovimiento>({
    dia: 1,
    filas: [],
  });

  const categoriasMov = initializeCategoriaMovimientos(categoriasMovimiento);

  const handleClose = (reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      setGrupoMovimiento({
        dia: 1,
        filas: [],
      });
      onClose();
    }
  };

  const validarDatos = (grupoMovimiento: GrupoMovimiento) => {
    const errors = [];
    if (!grupoMovimiento.dia) {
      errors.push('El día es requerido');
    }
    if (!grupoMovimiento.establecimiento) {
      errors.push('El establecimiento es requerido');
    }
    if (!grupoMovimiento.tipoDePago) {
      errors.push('El tipo de pago es requerido');
    }
    if (grupoMovimiento.filas.length === 0) {
      errors.push('Debe agregar al menos un movimiento');
    }

    grupoMovimiento.filas.forEach((fila, index) => {
      if (!fila.monto) {
        errors.push(`El monto es requerido en la fila ${index + 1}`);
      }
      if (!fila.concepto) {
        errors.push(`El concepto es requerido en la fila ${index + 1}`);
      }
    });
    return errors;
  };

  const handleGuardar = () => {
    const errors = validarDatos(grupoMovimiento);
    if (errors.length > 0) {
      console.error(errors);
      setErrors(errors);
      return;
    }
    onGuardar(grupoMovimiento);
    handleClose('save');
  };

  const handleAgregarFila = () => {
    const { filas } = grupoMovimiento;
    const nuevasFilas = [
      ...filas,
      {
        monto: 0,
        esRestoDelMonto: false,
        id: generateUUID(),
      },
    ];
    const nuevoGrupoMovimiento = { ...grupoMovimiento, filas: nuevasFilas };
    setGrupoMovimiento(nuevoGrupoMovimiento);
    setErrors(validarDatos(nuevoGrupoMovimiento));
  };

  const handleEliminarFila = (id: string) => {
    const { filas } = grupoMovimiento;
    const nuevasFilas = filas.filter((fila) => fila.id !== id);
    const nuevoGrupoMovimiento = { ...grupoMovimiento, filas: nuevasFilas };
    setGrupoMovimiento(nuevoGrupoMovimiento);
    setErrors(validarDatos(nuevoGrupoMovimiento));
  };

  const handleEditarFila = (fila: InfoFilaMovimientoGrupo) => {
    const { filas } = grupoMovimiento;
    const nuevasFilas = filas.map((f) => (f.id === fila.id ? fila : f));
    const filaRestoMonto = nuevasFilas.find((f) => f.esRestoDelMonto);
    if (filaRestoMonto) {
      filaRestoMonto.monto = 0;
      const sumaMontos = nuevasFilas.reduce((acc, f) => acc + (f.monto || 0), 0);
      filaRestoMonto.monto = grupoMovimiento.totalMonto ? grupoMovimiento.totalMonto - sumaMontos : 0;
    }
    const nuevoGrupoMovimiento = { ...grupoMovimiento, filas: nuevasFilas };
    setGrupoMovimiento(nuevoGrupoMovimiento);
    setErrors(validarDatos(nuevoGrupoMovimiento));
  };

  const handleDiaUpdated = (dia?: number) => {
    const nuevoMovimiento = { ...grupoMovimiento, dia: dia || 1 };
    setGrupoMovimiento(nuevoMovimiento);
    setErrors(validarDatos(nuevoMovimiento));
  };

  const handleEstablecimientoUpdated = (establecimiento?: string) => {
    const nuevoMovimiento = { ...grupoMovimiento, establecimiento };
    setGrupoMovimiento(nuevoMovimiento);
    setErrors(validarDatos(nuevoMovimiento));
  };

  const handleEstablecimientoBlur = (event: FocusEvent<HTMLInputElement>) => {
    const inputValue = (event.target as HTMLInputElement).value;
    handleEstablecimientoUpdated(inputValue);
  };

  const handleTipoDePagoUpdated = (tipoDePago?: TipoDeMovimientoGasto) => {
    const nuevoMovimiento = { ...grupoMovimiento, tipoDePago };
    setGrupoMovimiento(nuevoMovimiento);
    setErrors(validarDatos(nuevoMovimiento));
  };

  const handleTotalUpdated = (total?: number) => {
    const nuevoMovimiento = { ...grupoMovimiento, totalMonto: total };
    setGrupoMovimiento(nuevoMovimiento);
    setErrors(validarDatos(nuevoMovimiento));
  };

  const diasEnMes = obtenerDiasEnElMes(new Date(anio, mes, 1));
  const montoParcial = grupoMovimiento.filas.reduce((acc, fila) => acc + (fila.monto || 0), 0);
  const restoChecked = grupoMovimiento.filas.some((fila) => fila.esRestoDelMonto);

  return (
    <Dialog onClose={(_, reason) => handleClose(reason)} open={open}>
      <DialogTitle>Agregar grupo de movimientos</DialogTitle>
      <DialogContent
        sx={{
          paddingTop: '10px !important',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            '& .gridItem-small': {
              paddingTop: '0px',
              paddingLeft: '6px',
            },
          }}
        >
          <Grid size={{ xs: 12 }}>
            <Box display="flex" alignItems="center" sx={{ paddingTop: '5px', paddingBottom: '3px', gap: '3px' }}>
              <Fecha
                size="small"
                initialValue={grupoMovimiento.dia}
                diasDelMes={diasEnMes}
                onChange={handleDiaUpdated}
                onTabPressed={() => {}}
                label="Día"
              />
              <Box width={'200px'}>
                <Autocomplete
                  freeSolo
                  options={establecimientos}
                  value={grupoMovimiento.establecimiento || null}
                  onBlur={handleEstablecimientoBlur}
                  onChange={(_, newValue) => handleEstablecimientoUpdated(newValue || undefined)}
                  renderInput={(params) => <TextField {...params} label="Establecimiento" />}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: '79px',
                    transform: 'translate(14px, -9px) scale(0.75)',
                    backgroundColor: '#676e70',
                    paddingLeft: '4px',
                    paddingRight: '4px',
                    zIndex: 1,
                  }}
                >
                  Tipo de pago
                </Box>
                <TipoDePagoEdicion
                  onTipoDePagoChange={handleTipoDePagoUpdated}
                  tipoDepagoInicial={grupoMovimiento.tipoDePago}
                  onTabPressed={() => {}}
                  borderStyle="solid"
                />
              </Box>
              <Box width={'113px'}>
                <NumberInput
                  onBlur={handleTotalUpdated}
                  size="small"
                  label="Total"
                  valorInicial={grupoMovimiento.totalMonto?.toString()}
                />
              </Box>
            </Box>
          </Grid>{' '}
          <Grid size={{ xs: 12 }} className="gridItem-small">
            <Button color="primary" startIcon={<AddIcon />} onClick={handleAgregarFila}>
              Agregar movimiento
            </Button>
          </Grid>
          <Grid size={{ xs: 12 }}>
            {grupoMovimiento.filas.map((fila) => (
              <FilaGrupoModal
                key={fila.id}
                fila={fila}
                onDeleteClick={handleEliminarFila}
                onFilaEditada={handleEditarFila}
                categoriasMovimiento={categoriasMov}
                parcialMonto={montoParcial}
                restoEnabled={!restoChecked}
                totalMonto={grupoMovimiento.totalMonto}
              />
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <Box display="flex" justifyContent="center" sx={{ padding: '8px' }} gap={2}>
        <Button onClick={handleGuardar} color="primary" variant="contained" disabled={errors.length > 0}>
          Guardar
        </Button>
        <Button onClick={() => handleClose('close')} color="secondary" sx={{ marginRight: '8px' }}>
          Cancelar
        </Button>
      </Box>
    </Dialog>
  );
};
