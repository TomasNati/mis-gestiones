'use client';

import { SeleccionadorPeriodo } from '@/components/comun/SeleccionadorPeriodo';
import { VencimientoUI } from '@/lib/definitions';
import { formatDate } from '@/lib/helpers';
import { obtenerVencimientos } from '@/lib/orm/data';
import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Table, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { FilterComponent } from '@/components/vencimientos/Filtros/Filtros';

const Vencimientos = () => {
  const [vencimientos, setVencimientos] = useState<VencimientoUI[]>([]);
  const mostrarInformacion = true;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FilterComponent />
      <Box>
        {mostrarInformacion && (
          <Box sx={{ height: '100%' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Día</TableCell>
                    <TableCell>Descripción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vencimientos.map(({ fecha, subcategoria, id }) => (
                    <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{formatDate(fecha)}</TableCell>
                      <TableCell>{subcategoria.descripcion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};
export default Vencimientos;
