import { SxProps } from '@mui/system';

interface FiltrosMovimientosStyles {
  datePicker: SxProps;
  dropdown: SxProps;
  dropdownSmall: SxProps;
  moneyInput: SxProps;
  container: SxProps;
}

export const styles: FiltrosMovimientosStyles = {
  container: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'primary.main',
      },
      '&:hover fieldset': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'primary.main',
    },
    '& .Mui-focused .MuiInputLabel-root': {
      color: 'primary.main',
    },
  },
  datePicker: {
    width: '160px',
    '& input': {
      padding: '9px',
    },
  },
  dropdown: { width: '300px' },
  dropdownSmall: { width: '200px' },
  moneyInput: { width: '120px' },
};
