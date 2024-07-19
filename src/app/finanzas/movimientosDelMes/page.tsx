'use client';

import { obtenerMovimientosPorFecha, obtenerGastosEstimadosTotalesPorFecha } from '@/lib/orm/data';
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
  const [totalMensualEstimado, setTotalMensualEstimado] = useState(0);

  const obtenerMovimientos = async (): Promise<MovimientoGastoGrilla[]> => {
    if (!anio || !mes) return [];

    const fecha = new Date(anio, months.indexOf(mes), 1);
    const primerDiaDelMesActual = new Date(fecha.getFullYear(), fecha.getMonth(), 1);

    const [movimientos, totalEstimadoParaElMes] = await Promise.all([
      obtenerMovimientosPorFecha(primerDiaDelMesActual),
      obtenerGastosEstimadosTotalesPorFecha(primerDiaDelMesActual),
    ]);

    setTotalMensualEstimado(totalEstimadoParaElMes);

    const movimientosNoCredito = movimientos.filter((movimiento) => movimiento.tipoDeGasto.toString() !== 'Credito');
    const movimientosCredito = movimientos.filter((movimiento) => movimiento.tipoDeGasto.toString() === 'Credito');
    const movimientosOrdenados = [...movimientosNoCredito, ...movimientosCredito];
    movimientosOrdenados.forEach((mov) => {
      mov.fecha = setDateAsUTC(mov.fecha);
    });
    return movimientosOrdenados;
  };

  useEffect(() => {
    const refrescarMovimientos = async () => {
      const movimientos = await obtenerMovimientos();
      setMovimientos(movimientos);
    };

    refrescarMovimientos();
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

  const onRefrescarMovimientos = async () => {
    const movimientos = await obtenerMovimientos();
    setMovimientos(movimientos);
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
      <SeleccionadorPeriodo anio={anio} setAnio={setAnio} mes={mes} setMes={setMes} mesesExclusivos />
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
            <CrecimientoDeGastosEnElMes movimientos={movimientos} totalEstimado={totalMensualEstimado} />
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
              onRefrescarMovimientos={onRefrescarMovimientos}
            />
          </Box>
        </>
      )}
      <Notificacion configuracionProp={configNotificacion} />
    </Box>
  );
};

export default MovimientosDelMes;
