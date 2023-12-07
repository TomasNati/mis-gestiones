'use client';
import { obtenerMovimientosDelMes } from '@/lib/data';
import { Movimientos } from '@/components/Movimientos';
import { Box, Button, Typography } from '@mui/material';
import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import { AgregarMovimiento } from '@/components/Movimientos/AgregarMovimiento';
import { useState } from 'react';

const MovimientosDelMes = () => {
  const [agregarMovimiento, setAgregarMovimiento] = useState(false);
  const movimientos = obtenerMovimientosDelMes(new Date());

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
          variant="outlined"
          startIcon={<PlaylistAdd />}
          color="primary"
          sx={{ marginRight: 2 }}
          onClick={() => setAgregarMovimiento(true)}
        >
          Agregar
        </Button>
      </Box>
      {agregarMovimiento && <AgregarMovimiento />}
      <Movimientos movimientos={movimientos} />
    </Box>
  );
};

export default MovimientosDelMes;
