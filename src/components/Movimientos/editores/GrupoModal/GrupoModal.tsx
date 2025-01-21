import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Autocomplete, Box, Button, DialogContent, Grid, TextField } from '@mui/material';
import { obtenerDiasEnElMes } from '@/lib/helpers';
import { Fecha } from '../Fecha/Fecha';
import { TipoDePagoEdicion } from '../TipoDePago/TipoDePago';
import { CategoriaUIMovimiento, InfoFilaMovimientoGrupo, TipoDeMovimientoGasto } from '@/lib/definitions';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { generateUUID } from '@/lib/helpers';
import { FilaGrupoModal } from './FilaGrupoModal';

const establecimientos = ['Changomás', 'Farmacity', 'Oriente', 'Super Más', 'Vea'];

export interface GrupoModalProps {
  open: boolean;
  onClose: () => void;
  anio: number;
  mes: number;
  categoriasMovimiento: CategoriaUIMovimiento[];
}

export const GrupoModal = ({ onClose, open, anio, mes, categoriasMovimiento }: GrupoModalProps) => {
  const [filas, setFilas] = useState<InfoFilaMovimientoGrupo[]>([]);

  const handleClose = () => {
    onClose();
  };

  const handleAgregarFila = () => {
    setFilas([
      ...filas,
      {
        monto: 0,
        concepto: '',
        id: generateUUID(),
      },
    ]);
  };

  const handleEliminarFila = (id: string) => {
    setFilas(filas.filter((fila) => fila.id !== id));
  };

  const diasEnMes = obtenerDiasEnElMes(new Date(anio, mes, 1));

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
            <Fecha
              size="small"
              initialValue={1}
              diasDelMes={diasEnMes}
              onChange={() => {}}
              onTabPressed={() => {}}
              label="Día"
            />
          </Grid>{' '}
          <Grid item xs={12}>
            {' '}
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              options={establecimientos}
              renderInput={(params) => <TextField {...params} label="Establecimiento" />}
              size="small"
            />
          </Grid>{' '}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
              <label>Tipo de pago</label>
              <TipoDePagoEdicion
                onTipoDePagoChange={(tipoDePago: TipoDeMovimientoGasto) => console.log(tipoDePago)}
                tipoDepagoInicial={undefined}
                onTabPressed={() => {}}
              />
            </Box>
          </Grid>
          <Grid item xs={12} className="gridItem-small">
            <Button color="primary" startIcon={<AddIcon />} onClick={handleAgregarFila}>
              Agregar movimiento
            </Button>
          </Grid>
          <Grid item xs={12}>
            {filas.map((fila) => (
              <FilaGrupoModal
                key={fila.id}
                fila={fila}
                onDeleteClick={handleEliminarFila}
                categoriasMovimiento={categoriasMovimiento}
              />
            ))}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
