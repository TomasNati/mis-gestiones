import { SxProps } from '@mui/system';

interface StatsClusterStyles {
  container: SxProps;
  statBlock: SxProps;
  statLabel: SxProps;
  statValue: SxProps;
  statValueAccent: SxProps;
  progressWrap: SxProps;
  progressTrack: SxProps;
  progressFill: SxProps;
  progressLegend: SxProps;
  progressPct: SxProps;
}

export const styles: StatsClusterStyles = {
  container: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '32px',
    borderBottom: '1px solid var(--border-soft)',
    px: '28px',
    py: '22px',
  },
  statBlock: {
    flex: '0 0 220px',
    pr: '32px',
    borderRight: '1px solid var(--border-soft)',
  },
  statLabel: {
    fontSize: '11.5px',
    color: 'var(--text-tertiary)',
    mb: '5px',
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  statValue: {
    fontSize: '19px',
    fontWeight: 500,
    fontFamily: "'IBM Plex Mono', sans-serif",
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums',
  },
  statValueAccent: {
    fontSize: '19px',
    fontWeight: 500,
    fontFamily: "'IBM Plex Mono', sans-serif",
    color: 'var(--accent)',
    fontVariantNumeric: 'tabular-nums',
  },
  progressWrap: {
    flex: '0 0 220px',
    pr: '32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '8px',
  },
  progressTrack: {
    height: '5px',
    background: 'var(--bg-elevated)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'var(--accent)',
    borderRadius: '3px',
    transition: 'width .3s ease',
  },
  progressLegend: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11.5px',
    color: 'var(--text-tertiary)',
  },
  progressPct: {
    color: 'var(--accent)',
    fontVariantNumeric: 'tabular-nums',
  },
};
