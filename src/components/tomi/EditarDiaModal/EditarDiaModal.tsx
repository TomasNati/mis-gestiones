import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, Button, IconButton, MenuItem, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { AgendaTomiDia, AgendaTomiNota, EventoSuenio, TipoEventoSuenio, TipoNota } from '@/lib/definitions';
import { formatDate, generateUUID, timeStringToMinutes } from '@/lib/helpers';
import { useState } from 'react';
import { DormidoDespiertoPicker } from '../DormidoDespiertoPicker';
import { colorDeNota } from '../NotasTooltip';
import { styles, notaOpcionSx } from './EditarDiaModal.styles';

const DIA_EN_MINUTOS = 24 * 60;

interface EditarDiaModalProps {
  open: boolean;
  onClose: () => void;
  onActualizarDia: (dia: AgendaTomiDia) => void;
  diaAEditar: AgendaTomiDia;
  tiposNota: TipoNota[];
  /** Estado con el que venía el día anterior; sirve para calcular las horas dormidas. */
  estadoSuenioPrevio?: TipoEventoSuenio;
}

/** Suma los minutos dormidos del día a partir de los eventos (mismo criterio que el timeline). */
const calcularMinutosDormidos = (eventos: EventoSuenio[], estadoPrevio: TipoEventoSuenio): number => {
  if (eventos.length === 0) return 0;

  let inicio = 0;
  let total = 0;

  eventos.forEach((evento, index) => {
    const fin = timeStringToMinutes(evento.hora);
    const tipo = index === 0 ? estadoPrevio : eventos[index - 1].tipo;
    if (tipo === 'Dormido') total += Math.max(0, fin - inicio);
    inicio = fin;
  });

  if (eventos[eventos.length - 1].tipo === 'Dormido') {
    total += Math.max(0, DIA_EN_MINUTOS - inicio);
  }

  return total;
};

const formatearDuracion = (minutos: number): string => {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas === 0) return `${resto} m`;
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} m`;
};

export const EditarDiaModal = ({
  open,
  onClose,
  diaAEditar,
  onActualizarDia,
  tiposNota,
  estadoSuenioPrevio = 'Despierto',
}: EditarDiaModalProps) => {
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

  const eventosVisibles = dia.eventos.filter(({ tipoDeActualizacion }) => tipoDeActualizacion != 'eliminado');
  const notasVisibles = (dia.notas || []).filter((n) => n.tipoDeActualizacion !== 'eliminado');
  const minutosDormidos = calcularMinutosDormidos(eventosVisibles, estadoSuenioPrevio);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={styles.titulo}>
        <Box>
          <Box component="h2" sx={styles.tituloTexto}>
            {diaDisplay}
          </Box>
          <Box sx={styles.subtitulo}>Eventos de sueño y notas del día</Box>
        </Box>
        <IconButton onClick={handleClose} title="Cerrar" aria-label="Cerrar" sx={styles.cerrar}>
          <CloseIcon sx={styles.iconoCerrar} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={styles.contenido}>
        <Box sx={styles.bloque}>
          <Box sx={styles.blockTitle}>
            <span>Eventos</span>
            <Box component="span" sx={styles.blockHint}>
              {formatearDuracion(minutosDormidos)} dormido
            </Box>
          </Box>

          <Box sx={styles.eventos}>
            {eventosVisibles.map((evento) => (
              <DormidoDespiertoPicker
                key={evento.id}
                evento={evento}
                onEventoChange={onEventoChange}
                onDelete={onDeleteEvento}
              />
            ))}
          </Box>

          <Button variant="text" size="small" startIcon={<AddIcon />} onClick={onAddEvento} sx={styles.botonGhost}>
            Agregar evento
          </Button>

          <Box component="hr" sx={styles.separador} />

          <Box sx={styles.blockTitle}>
            <span>Notas</span>
            <Box component="span" sx={styles.blockHint}>
              {notasVisibles.length} {notasVisibles.length === 1 ? 'nota' : 'notas'}
            </Box>
          </Box>

          <Box sx={styles.eventos}>
            {notasVisibles.map((nota) => (
              <Box key={nota.id} sx={styles.notaFila}>
                <TextField
                  select
                  size="small"
                  value={nota.tipoId || ''}
                  onChange={(e) => onNotaTipoChange(nota.id, e.target.value)}
                  sx={styles.notaTipo}
                  slotProps={{
                    select: {
                      renderValue: (selected) => {
                        const tipo = tiposNota.find((t) => t.id === (selected as string));
                        return (
                          <Box sx={styles.notaValor}>
                            <Box
                              component="span"
                              sx={{ ...styles.notaDot, backgroundColor: colorDeNota(tipo?.tipo || nota.tipo) }}
                            />
                            {tipo?.tipo || nota.tipo}
                          </Box>
                        );
                      },
                    },
                  }}
                >
                  {tiposNota.map((t) => (
                    <MenuItem key={t.id} value={t.id} disabled={!t.active} sx={notaOpcionSx(t.active)}>
                      <Box sx={styles.notaValor}>
                        <Box component="span" sx={{ ...styles.notaDot, backgroundColor: colorDeNota(t.tipo) }} />
                        {t.tipo}
                      </Box>
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
                  sx={styles.notaComentario}
                />
                <IconButton
                  onClick={() => onDeleteNota(nota.id)}
                  title="Quitar nota"
                  aria-label="Quitar nota"
                  sx={styles.borrar}
                >
                  <DeleteIcon sx={styles.iconoBorrar} />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Button variant="text" size="small" startIcon={<AddIcon />} onClick={onAddNota} sx={styles.botonGhost}>
            Agregar nota
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={styles.acciones}>
        <Box component="span" sx={styles.footerTexto}>
          Los eventos se ordenan por hora al guardar
        </Box>
        <Button onClick={handleClose} variant="outlined" sx={styles.botonSecundario}>
          Cancelar
        </Button>
        <Button
          onClick={handleGuardar}
          color="primary"
          variant="contained"
          startIcon={<CheckIcon />}
          disabled={errors.length > 0}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
