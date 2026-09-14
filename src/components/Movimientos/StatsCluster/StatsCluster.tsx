'use client';

import { Box, Typography } from '@mui/material';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { styles } from './StatsCluster.styles';

interface StatsClusterProps {
  presupuesto: number;
  gastado: number;
  pt?: string;
  pb?: string;
}

const StatsCluster = ({ presupuesto, gastado, pt, pb }: StatsClusterProps) => {
  const pendiente = presupuesto - gastado;
  const progress = presupuesto > 0 ? (gastado / presupuesto) * 100 : 0;
  const progressPct = Math.round(progress);

  return (
    <Box sx={{ ...styles.container, ...(pt !== undefined && { pt }), ...(pb !== undefined && { pb }) }}>
      {/* Presupuesto */}
      <Box sx={styles.statBlock}>
        <Typography sx={styles.statLabel}>Presupuesto</Typography>
        <Typography sx={styles.statValue}>$ {transformNumberToCurrenty(presupuesto, 0)}</Typography>
      </Box>

      {/* Gastado */}
      <Box sx={styles.statBlock}>
        <Typography sx={styles.statLabel}>Gastado</Typography>
        <Typography sx={styles.statValueAccent}>$ {transformNumberToCurrenty(gastado, 0)}</Typography>
      </Box>

      {/* Pendiente */}
      <Box sx={styles.statBlock}>
        <Typography sx={styles.statLabel}>Pendiente</Typography>
        <Typography sx={styles.statValue}>$ {transformNumberToCurrenty(pendiente, 0)}</Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={styles.progressWrap}>
        <Box sx={styles.progressTrack}>
          <Box sx={{ ...styles.progressFill, width: `${Math.min(progressPct, 100)}%` }} />
        </Box>
        <Box sx={styles.progressLegend}>
          <span>del presupuesto usado</span>
          <Box component="span" sx={styles.progressPct}>
            {progressPct}%
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { StatsCluster };
