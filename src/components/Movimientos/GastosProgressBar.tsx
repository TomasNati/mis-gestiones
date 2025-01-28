import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { transformNumberToCurrenty } from '@/lib/helpers';

interface GastosProgressBarProps {
  presupuesto: number;
  gastado: number;
}

const GastosProgressBar: React.FC<GastosProgressBarProps> = ({ presupuesto, gastado }) => {
  const remaining = presupuesto - gastado;
  const progress = (gastado / presupuesto) * 100;

  const restoFormateado = transformNumberToCurrenty(remaining);
  const gastadoFormateado = transformNumberToCurrenty(gastado);
  const presupuestoFormateado = transformNumberToCurrenty(presupuesto);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: '540px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
