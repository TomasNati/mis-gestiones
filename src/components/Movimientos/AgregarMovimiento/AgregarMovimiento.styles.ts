import {
  SxProps,
  inputBaseClasses,
  autocompleteClasses,
  outlinedInputClasses,
} from '@mui/material';

interface Styles {
  container: SxProps;
  movimiento: SxProps;
}

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  movimiento: {
    display: 'flex',
    minWidth: 1200,
    overflowX: 'auto',
    flexDirection: 'row',
    '> div': {
      margin: '2px',
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
        padding: '0 !important',
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
        padding: '0 !important',
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
    '& .input-detalle': {
      '> div': {
        width: '380px',
      },
    },
  },
};

export { styles };
