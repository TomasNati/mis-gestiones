import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Box, Button, DialogContent, IconButton, MenuItem, TextField } from '@mui/material';
import { AgendaTomiDia, AgendaTomiNota, EventoSuenio, TipoNota } from '@/lib/definitions';
import { formatDate, generateUUID } from '@/lib/helpers';
import { useState } from 'react';
import { DormidoDespiertoPicker } from './DormidoDespiertoPicker';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface EditarDiaModalProps {
  open: boolean;
  onClose: () => void;
  onActualizarDia: (dia: AgendaTomiDia) => void;
  diaAEditar: AgendaTomiDia;
  tiposNota: TipoNota[];
}

export const EditarDiaModal = ({ open, onClose, diaAEditar, onActualizarDia, tiposNota }: EditarDiaModalProps) => {
  const [dia, setDia] = useState({ ...diaAEditar });

  const tiposNotaActivos = tiposNota.filter((t) => t.active);

  const handleClose = () => {
    onClose();
  };

  const handleGuardar = () => {
    onActualizarDia(dia);
  };

  const errors = [];

  const diaDisplay = formatDate(dia.fecha, false, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });

  const onEventoChange = (evento: EventoSuenio) => {
    const eventoModificado = dia.eventos.find((e) => e.id === evento.id);
    if (eventoModificado) {
      eventoModificado.hora = evento.hora;
      eventoModificado.tipo = evento.tipo;
      if (eventoModificado.tipoDeActualizacion != 'nuevo') {
        eventoModificado.tipoDeActualizacion = 'modificado';
      }
      setDia({ ...dia });
    }
  };

  const onAddEvento = () => {
    const ultimoEvento = dia.eventos[dia.eventos.length - 1];
    const newEvento: EventoSuenio = {
      id: generateUUID(),
      hora: ultimoEvento?.hora || '00:00',
      tipo: ultimoEvento?.tipo === 'Dormido' ? 'Despierto' : 'Dormido',
      tipoDeActualizacion: 'nuevo',
    };
    setDia({ ...dia, eventos: [...dia.eventos, newEvento] });
  };

  const onDeleteEvento = (evento: EventoSuenio) => {
    const eventoAEliminar = dia.eventos.find((e) => e.id === evento.id);
    if (!eventoAEliminar) {
      return;
    }
    if (eventoAEliminar.tipoDeActualizacion === 'nuevo') {
      setDia({ ...dia, eventos: dia.eventos.filter((e) => e.id !== evento.id) });
      return;
    }
    eventoAEliminar.tipoDeActualizacion = 'eliminado';
    setDia({ ...dia });
  };

  const onAddNota = () => {
    const defaultTipo = tiposNotaActivos[0];
    const newNota: AgendaTomiNota = {
      id: generateUUID(),
      tipo: defaultTipo?.tipo || 'General',
      tipoId: defaultTipo?.id,
      tipoDeActualizacion: 'nuevo',
    };
    setDia({ ...dia, notas: [...(dia.notas || []), newNota] });
  };

  const onNotaTipoChange = (notaId: string, tipoId: string) => {
    const notas = dia.notas || [];
    const nota = notas.find((n) => n.id === notaId);
    if (nota) {
      const tipo = tiposNota.find((t) => t.id === tipoId);
      nota.tipoId = tipoId;
      nota.tipo = tipo?.tipo || nota.tipo;
      if (nota.tipoDeActualizacion !== 'nuevo') {
        nota.tipoDeActualizacion = 'modificado';
      }
      setDia({ ...dia, notas: [...notas] });
    }
  };

  const onNotaComentariosChange = (notaId: string, comentarios: string) => {
    const notas = dia.notas || [];
    const nota = notas.find((n) => n.id === notaId);
    if (nota) {
      nota.comentarios = comentarios;
      if (nota.tipoDeActualizacion !== 'nuevo') {
        nota.tipoDeActualizacion = 'modificado';
      }
      setDia({ ...dia, notas: [...notas] });
    }
  };

  const onDeleteNota = (notaId: string) => {
    const notas = dia.notas || [];
    const nota = notas.find((n) => n.id === notaId);
    if (!nota) return;
    if (nota.tipoDeActualizacion === 'nuevo') {
      setDia({ ...dia, notas: notas.filter((n) => n.id !== notaId) });
      return;
    }
    nota.tipoDeActualizacion = 'eliminado';
    setDia({ ...dia, notas: [...notas] });
  };

  const notasVisibles = (dia.notas || []).filter((n) => n.tipoDeActualizacion !== 'eliminado');

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{diaDisplay}</DialogTitle>
      <DialogContent
        sx={{
          width: '560px',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              sx={{ width: '30px', minWidth: '0px', '& .MuiButton-icon': { marginRight: '0px' } }}
              onClick={onAddEvento}
              color="primary"
              variant="outlined"
              startIcon={<AddIcon />}
              size="small"
            />
          </Box>
          {dia.eventos
            .filter(({ tipoDeActualizacion }) => tipoDeActualizacion != 'eliminado')
            .map((evento) => (
              <DormidoDespiertoPicker
                key={evento.id}
                evento={evento}
                onEventoChange={onEventoChange}
                onDelete={onDeleteEvento}
              />
            ))}
          <Box sx={{ marginTop: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ fontWeight: 500 }}>Notas</Box>
              <Button
                sx={{ minWidth: '30px', padding: '4px', '& .MuiButton-icon': { marginRight: '0px' } }}
                onClick={onAddNota}
                color="primary"
                variant="outlined"
                startIcon={<AddIcon />}
                size="small"
              />
            </Box>
            {notasVisibles.map((nota) => (
              <Box key={nota.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                <TextField
                  select
                  size="small"
                  value={nota.tipoId || ''}
                  onChange={(e) => onNotaTipoChange(nota.id, e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  {tiposNota.map((t) => (
                    <MenuItem key={t.id} value={t.id} disabled={!t.active} sx={!t.active ? { opacity: 0.5 } : undefined}>
                      {t.tipo}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder="Comentario"
                  value={nota.comentarios || ''}
                  onChange={(e) => onNotaComentariosChange(nota.id, e.target.value)}
                />
                <IconButton onClick={() => onDeleteNota(nota.id)} color="secondary" size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <Box display="flex" justifyContent="center" sx={{ padding: '8px' }} gap={2}>
        <Button onClick={handleGuardar} color="primary" variant="contained" disabled={errors.length > 0}>
          Guardar
        </Button>
        <Button onClick={handleClose} color="secondary" sx={{ marginRight: '8px' }}>
          Cancelar
        </Button>
      </Box>
    </Dialog>
  );
};
