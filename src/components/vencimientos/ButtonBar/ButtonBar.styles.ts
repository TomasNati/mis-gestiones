import { SxProps } from '@mui/system';

interface ButtonBarStyles {
  container: SxProps;
}

export const styles: ButtonBarStyles = {
  container: {
    display: 'flex',
    gap: 1,
    paddingTop: 1,
    paddingBottom: 1,
  },
};
