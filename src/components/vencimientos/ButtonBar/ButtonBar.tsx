import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { styles } from './ButtonBar.styles';

interface ButtonBarProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  onCopy?: () => void;
}

const ButtonBar = ({ onAdd, onEdit, onRemove, onCopy }: ButtonBarProps) => (
  <Box sx={styles.container}>
    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={onAdd} size="small">
      Add
    </Button>
    <Button variant="outlined" color="info" startIcon={<EditIcon />} onClick={onEdit} size="small">
      Edit
    </Button>
    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={onRemove} size="small">
      Remove
    </Button>
    <Button variant="outlined" color="secondary" startIcon={<ContentCopyIcon />} onClick={onCopy} size="small">
      Copy
    </Button>
  </Box>
);

export { ButtonBar };
