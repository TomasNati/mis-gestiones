import { SxProps } from '@mui/system';

interface ToolbarStyles {
  container: SxProps;
}

export const toolbarStyles: ToolbarStyles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '4px',
    gap: 3,
    '& span':  { 
      marginRight: '5px', 
      marginLeft: '5px' 
    },
  }
};
