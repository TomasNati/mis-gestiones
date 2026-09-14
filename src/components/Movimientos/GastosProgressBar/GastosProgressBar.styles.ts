import { SxProps } from '@mui/system';

interface GastosProgressBarStyles {
  container: SxProps;
  barRow: SxProps;
  barWrap: SxProps;
  barLabel: SxProps;
  legendRow: SxProps;
}

export const styles: GastosProgressBarStyles = {
  container: {
    flexGrow: 1,
    maxWidth: '540px',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    mt: 1,
  },
  barWrap: {
    width: '100%',
    mr: 1,
  },
  barLabel: {
    minWidth: 35,
  },
  legendRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};
