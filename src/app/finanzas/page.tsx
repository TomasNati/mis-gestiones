import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { obtenerUltimosMovimientos } from '@/lib/data';
import { Button } from '@mui/material';
import TableRowsIcon from '@mui/icons-material/TableRows';
import NextLink from 'next/link';
import { Movimientos } from '@/components/Movimientos';

export default function StarredPage() {
  const movimientosDashboard = obtenerUltimosMovimientos();

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
            href="/finanzas/movimientosdelmes"
            color="primary"
            sx={{ marginRight: 2 }}
          >
            Ver todos los movimientos
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
