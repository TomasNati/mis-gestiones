import {
  SxProps,
  inputBaseClasses,
  autocompleteClasses,
  outlinedInputClasses,
} from '@mui/material';

interface Styles {
  container: SxProps;
  movimiento: SxProps;
  iconButton: SxProps;
}

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    //TODO: not working yet
    '::-webkit-calendar-picker-indicator': {
      color: 'white',
    },
    '> button:last-child': {
      marginTop: '20px',
    },
  },
  iconButton: {
    width: '20px',
    height: '20px',
    marginBottom: '5px',
  },
  movimiento: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 1200,
    overflowX: 'auto',
    flexDirection: 'row',
    '> div': {
      margin: '0px',
    },
    [`& .${inputBaseClasses.input}`]: {
      padding: '8px',
    },
    [`& .${inputBaseClasses.root}`]: {
      borderRadius: '0px',
      // TODO: avoid applying it to fieldsets on the top-level
      // '> fieldset': {
      //   borderTop: 'none',
      // },
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
