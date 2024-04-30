'use client';

import { obtenerMovimientosPorFecha } from '@/lib/orm/data';
import { Box, Breadcrumbs, Divider, IconButton, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { MovimientoGastoGrilla, MovimientoUI, ResultadoAPI, months } from '@/lib/definitions';
import { setDateAsUTC } from '@/lib/helpers';
import { MovimientosDelMesGrilla } from '@/components/Movimientos/MovimientosDelMesGrilla';
import { crearMovimientos, actualizarMovimiento } from '@/lib/orm/actions';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';
import { SeleccionadorPeriodo } from '@/components/Movimientos/SeleccionadorPeriodo';
import { TipoDeGastoPorMes, CrecimientoDeGastosEnElMes } from '@/components/graficos/';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';

const getTotalEstimadoPorMes = (mes: string) => {
  switch (mes) {
    case 'Enero':
      return 1146279.72;
    case 'Febrero':
      return 1800856;
    case 'Marzo':
      return 1840851.46;
    case 'Abril':
      return 2947940.98;
    case 'Mayo':
      return 18000;
    case 'Junio':
      return 20000;
    case 'Julio':
      return 22000;
    case 'Agosto':
      return 24000;
    case 'Septiembre':
      return 26000;
    case 'Octubre':
      return 28000;
    case 'Noviembre':
      return 30000;
    case 'Diciembre':
      return 32000;
    default:
      return 0;
  }
};

const MovimientosDelMes = () => {
  const [anio, setAnio] = useState<number | undefined>(0);
  const [mes, setMes] = useState(months[new Date().getMonth()]);
  const [movimientos, setMovimientos] = useState<MovimientoGastoGrilla[]>([]);
  const [mostrandoGrilla, setMostrandoGrilla] = useState(true);
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });

  useEffect(() => {
    const obtenerMovimientos = async () => {
      if (anio && mes) {
        const obtenerMovimientos = async () => {
          const fecha = new Date(anio, months.indexOf(mes), 1);
          const primerDiaDelMesActual = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
          const movimientos = await obtenerMovimientosPorFecha(primerDiaDelMesActual);

          const movimientosNoCredito = movimientos.filter(
            (movimiento) => movimiento.tipoDeGasto.toString() !== 'Credito',
          );
          const movimientosCredito = movimientos.filter(
            (movimiento) => movimiento.tipoDeGasto.toString() === 'Credito',
          );
          const movimientosOrdenados = [...movimientosNoCredito, ...movimientosCredito];
          movimientosOrdenados.forEach((mov) => {
            mov.fecha = setDateAsUTC(mov.fecha);
          });
          return movimientosOrdenados;
        };
        const movimientos = await obtenerMovimientos();
        setMovimientos(movimientos);
      }
    };
    obtenerMovimientos();
  }, [mes, anio]);

  useEffect(() => {
    setAnio(new Date().getFullYear());
  }, []);

  const onMovimientoActualizado = async (movimiento: MovimientoGastoGrilla) => {
    const movimientoUI: MovimientoUI = {
      ...movimiento,
      subcategoriaId: movimiento.concepto.subcategoriaId,
      detalleSubcategoriaId: movimiento.concepto.detalleSubcategoriaId,
      valido: true,
      filaId: 0,
    };
    const resultado = movimiento.isNew
      ? await crearMovimientos([movimientoUI])
      : await actualizarMovimiento(movimientoUI);

    if (!resultado.exitoso) {
      setConfigNotificacion({
        open: true,
        severity: 'error',
        mensaje: resultado.errores.join('\n'),
      });
    } else {
      setConfigNotificacion({
        open: true,
        severity: 'success',
        mensaje: movimiento.isNew ? 'Movimientos agregados correctamente' : 'Movimiento actualizado correctamente',
      });
    }
  };

  const onMovimientosEliminados = (resultado: ResultadoAPI) => {
    if (!resultado.exitoso) {
      setConfigNotificacion({
        open: true,
        severity: 'error',
        mensaje: resultado.errores.join('\n'),
      });
    } else {
      setConfigNotificacion({
        open: true,
        severity: 'success',
        mensaje: 'Movimientos eliminados correctamente',
      });
    }
  };

  const onDividerClicked = () => {
    setMostrandoGrilla(!mostrandoGrilla);
  };

  const mostrarInformacion = !!(anio && mes);
  const mostrandoGrafico = !mostrandoGrilla;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/finanzas">
            Finanzas
          </Link>
          <Typography color="text.primary">Movimientos del mes</Typography>
        </Breadcrumbs>
      </Box>
      <SeleccionadorPeriodo anio={anio} setAnio={setAnio} mes={mes} setMes={setMes} />
      {mostrarInformacion && (
        <>
          <Box
            sx={{
              height: mostrandoGrafico ? '100%' : 0,
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <TipoDeGastoPorMes movimientos={movimientos} />
            <CrecimientoDeGastosEnElMes movimientos={movimientos} totalEstimado={getTotalEstimadoPorMes(mes)} />
          </Box>
          <Divider>
            <IconButton onClick={onDividerClicked}>{mostrandoGrilla ? <ExpandMore /> : <ExpandLess />}</IconButton>
          </Divider>
          <Box sx={{ height: mostrandoGrilla ? '100%' : 0 }}>
            <MovimientosDelMesGrilla
              movimientos={movimientos}
              anio={anio}
              mes={months.indexOf(mes)}
              onMovimientoActualizado={onMovimientoActualizado}
              onMovimientosEliminados={onMovimientosEliminados}
            />
          </Box>
        </>
      )}
      <Notificacion configuracionProp={configNotificacion} />
    </Box>
  );
};

export default MovimientosDelMes;
