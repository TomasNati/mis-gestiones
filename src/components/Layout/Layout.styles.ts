import { SxProps } from '@mui/system';

const ICON_WIDTH = 45;

interface LayoutStyles {
  drawer: SxProps;
  drawerPaper: SxProps;
  logoButton: SxProps;
  submenuList: SxProps;
  spacerDivider: SxProps;
  main: SxProps;
}

export const styles: LayoutStyles = {
  drawer: {
    flexShrink: 0,
  },
  drawerPaper: {
    boxSizing: 'border-box',
    height: 'auto',
    bottom: 0,
    overflowX: 'hidden',
    background: 'var(--bg-panel)',
    borderRight: '1px solid var(--border-soft)',
    color: 'var(--text-secondary)',
    fontFamily: "'IBM Plex Sans', sans-serif",
    '& .MuiListItemIcon-root': {
      minWidth: ICON_WIDTH,
      color: 'var(--text-secondary)',
    },
    '& .MuiListItemButton-root': {
      fontSize: '13px',
      color: 'var(--text-secondary)',
      '&:hover': {
        backgroundColor: 'var(--bg-row-hover)',
        color: 'var(--text-primary)',
        '& .MuiListItemIcon-root': {
          color: 'var(--text-primary)',
        },
      },
    },
    '& .MuiDivider-root': {
      borderColor: 'var(--border-soft)',
    },
  },
  logoButton: {
    px: '14px',
    py: '14px',
    gap: '8px',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    '& .MuiListItemIcon-root': {
      color: 'var(--accent)',
    },
  },
  submenuList: {
    pl: 4,
    '& .MuiListItemButton-root': {
      fontSize: '13px',
    },
  },
  spacerDivider: {
    mt: 'auto',
  },
  main: {
    flexGrow: 1,
    background: 'var(--bg-page)',
    p: 3,
    height: '100vh',
  },
};
