import { SxProps } from '@mui/system';

interface ThemeSwitcherStyles {
  container: SxProps;
  swatchButton: SxProps;
  swatchDot: SxProps;
}

export const styles: ThemeSwitcherStyles = {
  container: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 60,
    display: 'flex',
    gap: '6px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-soft)',
    borderRadius: '8px',
    padding: '5px',
  },
  swatchButton: {
    width: 30,
    height: 30,
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-elevated)',
    p: 0,
    transition: 'border-color .15s ease',
    '&:hover': {
      borderColor: 'var(--text-tertiary)',
    },
  },
  swatchDot: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,.15)',
  },
};
