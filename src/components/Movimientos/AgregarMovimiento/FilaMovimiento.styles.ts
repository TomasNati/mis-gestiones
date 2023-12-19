import {
  SxProps,
  inputBaseClasses,
  autocompleteClasses,
  outlinedInputClasses,
} from '@mui/material';

interface Styles {
  movimiento: SxProps;
}

const styles: Styles = {
  movimiento: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 1200,
    overflowX: 'auto',
    flexDirection: 'row',
    '> div': {
      margin: '1px',
    },
    [`& .${inputBaseClasses.input}`]: {
      padding: '8px',
    },
    [`& .${inputBaseClasses.root}`]: {
      borderRadius: '0px',
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
