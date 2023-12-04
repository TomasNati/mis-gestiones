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
} from '@mui/material';

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
      </Box>
    </Container>
  );
}
