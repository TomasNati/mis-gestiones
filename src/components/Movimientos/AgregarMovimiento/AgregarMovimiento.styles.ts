import {
  SxProps,
  inputBaseClasses,
  autocompleteClasses,
  outlinedInputClasses,
} from '@mui/material';

interface Styles {
  container: SxProps;
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
};

export { styles };
