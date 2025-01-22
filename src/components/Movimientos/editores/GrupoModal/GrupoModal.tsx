import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Autocomplete, Box, Button, DialogContent, Grid, TextField } from '@mui/material';
import { obtenerDiasEnElMes } from '@/lib/helpers';
import { Fecha } from '../Fecha/Fecha';
import { TipoDePagoEdicion } from '../TipoDePago/TipoDePago';
import {
  CategoriaUIMovimiento,
  GrupoMovimiento,
  InfoFilaMovimientoGrupo,
  TipoDeMovimientoGasto,
} from '@/lib/definitions';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import { generateUUID } from '@/lib/helpers';
import { FilaGrupoModal } from './FilaGrupoModal';
import { NumberInput } from '../Monto/Monto';

const establecimientos = ['Changomás', 'Farmacity', 'Oriente', 'Super Más', 'Vea'];

const categoriaDiarioSugeridos = ['Comida', 'Gaseosas', 'Alcohol', 'Cig', 'Productos personales'];
const categoriaHogarSugeridos = ['Cosas para la casa'];

export interface GrupoModalProps {
  open: boolean;
  onClose: () => void;
  anio: number;
  mes: number;
  categoriasMovimiento: CategoriaUIMovimiento[];
}

export const GrupoModal = ({ onClose, open, anio, mes, categoriasMovimiento }: GrupoModalProps) => {
  const [categoriasMov, setCategoriasMov] = useState<CategoriaUIMovimiento[]>([]);
  const [grupoMovimiento, setGrupoMovimiento] = useState<GrupoMovimiento>({
    dia: 1,
    filas: [],
  });

  useEffect(() => {
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

    setCategoriasMov([...categoriasSugeridas, ...restantesCategorias]);
  }, [categoriasMovimiento]);

  const handleClose = () => {
    onClose();
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
    setGrupoMovimiento({ ...grupoMovimiento, filas: nuevasFilas });
  };

  const handleEliminarFila = (id: string) => {
    const { filas } = grupoMovimiento;
    const nuevasFilas = filas.filter((fila) => fila.id !== id);
    setGrupoMovimiento({ ...grupoMovimiento, filas: nuevasFilas });
  };

  const handleEditarFila = (fila: InfoFilaMovimientoGrupo) => {
    const { filas } = grupoMovimiento;
    const nuevasFilas = filas.map((f) => (f.id === fila.id ? fila : f));
    setGrupoMovimiento({ ...grupoMovimiento, filas: nuevasFilas });
  };

  const handleDiaUpdated = (dia?: number) => {
    setGrupoMovimiento({ ...grupoMovimiento, dia: dia || 1 });
  };

  const handleEstablecimientoUpdated = (establecimiento?: string) => {
    setGrupoMovimiento({ ...grupoMovimiento, establecimiento });
  };

  const handleTipoDePagoUpdated = (tipoDePago?: TipoDeMovimientoGasto) => {
    setGrupoMovimiento({ ...grupoMovimiento, tipoDePago });
  };

  const handleTotalUpdated = (total?: number) => {
    setGrupoMovimiento({ ...grupoMovimiento, totalMonto: total });
  };

  const diasEnMes = obtenerDiasEnElMes(new Date(anio, mes, 1));
  const montoParcial = grupoMovimiento.filas.reduce((acc, fila) => acc + (fila.monto || 0), 0);
  const restoChecked = grupoMovimiento.filas.some((fila) => fila.esRestoDelMonto);

  return (
    <Dialog onClose={handleClose} open={open}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12} className="gridItem-small">
            <Button color="primary" startIcon={<AddIcon />} onClick={handleAgregarFila}>
              Agregar movimiento
            </Button>
          </Grid>
          <Grid item xs={12}>
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
    </Dialog>
  );
};
