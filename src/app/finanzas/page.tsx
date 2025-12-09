'use client';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { obtenerUltimosMovimientos } from '@/lib/orm/data';
import { Button } from '@mui/material';
import TableRowsIcon from '@mui/icons-material/TableRows';
import NextLink from 'next/link';
import { Movimientos } from '@/components/Movimientos';
import { useEffect, useState } from 'react';
import { MovimientoGastoGrilla } from '@/lib/definitions';

const Finanzas = () => {
  const [movimientosDashboard, setMovimientosDashboard] = useState<MovimientoGastoGrilla[]>([]);

  useEffect(() => {
    const fetchMovimientos = async () => {
      const movimientos = await obtenerUltimosMovimientos();
      setMovimientosDashboard(movimientos);
    };

    fetchMovimientos();
  }, []);

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1" gutterBottom>
          Dashboard de finanzas
        </Typography>
      </Box>
      <Box>
        <Typography color="primary" variant="h6">
          Movimientos recientes
        </Typography>
        <Movimientos movimientos={movimientosDashboard} />
        <Box sx={{ display: 'flex', marginTop: 3 }}>
          <Button
            component={NextLink}
            variant="outlined"
            startIcon={<TableRowsIcon />}
            href="/finanzas/movimientosDelMes"
            color="primary"
            sx={{ marginRight: 2 }}
          >
            Ver todos los movimientos
          </Button>
          <Button
            component={NextLink}
            variant="outlined"
            startIcon={<TableRowsIcon />}
            href="/finanzas/presupuestoDelMes"
            color="primary"
            sx={{ marginRight: 2 }}
          >
            Ver el presupuesto por mes
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Finanzas;
