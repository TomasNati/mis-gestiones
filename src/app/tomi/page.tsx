'use client';

import Box from '@mui/material/Box';
import { obtenerAgendaTomiDias, obtenerTiposNota } from '@/lib/orm/data';
import { Button } from '@mui/material';
import { generateUUID } from '@/lib/helpers';
import { useEffect, useMemo, useState } from 'react';
import { AgendaTomiDia, TipoEventoSuenio, TipoNota, months } from '@/lib/definitions';
import { SeleccionadorPeriodo } from '@/components/comun/SeleccionadorPeriodo';
import { EditarDiaModal } from '@/components/tomi/EditarDiaModal';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { actualizarAgendaTomiDia } from '@/lib/orm/actions';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import { SuenioTomi, SuenioAnualTomi } from '@/components/graficos';
import { TablaDiasSuenio } from '@/components/tomi/TablaDiasSuenio';
import { NotaBadge, NotasDelMesTooltip } from '@/components/tomi/NotasTooltip';
import { calcularStatsSuenio, formatDuracion, formatHora } from '@/components/tomi/estadisticasSuenio';
import { PageHeader, StatsCluster } from '@/components/ui';
import type { StatItem } from '@/components/ui';

const anio = new Date().getFullYear();
const mes = months[new Date().getMonth()];
const fechaDiaActual = new Date(Date.UTC(anio, months.indexOf(mes), new Date().getDate()));
const fecha30DiasAtras = new Date(Date.UTC(anio, months.indexOf(mes), new Date().getDate() - 30));

/**
 * Tope de ancho de la columna de contenido (Fase 1). Ver
 * `docs/new-theme/plan-rediseno-tema.md`.
 */
const CONTENT_MAX_WIDTH = 1250;

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

  const indiceDiaAEditar = diaAEditar ? dias.findIndex((d) => d.id === diaAEditar.id) : -1;
  const estadoSuenioPrevio: TipoEventoSuenio =
    indiceDiaAEditar > 0
      ? dias[indiceDiaAEditar - 1].eventos[dias[indiceDiaAEditar - 1].eventos.length - 1]?.tipo ?? 'Despierto'
      : 'Despierto';

  const stats = useMemo(() => calcularStatsSuenio(dias), [dias]);

  const statsItems: StatItem[] = [
    {
      label: 'Sueño nocturno promedio',
      value: formatDuracion(stats.promedioMinutos),
      tone: 'accent',
    },
    {
      label: 'Se duerme, en promedio',
      value: formatHora(stats.horaDormirPromedio),
      delta:
        stats.horaDespertarPromedio !== null
          ? { text: `se despierta a las ${formatHora(stats.horaDespertarPromedio)}` }
          : undefined,
    },
    {
      label: 'Notas del mes',
      value: stats.totalNotas,
      delta:
        stats.notasPorTipo.length > 0
          ? {
              text: (
                <NotasDelMesTooltip notas={stats.notas}>
                  {stats.notasPorTipo.map(({ tipo, count }) => (
                    <NotaBadge key={tipo} tipo={tipo} count={count} />
                  ))}
                </NotasDelMesTooltip>
              ),
            }
          : undefined,
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {diaAEditar ? (
        <EditarDiaModal
          open={openEditarDia}
          onClose={handleEditarDiaClose}
          diaAEditar={diaAEditar}
          onActualizarDia={onActualizarDia}
          tiposNota={tiposNota}
          estadoSuenioPrevio={estadoSuenioPrevio}
        />
      ) : null}
      {/*
        TODO(rediseño-tema, Fase 10): `styles.main` (Layout) todavía trae `p: 3`
        para no dejar sin aire las páginas no migradas. Este `m: -3` lo cancela
        acá para que la página use el `--gutter` del mockup (28px, bordes a todo
        el ancho). Al quitar el padding de `main`, borrar también este margen.
      */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          m: -3,
          maxWidth: CONTENT_MAX_WIDTH,
          // Contenedor de consulta: los gráficos se apilan según el ancho real
          // de la columna (no del viewport, que cambia con el sidebar).
          containerType: 'inline-size',
        }}
      >
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

        <StatsCluster items={statsItems} />

        <Box
          sx={{
            // Fila 1.7 : 1 (≈740 / 435 a 1250px). El segundo gráfico tiene un
            // mínimo de 435px; si la columna no alcanza para ambos, pasa a una
            // sola columna y el segundo baja debajo del primero.
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 435px',
            gap: '16px',
            p: mostrandoGrafico ? '16px var(--gutter) 20px' : 0,
            height: mostrandoGrafico ? 'auto' : 0,
            borderBottom: mostrandoGrafico ? '1px solid var(--border-soft)' : 'none',
            overflow: 'hidden',
            // 927px = 435 (mínimo del segundo) + 420 (mínimo del primero) + 16 (gap) + 56 (padding lateral).
            '@container (max-width: 926px)': {
              gridTemplateColumns: 'minmax(0, 1fr)',
            },
          }}
        >
          <SuenioTomi rangoFechas={rangoFechas} diasIniciales={diasAGraficar} />
          <SuenioAnualTomi fechaHasta={rangoFechas.hasta} />
        </Box>

        <TablaDiasSuenio dias={dias} onOpenEditarDia={onOpenEditarDia} />
      </Box>
      <Notificacion configuracionProp={configNotificacion} />
    </LocalizationProvider>
  );
};

export default Suenio;
