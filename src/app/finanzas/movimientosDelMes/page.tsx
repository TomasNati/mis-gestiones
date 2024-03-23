'use client';

import { obtenerMovimientosPorFecha } from '@/lib/orm/data';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { MovimientoGastoGrilla, MovimientoUI, ResultadoAPI, months } from '@/lib/definitions';
import { setDateAsUTC } from '@/lib/helpers';
import { MovimientosDelMesGrilla } from '@/components/Movimientos/MovimientosDelMesGrilla';
import { crearMovimientos, actualizarMovimiento } from '@/lib/orm/actions';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';
import { SeleccionadorPeriodo } from '@/components/Movimientos/SeleccionadorPeriodo';

const MovimientosDelMes = () => {
  const [anio, setAnio] = useState<number | undefined>(0);
  const [mes, setMes] = useState(months[new Date().getMonth()]);
  const [movimientos, setMovimientos] = useState<MovimientoGastoGrilla[]>([]);
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
      {anio && mes && (
        <MovimientosDelMesGrilla
          movimientos={movimientos}
          anio={anio}
          mes={months.indexOf(mes)}
          onMovimientoActualizado={onMovimientoActualizado}
          onMovimientosEliminados={onMovimientosEliminados}
        />
      )}
      <Notificacion configuracionProp={configNotificacion} />
    </Box>
  );
};

export default MovimientosDelMes;
