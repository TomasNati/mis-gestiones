import { SxProps } from '@mui/system';

interface FiltrosStyles {
  datePicker: SxProps;
  tipo: SxProps;
  buttonsContainer: SxProps;
}

export const styles: FiltrosStyles = {
  datePicker: {
    width: '160px',
    '& input': {
      padding: '9px',
    },
  },
  tipo: { width: '250px' },
  buttonsContainer: {
    display: 'flex',
    gap: '9px',
    '& button': {
      height: '41px',
    },
  },
};
