import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { obtenerAgendaTomiDias } from '@/lib/orm/data';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { obtenerDiaYDiaDeLaSemana } from '@/lib/helpers';
import BarraSuenio from '@/components/tomi/BarraSuenio';

const Suenio = async () => {
  const fechaDesde = new Date(Date.UTC(2025, 0, 1, 0, 0, 0));
  const fechaHasta = new Date(Date.UTC(2025, 0, 31, 23, 59, 59));

  const dias = await obtenerAgendaTomiDias(fechaDesde, fechaHasta);

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
