import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Box, Button, DialogContent } from '@mui/material';
import { AgendaTomiDia, EventoSuenio } from '@/lib/definitions';
import { formatDate } from '@/lib/helpers';
import { useState } from 'react';
import { DormidoDespiertoPicker } from './DormidoDespiertoPicker';
import AddIcon from '@mui/icons-material/Add';
import { generateUUID } from '@/lib/helpers';

interface EditarDiaModalProps {
  open: boolean;
  onClose: () => void;
  onActualizarDia: (dia: AgendaTomiDia) => void;
  diaAEditar: AgendaTomiDia;
}

export const EditarDiaModal = ({ open, onClose, diaAEditar, onActualizarDia }: EditarDiaModalProps) => {
  const [dia, setDia] = useState({ ...diaAEditar });

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
      setDia({ ...dia });
    }
  };

  const onAddEvento = () => {
    const ultimoEvento = dia.eventos[dia.eventos.length - 1];
    const newEvento: EventoSuenio = {
      id: generateUUID(),
      hora: ultimoEvento?.hora || '00:00',
      tipo: ultimoEvento?.tipo === 'Dormido' ? 'Despierto' : 'Dormido',
      esNuevo: true,
    };
    setDia({ ...dia, eventos: [...dia.eventos, newEvento] });
  };

  const onDeleteEvento = (evento: EventoSuenio) => {
    const eventoAEliminar = dia.eventos.find((e) => e.id === evento.id);
    if (!eventoAEliminar) {
      return;
    }
    if (eventoAEliminar.esNuevo) {
      setDia({ ...dia, eventos: dia.eventos.filter((e) => e.id !== evento.id) });
      return;
    }
    eventoAEliminar.eliminado = true;
    setDia({ ...dia });
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{diaDisplay}</DialogTitle>
      <DialogContent
        sx={{
          width: '300px',
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
            .filter(({ eliminado }) => !eliminado)
            .map((evento) => (
              <DormidoDespiertoPicker
                key={evento.id}
                evento={evento}
                onEventoChange={onEventoChange}
                onDelete={onDeleteEvento}
              />
            ))}
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
