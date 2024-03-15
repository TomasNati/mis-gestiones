import { MovimientoGastoGrilla } from '@/lib/definitions';
import { formatDate } from '@/lib/helpers';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const Movimientos = ({ movimientos }: { movimientos: MovimientoGastoGrilla[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Día</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Concepto</TableCell>
            <TableCell>Tipo de pago</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Detalle</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movimientos.map((movimiento) => (
            <TableRow key={movimiento.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{formatDate(movimiento.fecha)}</TableCell>
              <TableCell>{movimiento.categoria}</TableCell>
              <TableCell>{movimiento.concepto.nombre}</TableCell>
              <TableCell>{movimiento.tipoDeGasto}</TableCell>
              <TableCell>{movimiento.monto}</TableCell>
              <TableCell>{movimiento.comentarios}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { Movimientos };
