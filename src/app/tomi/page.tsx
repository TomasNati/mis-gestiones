'use client';

import Box from '@mui/material/Box';
import { obtenerAgendaTomiDias, obtenerTiposNota } from '@/lib/orm/data';
import { Button } from '@mui/material';
import { generateUUID } from '@/lib/helpers';
import { useEffect, useState } from 'react';
import { AgendaTomiDia, TipoNota, months } from '@/lib/definitions';
import { SeleccionadorPeriodo } from '@/components/comun/SeleccionadorPeriodo';
import { EditarDiaModal } from '@/components/tomi/EditarDiaModal';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { actualizarAgendaTomiDia } from '@/lib/orm/actions';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import { SuenioTomi, SuenioAnualTomi } from '@/components/graficos';
import { TablaDiasSuenio } from '@/components/tomi/TablaDiasSuenio';
import { PageHeader } from '@/components/ui';

const anio = new Date().getFullYear();
const mes = months[new Date().getMonth()];
const fechaDiaActual = new Date(Date.UTC(anio, months.indexOf(mes), new Date().getDate()));
const fecha30DiasAtras = new Date(Date.UTC(anio, months.indexOf(mes), new Date().getDate() - 30));

/**
 * Tope de ancho de la columna de contenido, pedido en el mockup (Fase 1, "prueba").
 * Ver `docs/new-theme/plan-rediseno-tema.md`.
 */
const CONTENT_MAX_WIDTH = 1000;

const Suenio = () => {
  const [mostrandoGrilla, setMostrandoGrilla] = useState(true);
  const [dias, setDias] = useState<AgendaTomiDia[]>([]);
  const [diasAGraficar, setDiasAGraficar] = useState<AgendaTomiDia[]>([]);
  const [openEditarDia, setOpenEditarDia] = useState(false);
  const [rangoFechas, setRangoFechas] = useState<{ desde: Date; hasta: Date }>({
    desde: fecha30DiasAtras,
    hasta: fechaDiaActual,
  });
  const [diaAEditar, setDiaAEditar] = useState<AgendaTomiDia | null>(null);
  const [tiposNota, setTiposNota] = useState<TipoNota[]>([]);
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });

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
          notas: [],
          esNuevo: true,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setDias(diasCompletos);

    if (fechaHasta <= fechaDiaActual) {
      setDiasAGraficar(dias);
      setRangoFechas({ desde: fechaDesde, hasta: fechaHasta });
    } else {
      const fecha30DiasAtras = new Date(Date.UTC(anio, months.indexOf(mes), new Date().getDate() - 30));
      setDiasAGraficar([]);
      setRangoFechas({ desde: fecha30DiasAtras, hasta: fechaDiaActual });
    }
  };

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      await oneMesYAnioChanged(mes, anio);
    };
    obtenerDatosIniciales();
  }, []);

  useEffect(() => {
    obtenerTiposNota().then(setTiposNota);
  }, []);

  const onOpenEditarDia = (dia: AgendaTomiDia) => {
    setDiaAEditar(dia);
    setOpenEditarDia(true);
  };

  const onActualizarDia = async (dia: AgendaTomiDia) => {
    const diaAActualizar = dias.find((d) => d.id === dia.id);
    if (diaAActualizar) {
      diaAActualizar.eventos = dia.eventos;
      diaAActualizar.comentarios = dia.comentarios;
      diaAActualizar.notas = dia.notas;
      const resultado = await actualizarAgendaTomiDia(diaAActualizar);
      if (resultado.errores?.length > 0) {
        setConfigNotificacion({
          open: true,
          severity: 'error',
          mensaje: resultado.errores.join(', '),
        });
      } else {
        diaAActualizar.esNuevo = false;
        diaAActualizar.eventos.forEach((evento) => (evento.tipoDeActualizacion = undefined));
        diaAActualizar.notas = (diaAActualizar.notas || []).filter((nota) => nota.tipoDeActualizacion !== 'eliminado');
        diaAActualizar.notas.forEach((nota) => (nota.tipoDeActualizacion = undefined));
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

  const onToggleGraficos = () => {
    setMostrandoGrilla(!mostrandoGrilla);
  };

  const mostrandoGrafico = !mostrandoGrilla;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {diaAEditar ? (
        <EditarDiaModal
          open={openEditarDia}
          onClose={handleEditarDiaClose}
          diaAEditar={diaAEditar}
          onActualizarDia={onActualizarDia}
          tiposNota={tiposNota}
        />
      ) : null}
      {/*
        TODO(rediseño-tema, Fase 10): `styles.main` (Layout) todavía trae `p: 3`
        para no dejar sin aire las páginas no migradas. Este `m: -3` lo cancela
        acá para que la página use el `--gutter` del mockup (28px, bordes a todo
        el ancho). Al quitar el padding de `main`, borrar también este margen.
      */}
      <Box sx={{ display: 'flex', flexDirection: 'column', m: -3, maxWidth: CONTENT_MAX_WIDTH }}>
        <PageHeader
          crumbs={[{ label: 'Tomi', href: '/tomi' }, { label: 'Agenda de sueño' }]}
          actions={
            <Button
              variant="text"
              startIcon={<BarChartOutlinedIcon />}
              aria-pressed={mostrandoGrafico}
              onClick={onToggleGraficos}
              sx={{
                color: mostrandoGrafico ? 'var(--accent)' : 'var(--text-secondary)',
                background: mostrandoGrafico ? 'var(--accent-soft)' : 'transparent',
                '&:hover': {
                  background: mostrandoGrafico ? 'var(--accent-soft)' : 'var(--bg-row-hover)',
                },
              }}
            >
              Gráficos
            </Button>
          }
        />

        <SeleccionadorPeriodo anio={anio} mes={mes} mesesExclusivos setMesYAnio={oneMesYAnioChanged} />

        <Box sx={{ px: 'var(--gutter)' }}>
          <Box
            sx={{
              height: mostrandoGrafico ? '100%' : 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <SuenioTomi rangoFechas={rangoFechas} diasIniciales={diasAGraficar} />
            <SuenioAnualTomi fechaHasta={rangoFechas.hasta} />
          </Box>
        </Box>

        <TablaDiasSuenio dias={dias} onOpenEditarDia={onOpenEditarDia} />
      </Box>
      <Notificacion configuracionProp={configNotificacion} />
    </LocalizationProvider>
  );
};

export default Suenio;
