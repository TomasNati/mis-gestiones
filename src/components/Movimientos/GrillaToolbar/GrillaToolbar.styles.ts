import { SxProps } from '@mui/system';

interface GrillaToolbarStyles {
  toolbar: SxProps;
  toolBtn: SxProps;
  addButton: SxProps;
  spacer: SxProps;
  sumaLabel: SxProps;
  sumaValue: SxProps;
}

export const styles: GrillaToolbarStyles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '22px',
    px: '28px',
    py: '16px',
    borderBottom: '1px solid var(--border-soft)',
    background: 'var(--bg-page)',
  },
  toolBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: '13px',
    cursor: 'pointer',
    padding: 0,
    textTransform: 'none',
    minWidth: 'unset',
    '&:hover': {
      color: 'var(--text-primary)',
      background: 'none',
    },
  },
  addButton: {
    color: 'var(--bg-page)',
    background: 'var(--accent)',
    padding: '7px 14px',
    borderRadius: '5px',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '13px',
    fontWeight: 500,
    textTransform: 'none',
    minWidth: 'unset',
    '&:hover': {
      background: 'var(--accent)',
      opacity: 0.9,
    },
  },
  spacer: {
    flex: 1,
  },
  sumaLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  sumaValue: {
    color: 'var(--text-primary)',
  },
};
