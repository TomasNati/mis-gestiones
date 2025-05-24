import { SxProps } from '@mui/system';

interface AgregarEditarModalStyles {
  buttonBar: SxProps;
  datePicker: SxProps;
}

export const styles: AgregarEditarModalStyles = {
  buttonBar: {
    padding: '8px',
  },
  datePicker: {
    width: '160px',
    '& input': {
      padding: '9px',
    },
  },
};
