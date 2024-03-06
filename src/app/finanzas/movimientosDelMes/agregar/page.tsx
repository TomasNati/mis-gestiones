import { AgregarMovimientos } from '@/components/Movimientos/AgregarMovimiento';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

const Agregar = () => {
  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/finanzas">
          Finanzas
        </Link>
        <Link underline="hover" color="inherit" href="/finanzas/movimientosDelMes">
          Movimientos del mes
        </Link>
        <Typography color="text.primary">Agregar</Typography>
      </Breadcrumbs>
      <AgregarMovimientos />
    </Box>
  );
};

export default Agregar;
