import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface ConfirmDeleteModalProps {
  open: boolean;
  description: string;
  handleDelete: () => void;
  handleCancel: () => void;
}

export const ConfirmDeleteModal = ({ open, description, handleDelete, handleCancel }: ConfirmDeleteModalProps) => (
  <Dialog
    open={open}
    onClose={handleCancel}
    aria-labelledby="confirm-delete-title"
    aria-describedby="confirm-delete-description"
    role="alertdialog"
  >
    <DialogTitle id="confirm-delete-title">Confirmar eliminación</DialogTitle>
    <DialogContent>
      <DialogContentText id="confirm-delete-description">
        {`¿Estás seguro que deseas eliminar ${description}?`}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCancel}>Cancelar</Button>
      <Button onClick={handleDelete} color="error" variant="contained" autoFocus>
        Eliminar
      </Button>
    </DialogActions>
  </Dialog>
);
