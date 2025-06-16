import { SxProps } from '@mui/system';

interface CopiarModalStyles {
  datePicker: SxProps;
  buttonBar: SxProps;
}

export const styles: CopiarModalStyles = {
  datePicker: {
    width: '160px',
    marginTop: '6px',
    '& input': {
      padding: '9px',
    },
  },
  buttonBar: {
    padding: '8px',
  },
};
