import { SxProps } from '@mui/system';

interface GrillaToolbarStyles {
  toolbar: SxProps;
  toolBtn: SxProps;
  spacer: SxProps;
  sumaLabel: SxProps;
  sumaValue: SxProps;
}

export const styles: GrillaToolbarStyles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    px: '28px',
    py: '16px',
    borderBottom: '1px solid var(--border-soft)',
    background: 'var(--bg-page)',
  },
  toolBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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
