'use client';

import { Box, LinearProgress, Typography } from '@mui/material';
import { transformNumberToCurrenty } from '@/lib/helpers';
import { styles } from './GastosProgressBar.styles';

interface GastosProgressBarProps {
  presupuesto: number;
  gastado: number;
}

const GastosProgressBar: React.FC<GastosProgressBarProps> = ({ presupuesto, gastado }) => {
  const remaining = presupuesto - gastado;
  const progress = presupuesto > 0 ? (gastado / presupuesto) * 100 : 0;

  const restoFormateado = transformNumberToCurrenty(remaining);
  const gastadoFormateado = transformNumberToCurrenty(gastado);
  const presupuestoFormateado = transformNumberToCurrenty(presupuesto);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.barRow}>
        <Box sx={styles.barWrap}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Box sx={styles.barLabel}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
      <Box sx={styles.legendRow}>
        <Typography variant="body2">Presupuesto: {presupuestoFormateado}</Typography>
        <Typography variant="body2">Gastado: {gastadoFormateado}</Typography>
        <Typography variant="body2">
          {remaining >= 0 ? 'Pendiente' : 'Exceso'}: {restoFormateado}
        </Typography>
      </Box>
    </Box>
  );
};

export { GastosProgressBar };
