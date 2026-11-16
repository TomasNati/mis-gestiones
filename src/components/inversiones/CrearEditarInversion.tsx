import { Instrumento, InversionCreatePayload } from '@/lib/definitions';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { styles } from './CrearEditarInversion.styles';

interface CrearEditarInversionProps {
  createDialogOpen: boolean;
  handleCloseCreateDialog: () => void;
  instrumentos: Instrumento[];
  brokers: string[];
  isPending: boolean;
  handleCreate: (nuevoInstrumento: InversionCreatePayload) => void;
}

/** Etiqueta del mockup: `AAPL · Apple Inc. · CEDEAR` (el ticker en mono). */
const etiquetaInstrumento = (instrumento: Instrumento): string =>
  [instrumento.codigo, instrumento.nombre, instrumento.tipo].filter(Boolean).join(' · ');

export const CrearEditarInversion = ({
  createDialogOpen,
  handleCloseCreateDialog,
  instrumentos,
  brokers,
  isPending,
  handleCreate,
}: CrearEditarInversionProps) => {
  const [selectedInstrumento, setSelectedInstrumento] = useState<Instrumento | null>(null);
  const [cantidad, setCantidad] = useState<string>('');
  const [broker, setBroker] = useState<string>('');

  const cantidadNumero = Number(cantidad);
  const puedeCrear =
    selectedInstrumento !== null &&
    cantidad.trim() !== '' &&
    Number.isFinite(cantidadNumero) &&
    cantidadNumero > 0 &&
    broker.trim() !== '';

  const onCreate = () => {
    if (!puedeCrear) return;
    handleCreate({
      cantidad: cantidadNumero,
      instrumento_id: selectedInstrumento.id,
      broker: broker.trim(),
    });
  };

  return (
    <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog}>
      <DialogTitle sx={styles.titulo}>
        <Box>
          <Box component="h2" sx={styles.tituloTexto}>
            Nueva inversión
          </Box>
          <Box sx={styles.subtitulo}>El precio se toma de la última cotización guardada del instrumento.</Box>
        </Box>
        <IconButton onClick={handleCloseCreateDialog} title="Cerrar" aria-label="Cerrar" sx={styles.cerrar}>
          <CloseIcon sx={styles.iconoCerrar} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={styles.contenido}>
        <Box sx={styles.campo}>
          <Box component="label" htmlFor="inversion-instrumento" sx={styles.etiqueta}>
            Instrumento <Box component="span" sx={styles.requerido}>*</Box>
          </Box>
          <Autocomplete
            id="inversion-instrumento"
            options={instrumentos}
            value={selectedInstrumento}
            onChange={(_, value) => setSelectedInstrumento(value)}
            getOptionLabel={etiquetaInstrumento}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            autoHighlight
            noOptionsText="Sin instrumentos"
            slotProps={{ paper: { sx: styles.popper } }}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={styles.opcion}>
                {option.codigo && <Box component="span" sx={styles.opcionCodigo}>{option.codigo}</Box>}
                <Box component="span">{option.nombre}</Box>
                <Box component="span" sx={styles.opcionTipo}>{option.tipo}</Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField {...params} placeholder="Buscar…" sx={styles.input} />
            )}
          />
          <Box sx={styles.ayuda}>Buscá por ticker o nombre</Box>
        </Box>

        <Box sx={styles.fila}>
          <Box sx={styles.campo}>
            <Box component="label" htmlFor="inversion-cantidad" sx={styles.etiqueta}>
              Cantidad <Box component="span" sx={styles.requerido}>*</Box>
            </Box>
            <TextField
              id="inversion-cantidad"
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="0"
              slotProps={{ htmlInput: { min: 0, step: 'any', autoComplete: 'off' } }}
              sx={[styles.input, styles.inputCantidad]}
            />
          </Box>

          <Box sx={styles.campo}>
            <Box component="label" htmlFor="inversion-broker" sx={styles.etiqueta}>
              Broker <Box component="span" sx={styles.requerido}>*</Box>
            </Box>
            <Autocomplete
              id="inversion-broker"
              options={brokers}
              value={broker}
              onChange={(_, value) => setBroker(value ?? '')}
              freeSolo
              autoHighlight
              slotProps={{ paper: { sx: styles.popper } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="PPI"
                  slotProps={{ htmlInput: { ...params.inputProps, autoComplete: 'off' } }}
                  sx={styles.input}
                />
              )}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseCreateDialog} variant="outlined" sx={styles.botonSecundario}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onCreate}
          startIcon={<CheckIcon />}
          disabled={!puedeCrear || isPending}
        >
          {isPending ? 'Creando…' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
