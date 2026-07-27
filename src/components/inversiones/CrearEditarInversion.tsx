import { Instrumento, InversionCreatePayload } from '@/lib/definitions';
import { Dialog, DialogTitle, DialogContent, Autocomplete, TextField, DialogActions, Button } from '@mui/material';
import { useState } from 'react';

interface CrearEditarInversionProps {
  createDialogOpen: boolean;
  handleCloseCreateDialog: () => void;
  instrumentos: Instrumento[];
  brokers: string[];
  isPending: boolean;
  handleCreate: (nuevoInstrumento: InversionCreatePayload) => void;
}

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

  const onCreate = () => {
    if (!selectedInstrumento || !cantidad || !broker) return;
    handleCreate({
      cantidad: parseFloat(cantidad),
      instrumento_id: selectedInstrumento.id,
      broker,
    });
  };

  return (
    <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Nueva Inversión</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <Autocomplete
          options={instrumentos}
          getOptionLabel={(option) => `${option.nombre} - ${option.tipo}`}
          value={selectedInstrumento}
          onChange={(_, value) => setSelectedInstrumento(value)}
          renderInput={(params) => <TextField {...params} label="Instrumento" required />}
        />
        <TextField
          label="Cantidad"
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          slotProps={{ htmlInput: { min: 0, step: 'any' } }}
          required
        />
        <Autocomplete
          options={brokers}
          value={broker}
          onChange={(_, value) => setBroker(value ?? '')}
          freeSolo
          renderInput={(params) => <TextField {...params} label="Broker" required />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseCreateDialog}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={onCreate}
          disabled={!selectedInstrumento || !cantidad || !broker || isPending}
        >
          {isPending ? 'Creando...' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
