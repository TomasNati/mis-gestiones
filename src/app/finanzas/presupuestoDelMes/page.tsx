'use client';

import { obtenerGastosEstimadosPorFecha } from '@/lib/orm/data';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { GastosEstimado, months } from '@/lib/definitions';
import { setDateAsUTC } from '@/lib/helpers';
import { GastosEstimadosDelMesGrilla } from '@/components/presupuesto/GastosEstimadosDelMesGrilla';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';
import { SeleccionadorPeriodo } from '@/components/Movimientos/SeleccionadorPeriodo';

const GastosDelMes = () => {
  const [anio, setAnio] = useState<number | undefined>(0);
  const [mes, setMes] = useState(months[new Date().getMonth()]);
  const [gastosEstimados, setGastosEstimados] = useState<GastosEstimado[]>([]);
  const [mostrandoGrilla, setMostrandoGrilla] = useState(true);
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });

  useEffect(() => {
    const obtenerGastosEstimados = async () => {
      if (anio && mes) {
        const obtenerGastosEstimadosParaLaFechaElegida = async () => {
          const fecha = new Date(anio, months.indexOf(mes), 1);
          const primerDiaDelMesActual = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
          const gastosEstimados = await obtenerGastosEstimadosPorFecha(primerDiaDelMesActual);

          gastosEstimados.forEach((mov) => {
            mov.fecha = setDateAsUTC(mov.fecha);
          });
          return gastosEstimados;
        };

        const gastosEstimados = await obtenerGastosEstimadosParaLaFechaElegida();
        setGastosEstimados(gastosEstimados);
      }
    };
    obtenerGastosEstimados();
  }, [mes, anio]);

  useEffect(() => {
    setAnio(new Date().getFullYear());
  }, []);

  const mostrarInformacion = !!(anio && mes);

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
          <Typography color="text.primary">Gastos estimados del mes</Typography>
        </Breadcrumbs>
      </Box>
      <SeleccionadorPeriodo anio={anio} setAnio={setAnio} mes={mes} setMes={setMes} />
      {mostrarInformacion && (
        <Box sx={{ height: mostrandoGrilla ? '100%' : 0 }}>
          <GastosEstimadosDelMesGrilla gastos={gastosEstimados} anio={anio} mes={months.indexOf(mes)} />
        </Box>
      )}
      <Notificacion configuracionProp={configNotificacion} />
    </Box>
  );
};

export default GastosDelMes;
