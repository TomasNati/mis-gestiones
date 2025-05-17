'use client';

import { SeleccionadorPeriodo } from '@/components/comun/SeleccionadorPeriodo';
import { AnioConMeses } from '@/components/comun/seleccionadorPeriodoHelper';
import { months, VencimientoUI } from '@/lib/definitions';
import { formatDate, SonIguales } from '@/lib/helpers';
import { obtenerVencimientos } from '@/lib/orm/data';
import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Table, Box } from '@mui/material';
import { useState } from 'react';

const today = new Date();
const tenMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 10, today.getDate());
const anio = tenMonthsAgo.getFullYear();
const mes = tenMonthsAgo.getMonth();
const anioConMesActual: AnioConMeses = {
  anio: today.getFullYear(),
  meses: [months[today.getMonth()]],
};

const Vencimientos = () => {
  const [aniosYMesesAMostrar, setAniosYMesesAMostrar] = useState<AnioConMeses[]>([]);
  const [mesesElegidos, setMesesElegidos] = useState<string[]>(anioConMesActual.meses);
  const [vencimientos, setVencimientos] = useState<VencimientoUI[]>([]);

  const onAnioConMesesElegidos = async (mesesElegidos: string[], aniosYMesesAMostrarNuevos: AnioConMeses[]) => {
    if (!aniosYMesesAMostrarNuevos.length) return;

    if (!SonIguales(aniosYMesesAMostrarNuevos, aniosYMesesAMostrar)) {
      setAniosYMesesAMostrar(aniosYMesesAMostrarNuevos);
    }
    const todosLosMesesAMostrar = aniosYMesesAMostrarNuevos.flatMap(({ meses }) => meses);
    const mesesElegidosOrdenados = mesesElegidos.sort(
      (a, b) => todosLosMesesAMostrar.indexOf(a) - todosLosMesesAMostrar.indexOf(b),
    );
    setMesesElegidos(mesesElegidosOrdenados);
  };

  const mostrarInformacion = aniosYMesesAMostrar.length > 0;

  return (
    <Box>
      <SeleccionadorPeriodo
        anio={anioConMesActual.anio}
        mes={anioConMesActual.meses[0]}
        meses={[anioConMesActual]}
        onAnioConMesesElegidos={onAnioConMesesElegidos}
        disableChangeMonths={false}
      />
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
  );
};
export default Vencimientos;
