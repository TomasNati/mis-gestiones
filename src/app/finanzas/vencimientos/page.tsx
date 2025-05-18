'use client';

import { SeleccionadorPeriodo } from '@/components/comun/SeleccionadorPeriodo';
import { Subcategoria, TipoDeGasto, VencimientoUI } from '@/lib/definitions';
import { formatDate } from '@/lib/helpers';
import { obtenerSubCategorias, obtenerVencimientos } from '@/lib/orm/data';
import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Table, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { FilterComponent } from '@/components/vencimientos/Filtros/Filtros';
import { ButtonBar } from '@/components/vencimientos/ButtonBar/ButtonBar';

const Vencimientos = () => {
  const [vencimientos, setVencimientos] = useState<VencimientoUI[]>([]);
  const [tiposDeVencimientos, setTiposDeVencimientos] = useState<Subcategoria[]>([]);

  useEffect(() => {
    const fetchTiposDeVencimientos = async () => {
      const subcategorias = await obtenerSubCategorias(TipoDeGasto.Fijo);
      //sort subcategorias by categoria
      subcategorias.sort((a, b) => {
        if (a.nombre < b.nombre) {
          return -1;
        }
        if (a.nombre > b.nombre) {
          return 1;
        }
        return 0;
      });
      setTiposDeVencimientos(subcategorias);
    };
    fetchTiposDeVencimientos();
  }, []);

  const mostrarInformacion = true;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <FilterComponent tiposDeVencimientos={tiposDeVencimientos} />
        <ButtonBar />
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
