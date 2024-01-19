import { obtenerMovimientos } from '@/lib/data';
import { Movimientos } from '@/components/Movimientos';
import { Box, Button, Typography } from '@mui/material';
import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import NextLink from 'next/link';

const MovimientosDelMes = async () => {
  const movimientos = await obtenerMovimientos(); //(new Date());

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
