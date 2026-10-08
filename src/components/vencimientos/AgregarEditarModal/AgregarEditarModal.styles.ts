import { SxProps } from '@mui/system';

interface AgregarEditarModalStyles {
  buttonBar: SxProps;
  datePicker: SxProps;
  comprobantesSection: SxProps;
  loadingOverlay: SxProps;
}

export const styles: AgregarEditarModalStyles = {
  buttonBar: {
    padding: '8px',
  },
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    bgcolor: 'rgba(0,0,0, 0.8)',
    borderRadius: 1,
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
