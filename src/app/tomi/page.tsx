'use client';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { obtenerAgendaTomiDias } from '@/lib/orm/data';
import {
  Button,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { obtenerDiaYDiaDeLaSemana } from '@/lib/helpers';
import BarraSuenio from '@/components/tomi/BarraSuenio';
import { useEffect, useState } from 'react';
import { AgendaTomiDia, months } from '@/lib/definitions';
import { SeleccionadorPeriodo } from '@/components/comun/SeleccionadorPeriodo';
import { generateUUID } from '@/lib/helpers';
import EditIcon from '@mui/icons-material/Edit';
import { EditarDiaModal } from '@/components/tomi/EditarDiaModal';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { actualizarAgendaTomiDia } from '@/lib/orm/actions';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { SuenioTomi } from '@/components/graficos';

const anio = new Date().getFullYear();
const mes = months[new Date().getMonth()];
const fechaDiaActual = new Date(Date.UTC(anio, months.indexOf(mes), new Date().getDate()));
const fecha30DiasAtras = new Date(Date.UTC(anio, months.indexOf(mes), new Date().getDate() - 30));

const Suenio = () => {
  const [mostrandoGrilla, setMostrandoGrilla] = useState(true);
  const [dias, setDias] = useState<AgendaTomiDia[]>([]);
  const [diasAGraficar, setDiasAGraficar] = useState<AgendaTomiDia[]>([]);
  const [openEditarDia, setOpenEditarDia] = useState(false);
  const [rangoFechas, setRangoFechas] = useState<{ desde: Date; hasta: Date } | undefined>({
    desde: fecha30DiasAtras,
    hasta: fechaDiaActual,
  });
  const [diaAEditar, setDiaAEditar] = useState<AgendaTomiDia | null>(null);
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      await oneMesYAnioChanged(mes, anio);
    };
    obtenerDatosIniciales();
  }, []);

  const handleEditarDiaClose = () => {
    setDiaAEditar(null);
    setOpenEditarDia(false);
  };

  const oneMesYAnioChanged = async (mesNuevo: string, anioNuevo: number) => {
    const fechaDesde = new Date(Date.UTC(anioNuevo, months.indexOf(mesNuevo), 1));
    const fechaHasta = new Date(Date.UTC(anioNuevo, months.indexOf(mesNuevo) + 1, 0));
    const dias = await obtenerAgendaTomiDias(fechaDesde, fechaHasta);

    const diasCompletos: AgendaTomiDia[] = [];
    let currentDate = fechaDesde;

    while (currentDate <= fechaHasta) {
      const diaExistente = dias.find((dia) => new Date(dia.fecha).toDateString() === currentDate.toDateString());
      if (diaExistente) {
        diasCompletos.push(diaExistente);
      } else {
        diasCompletos.push({
          id: generateUUID(),
          fecha: new Date(currentDate),
          eventos: [],
          esNuevo: true,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setDias(diasCompletos);

    if (fechaHasta <= fechaDiaActual) {
      setDiasAGraficar(dias);
      setRangoFechas(undefined);
    } else {
      const fecha30DiasAtras = new Date(Date.UTC(anio, months.indexOf(mes), new Date().getDate() - 30));
      setDiasAGraficar([]);
      setRangoFechas({ desde: fecha30DiasAtras, hasta: fechaDiaActual });
    }
  };

  const obtenerEstadoSuenioDiaAnterior = (index: number) => {
    if (index === 0) {
      return 'Despierto';
    }
    const diaAnterior = dias[index - 1];

    return diaAnterior.eventos[diaAnterior.eventos.length - 1]?.tipo;
  };

  const onOpenEditarDia = (dia: AgendaTomiDia) => {
    setDiaAEditar(dia);
    setOpenEditarDia(true);
  };

  const onActualizarDia = async (dia: AgendaTomiDia) => {
    const diaAActualizar = dias.find((d) => d.id === dia.id);
    if (diaAActualizar) {
      diaAActualizar.eventos = dia.eventos;
      const resultado = await actualizarAgendaTomiDia(diaAActualizar);
      if (resultado.error) {
        setConfigNotificacion({
          open: true,
          severity: 'error',
          mensaje: resultado.error,
        });
      } else {
        diaAActualizar.esNuevo = false;
        diaAActualizar.eventos.forEach((evento) => (evento.tipoDeActualizacion = undefined));
        setConfigNotificacion({
          open: true,
          severity: 'success',
          mensaje: 'Movimientos agregados correctamente',
        });
      }
      setDias([...dias]);
    }

    setDiaAEditar(null);
    setOpenEditarDia(false);
  };

  const onDividerClicked = () => {
    setMostrandoGrilla(!mostrandoGrilla);
  };

  const mostrandoGrafico = !mostrandoGrilla;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        {diaAEditar ? (
          <EditarDiaModal
            open={openEditarDia}
            onClose={handleEditarDiaClose}
            diaAEditar={diaAEditar}
            onActualizarDia={onActualizarDia}
          />
        ) : null}
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
          <SeleccionadorPeriodo anio={anio} mes={mes} mesesExclusivos setMesYAnio={oneMesYAnioChanged} />
        </Box>
        <Box>
          <Box
            sx={{
              height: mostrandoGrafico ? '100%' : 0,
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <SuenioTomi rangoFechas={rangoFechas} diasIniciales={diasAGraficar} />
          </Box>
          <Divider>
            <IconButton onClick={onDividerClicked}>{mostrandoGrilla ? <ExpandMore /> : <ExpandLess />}</IconButton>
          </Divider>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={120}>Fecha</TableCell>
                  <TableCell>Eventos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dias.map((dia, index) => (
                  <TableRow key={dia.id}>
                    <TableCell
                      width={150}
                      sx={{
                        paddingBottom: '8px',
                        paddingTop: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>{obtenerDiaYDiaDeLaSemana(dia.fecha)}</Box>
                      <Button
                        sx={{ minWidth: '0px', padding: '5px', '& span': { marginLeft: '3px', marginRight: '0px' } }}
                        startIcon={<EditIcon />}
                        onClick={() => onOpenEditarDia(dia)}
                      />
                    </TableCell>
                    <TableCell sx={{ paddingBottom: '0px' }}>
                      <BarraSuenio data={dia.eventos} estadoSuenioPrevio={obtenerEstadoSuenioDiaAnterior(index)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
      <Notificacion configuracionProp={configNotificacion} />
    </LocalizationProvider>
  );
};

export default Suenio;
