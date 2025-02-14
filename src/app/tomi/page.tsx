'use client';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { obtenerAgendaTomiDias } from '@/lib/orm/data';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { obtenerDiaYDiaDeLaSemana } from '@/lib/helpers';
import BarraSuenio from '@/components/tomi/BarraSuenio';
import { useState, useEffect } from 'react';
import { AgendaTomiDia, months } from '@/lib/definitions';
import { SeleccionadorPeriodo } from '@/components/Movimientos/SeleccionadorPeriodo';

const Suenio = () => {
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [mes, setMes] = useState(months[new Date().getMonth()]);
  const [dias, setDias] = useState<AgendaTomiDia[]>([]);

  useEffect(() => {
    const refrescarDias = async () => {
      const fechaDesde = new Date(Date.UTC(anio, months.indexOf(mes), 1));
      const fechaHasta = new Date(Date.UTC(anio, months.indexOf(mes) + 1, 0));
      console.log(fechaDesde, fechaHasta);
      // const dias = await obtenerAgendaTomiDias(fechaDesde, fechaHasta);
      // setDias(dias);
    };

    refrescarDias();
  }, [mes, anio, setDias]);

  const oneMesYAnioChanged = (mesNuevo: string, anioNuevo: number) => {
    console.log(`Mes: ${mesNuevo} - Año: ${anioNuevo}`);
  };

  const obtenerEstadoSuenioDiaAnterior = (index: number) => {
    if (index === 0) {
      return 'Despierto';
    }
    const diaAnterior = dias[index - 1];

    return diaAnterior.eventos[diaAnterior.eventos.length - 1].tipo;
  };

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
          Dashboard de Agenda de Tomi
        </Typography>
        <SeleccionadorPeriodo
          anio={anio}
          setAnio={setAnio}
          mes={mes}
          setMes={setMes}
          mesesExclusivos
          setMesYAnio={oneMesYAnioChanged}
        />
      </Box>
      <Box>
        <Typography color="primary" variant="h6">
          Sueño de Tomi
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={120}>Fecha</TableCell>
                <TableCell width={300}>Eventos - Text</TableCell>
                <TableCell>Eventos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dias.map((dia, index) => (
                <TableRow key={index}>
                  <TableCell width={120}>{obtenerDiaYDiaDeLaSemana(dia.fecha)}</TableCell>
                  <TableCell width={300}>
                    {dia.eventos.map(({ tipo, hora }) => `Tipo: ${tipo} - Hora: ${hora} || `)}
                  </TableCell>
                  <TableCell>
                    <BarraSuenio data={dia.eventos} estadoSuenioPrevio={obtenerEstadoSuenioDiaAnterior(index)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Suenio;
