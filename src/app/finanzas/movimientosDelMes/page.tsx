import { obtenerMovimientosPorFecha } from '@/lib/orm/data';
import { Movimientos } from '@/components/Movimientos';
import { Box, Button, Typography } from '@mui/material';
import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import NextLink from 'next/link';
import { TipoDeMovimientoGasto } from '@/lib/definitions';

const MovimientosDelMes = async () => {
  const obtenerMovimientos = async () => {
    const hoy = new Date();
    const primerDiaDelMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const movimientos = await obtenerMovimientosPorFecha(primerDiaDelMesActual);

    const movimientosNoCredito = movimientos.filter((movimiento) => movimiento.tipoDeGasto.toString() !== 'Credito');
    const movimientosCredito = movimientos.filter((movimiento) => movimiento.tipoDeGasto.toString() === 'Credito');
    return [...movimientosNoCredito, ...movimientosCredito];
  };
  const movimientos = await obtenerMovimientos();

  console.log(movimientos.length);
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1" gutterBottom>
          Movimientos del mes
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', marginTop: 3, marginBottom: 3 }}>
        <Button
          component={NextLink}
          variant="outlined"
          startIcon={<PlaylistAdd />}
          color="primary"
          sx={{ marginRight: 2 }}
          href="/finanzas/movimientosDelMes/agregar"
        >
          Agregar
        </Button>
      </Box>
      <Movimientos movimientos={movimientos} />
    </Box>
  );
};

export default MovimientosDelMes;
