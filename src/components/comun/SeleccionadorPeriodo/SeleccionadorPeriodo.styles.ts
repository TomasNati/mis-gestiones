import { SxProps } from '@mui/system';

interface SeleccionadorPeriodoStyles {
  exclusiveContainer: SxProps;
  exclusiveNavButton: SxProps;
  exclusiveTab: SxProps;
  chevronIcon: SxProps;
  exclusiveYearSelect: SxProps;
  exclusiveYearMenuItem: SxProps;
  multiContainer: SxProps;
  yearFormControl: SxProps;
  yearSelect: SxProps;
  multiButtonRow: SxProps;
  multiMonthsBox: SxProps;
  multiMonthButton: SxProps;
}

export const styles: SeleccionadorPeriodoStyles = {
  exclusiveContainer: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-soft)',
    overflowX: 'auto',
    gap: 0,
    px: '28px',
    '&::-webkit-scrollbar': { height: 0 },
  },
  exclusiveNavButton: {
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    p: '10px 0',
    transition: 'color .15s ease',
    '&:hover': { color: 'var(--text-primary)' },
  },
  exclusiveTab: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '10px 0 12px',
    mx: '11px',
    fontSize: '13.5px',
    fontFamily: "'IBM Plex Sans', sans-serif",
    whiteSpace: 'nowrap',
    transition: 'color .15s ease, border-color .15s ease',
  },
  chevronIcon: {
    fontSize: 18,
  },
  exclusiveYearSelect: {
    fontSize: '13px',
    fontFamily: "'IBM Plex Sans', sans-serif",
    color: 'var(--text-secondary)',
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-soft)' },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-soft)' },
    '& .MuiSelect-select': { py: '4px', pr: '22px' },
    '& .MuiSvgIcon-root': { color: 'var(--text-secondary)', fontSize: '16px' },
  },
  exclusiveYearMenuItem: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: '13px',
  },
  multiContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '10px',
  },
  yearFormControl: {
    width: '100px',
    marginRight: '10px',
    marginBottom: '5px',
  },
  yearSelect: {
    height: '100%',
    '& .MuiSelect-select': {
      padding: '2px 0 2px 4px',
    },
  },
  multiButtonRow: {
    display: 'flex',
    gap: '10px',
    '& .MuiButtonBase-root': {
      paddingTop: '0px',
      paddingBottom: '0px',
      minWidth: 'unset',
      height: '42.5px',
      '& .MuiButton-iconSizeMedium': {
        margin: '0px',
      },
    },
  },
  multiMonthsBox: {
    display: 'flex',
    gap: '4px',
    pb: '5px',
    alignItems: 'center',
  },
  multiMonthButton: {
    minWidth: 'unset',
    padding: '6px 12px',
    textTransform: 'none',
  },
};
