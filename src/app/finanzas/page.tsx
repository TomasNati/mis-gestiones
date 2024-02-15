import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { obtenerUltimosMovimientos } from '@/lib/orm/data';
import { Button } from '@mui/material';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import NextLink from 'next/link';
import { Movimientos } from '@/components/Movimientos';

const Finanzas = async () => {
  const movimientosDashboard = await obtenerUltimosMovimientos();

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
            startIcon={<ImportExportIcon />}
            href="/finanzas/importar"
            color="primary"
            sx={{ marginRight: 2 }}
          >
            Importar movimientos
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Finanzas;
