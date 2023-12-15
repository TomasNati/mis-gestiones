import {
  SxProps,
  inputBaseClasses,
  autocompleteClasses,
  outlinedInputClasses,
} from '@mui/material';

interface Styles {
  container: SxProps;
}

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    '> div': {
      margin: '0 5px',
    },
    [`& .${inputBaseClasses.input}`]: {
      padding: '8px',
    },
    '& .input-fecha': {
      '> div': {
        width: '145px',
      },
    },
    '& .input-concepto': {
      '> div': {
        width: '250px',
      },
      [`& .${autocompleteClasses.input}`]: {
        padding: 0,
      },
      [`& .${outlinedInputClasses.root}`]: {
        padding: '8px',
      },
    },
    '& .input-tipo-de-pago': {
      '> div': {
        width: '150px',
      },
      [`& .${autocompleteClasses.input}`]: {
        padding: 0,
      },
      [`& .${outlinedInputClasses.root}`]: {
        padding: '8px',
      },
    },
    '& .input-monto': {
      '> div': {
        width: '180px',
      },
    },
  },
};

export { styles };
