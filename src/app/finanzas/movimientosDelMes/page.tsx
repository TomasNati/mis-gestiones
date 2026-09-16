'use client';

import { obtenerMovimientosPorFecha, obtenerGastosEstimadosTotalesPorFecha } from '@/lib/orm/data';
import { Box, Divider, IconButton } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  AnioYMes,
  GrupoMovimiento,
  MovimientoGastoGrilla,
  MovimientoUI,
  ResultadoAPI,
  months,
} from '@/lib/definitions';
import { setDateAsUTC } from '@/lib/helpers';
import { MovimientosDelMesGrillaMRT } from '@/components/Movimientos/MovimientosDelMesGrilla';
import { crearMovimientos, actualizarMovimiento } from '@/lib/orm/actions';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';
import { SeleccionadorPeriodo } from '@/components/comun/SeleccionadorPeriodo';
import { StatsCluster } from '@/components/Movimientos/StatsCluster';
import { TipoDeGastoPorMes, CrecimientoDeGastosEnElMes } from '@/components/graficos/';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Link from 'next/link';

const MovimientosDelMes = () => {
  const [anioYMes, setAnioYMes] = useState<AnioYMes>({
    anio: new Date().getFullYear(),
    mes: months[new Date().getMonth()],
  });
  const [movimientos, setMovimientos] = useState<MovimientoGastoGrilla[]>([]);
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });
  const [totalMensualEstimado, setTotalMensualEstimado] = useState(0);
  const [mostrandoGraficos, setMostrandoGraficos] = useState(false);

  const obtenerMovimientos = useCallback(async (): Promise<MovimientoGastoGrilla[]> => {
    const fecha = new Date(anioYMes.anio, months.indexOf(anioYMes.mes), 1);
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
  }, [anioYMes]);

  useEffect(() => {
    const refrescarMovimientos = async () => {
      const movimientos = await obtenerMovimientos();
      setMovimientos(movimientos);
    };

    refrescarMovimientos();
  }, [anioYMes, obtenerMovimientos]);

  const oneMesYAnioChanged = async (mesNuevo: string, anioNuevo: number) => {
    setAnioYMes({ anio: anioNuevo, mes: mesNuevo });
  };

  const onMovimientoActualizado = async (movimiento: MovimientoGastoGrilla): Promise<MovimientoGastoGrilla> => {
    const movimientoUI: MovimientoUI = {
      ...movimiento,
      subcategoriaId: movimiento.concepto.subcategoriaId,
      detalleSubcategoriaId: movimiento.concepto.detalleSubcategoriaId,
      valido: true,
      filaId: 0,
    };
    let resultado: ResultadoAPI;
    if (movimiento.isNew) {
      const resultadoCrear = await crearMovimientos([movimientoUI]);
      if (resultadoCrear.exitoso) {
        movimiento.id = resultadoCrear.idsCreados[0];
      }
      resultado = resultadoCrear;
    } else {
      resultado = await actualizarMovimiento(movimientoUI);
    }

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
    return movimiento;
  };

  const onCrearGrupoMovimientos = async (grupoMovimiento: GrupoMovimiento) => {
    const movimientosUI: MovimientoUI[] = grupoMovimiento.filas.map((mov) => ({
      comentarios: `${grupoMovimiento.establecimiento}${mov.comentario ? ` - ${mov.comentario}` : ''}`,
      monto: mov.monto || 0,
      tipoDeGasto: grupoMovimiento.tipoDePago,
      fecha: new Date(anioYMes.anio, months.indexOf(anioYMes.mes), grupoMovimiento.dia),
      subcategoriaId: mov.concepto?.subcategoriaId || '',
      detalleSubcategoriaId: mov.concepto?.detalleSubcategoriaId,
      isNew: true,
      valido: true,
      filaId: 0,
    }));

    const resultado = await crearMovimientos(movimientosUI);
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
        mensaje: 'Movimientos agregados correctamente',
      });
    }

    onRefrescarMovimientos();
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

  const mostrarInformacion = !!(anioYMes.anio && anioYMes.mes);

  return (
    <Box>
      {/* Top bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '28px',
          pt: '20px',
          pb: '16px',
        }}
      >
        <Box
          component="nav"
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '19px',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Link href="/finanzas" style={{ color: 'var(--text-tertiary)' }}>
            Finanzas
          </Link>
          <span style={{ color: 'var(--text-tertiary)' }}>/</span>
          <Box component="span" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            Movimientos del mes
          </Box>
        </Box>
      </Box>

      {/* Month tabs + year selector */}
      <SeleccionadorPeriodo
        key={anioYMes.anio}
        anio={anioYMes.anio}
        mes={anioYMes.mes}
        setMesYAnio={oneMesYAnioChanged}
        mesesExclusivos
      />

      {mostrarInformacion && (
        <>
          {/* Charts (collapsible) */}
          {mostrandoGraficos && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                py: '16px',
              }}
            >
              <TipoDeGastoPorMes movimientos={movimientos} />
              <CrecimientoDeGastosEnElMes movimientos={movimientos} totalEstimado={totalMensualEstimado} />
            </Box>
          )}
          <Divider sx={{ borderColor: 'var(--border-soft)' }}>
            <IconButton onClick={() => setMostrandoGraficos((v) => !v)} sx={{ color: 'var(--text-tertiary)' }}>
              {mostrandoGraficos ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Divider>

          {/* Stats cluster */}
          <StatsCluster
            presupuesto={totalMensualEstimado || 0}
            gastado={movimientos.reduce((acc, mov) => acc + (mov.monto || 0), 0)}
            pt="0"
          />

          {/* Data grid with integrated toolbar */}
          <MovimientosDelMesGrillaMRT
            movimientos={movimientos}
            anio={anioYMes.anio}
            mes={months.indexOf(anioYMes.mes)}
            totalMensualEstimado={totalMensualEstimado || 0}
            onMovimientoActualizado={onMovimientoActualizado}
            onMovimientosEliminados={onMovimientosEliminados}
            onRefrescarMovimientos={onRefrescarMovimientos}
            onCrearGrupoMovimientos={onCrearGrupoMovimientos}
          />
        </>
      )}
      <Notificacion configuracionProp={configNotificacion} />
    </Box>
  );
};

export default MovimientosDelMes;
