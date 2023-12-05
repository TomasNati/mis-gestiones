import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { obtenerUltimosMovimientos } from '@/lib/data';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Icon,
  IconButton,
  Button,
} from '@mui/material';
import TableRowsIcon from '@mui/icons-material/TableRows';
import AddIcon from '@mui/icons-material/Add';
import NextLink from 'next/link';

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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Día</TableCell>
                <TableCell>Concepto</TableCell>
                <TableCell>Tipo de pago</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Detalle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movimientosDashboard.map((movimiento) => (
                <TableRow
                  key={movimiento.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{movimiento.fecha.toLocaleDateString()}</TableCell>
                  <TableCell>{movimiento.subcategoria.nombre}</TableCell>
                  <TableCell>{movimiento.tipoDeGasto}</TableCell>
                  <TableCell>{movimiento.monto}</TableCell>
                  <TableCell>{movimiento.comentarios}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', marginTop: 3 }}>
          <Button
            component={NextLink}
            variant="outlined"
            startIcon={<TableRowsIcon />}
            href="/finanzas/movimientos"
            color="primary"
            sx={{ marginRight: 2 }}
          >
            Ver todos los movimientos
          </Button>
          <Button
            component={NextLink}
            variant="outlined"
            startIcon={<AddIcon />}
            href="/finanzas/movimientos/crear"
            color="secondary"
          >
            Crear movimiento
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
