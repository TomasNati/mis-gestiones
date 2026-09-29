import { SxProps } from '@mui/system';

interface AgregarEditarModalStyles {
  buttonBar: SxProps;
  datePicker: SxProps;
  comprobantesSection: SxProps;
}

export const styles: AgregarEditarModalStyles = {
  buttonBar: {
    padding: '8px',
  },
  datePicker: {
    width: '160px',
    '& input': {
      padding: '9px',
    },
  },
  comprobantesSection: {
    boxShadow: 'none',
    border: '1px solid',
    borderColor: 'divider',
    '&:before': {
      display: 'none',
    },
    '& .MuiAccordionSummary-root': {
      minHeight: 40,
    },
    '& .MuiAccordionSummary-content': {
      my: 1,
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      my: 1,
    },
  },
};
