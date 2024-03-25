import { MovimientoGastoGrilla } from '@/lib/definitions';
import { Box, Dialog, DialogTitle } from '@mui/material';

interface ExportarMovimientoProps {
  movimientos: MovimientoGastoGrilla[];
  open: boolean;
  onDialogClosed: () => void;
}
const ExportarMovimiento = ({ movimientos, onDialogClosed, open }: ExportarMovimientoProps) => {
  const handleClose = () => {
    onDialogClosed();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Movimientos</DialogTitle>
      <div>
        {movimientos.map((movimiento) => (
          <Box sx={{ marginLeft: '5px' }}>
            <span style={{ marginRight: '5px' }}>{movimiento.fecha.getDate()}</span>
            <span style={{ marginRight: '5px' }}>{movimiento.concepto.nombre}</span>
            <span style={{ marginRight: '5px' }}>{movimiento.tipoDeGasto}</span>
            <span style={{ marginRight: '5px' }}>{movimiento.monto}</span>
            <span style={{ marginRight: '5px' }}>{movimiento.comentarios}</span>
          </Box>
        ))}
      </div>
    </Dialog>
  );
};

export { ExportarMovimiento };
