import { SxProps } from '@mui/system';

interface FiltrosStyles {
  datePicker: SxProps;
  concepto: SxProps;
}

export const styles: FiltrosStyles = {
  datePicker: {
    width: '160px',
    '& input': {
      padding: '9px',
    },
  },
  concepto: { width: '250px' },
};
