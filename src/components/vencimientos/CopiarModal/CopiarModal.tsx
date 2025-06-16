import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { styles } from './CopiarModal.styles';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

interface CopiarModalProps {
  open: boolean;
  onCopiar: (fecha: Date) => void;
  onClose: () => void;
}

export const CopiarModal = ({ onCopiar, onClose, open }: CopiarModalProps) => {
  const [fechaDeCopiado, setFechaDeCopiado] = useState<dayjs.Dayjs | null>(dayjs().add(1, 'month'));

  const handleCopiar = () => {
    if (fechaDeCopiado) {
      onCopiar(fechaDeCopiado.toDate());
    }
  };

  const handleClose = (reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      onClose();
    }
  };

  return (
    <Dialog onClose={(_, reason) => handleClose(reason)} open={open}>
      <DialogTitle>Agregar vencimiento</DialogTitle>
      <DialogContent sx={{ width: 380 }}>
        <DatePicker
          label="Fecha de copiado"
          value={dayjs.utc(fechaDeCopiado)}
          onChange={(date) => setFechaDeCopiado(date)}
          slotProps={{ textField: { fullWidth: true } }}
          sx={styles.datePicker}
          format="DD/MM/YYYY"
        />
      </DialogContent>
      <Box display="flex" justifyContent="center" sx={styles.buttonBar} gap={2}>
        <Button onClick={handleCopiar} color="primary" variant="contained">
          Copiar
        </Button>
        <Button onClick={() => handleClose('')} color="secondary">
          Cancelar
        </Button>
      </Box>
    </Dialog>
  );
};
