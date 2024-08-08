'use client';

import { obtenerGastosEstimadosPorAnio } from '@/lib/orm/data';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { GastoEstimadoAnualUI, months } from '@/lib/definitions';
import { GastosEstimadosDelMesGrilla } from '@/components/presupuesto/GastosEstimadosDelMesGrilla';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';
import { SeleccionadorPeriodo } from '@/components/Movimientos/SeleccionadorPeriodo';

const GastosDelMes = () => {
  const [anio, setAnio] = useState<number | undefined>(0);
  const [meses, setMeses] = useState<string[]>(months);
  const [gastosEstimados, setGastosEstimados] = useState<GastoEstimadoAnualUI[]>([]);
  const [mostrandoGrilla, setMostrandoGrilla] = useState(true);
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });

  useEffect(() => {
    const obtenerGastosEstimados = async () => {
      if (anio) {
        const obtenerGastosEstimadosParaLaFechaElegida = async () => {
          const gastosEstimados = await obtenerGastosEstimadosPorAnio(anio);
          return gastosEstimados;
        };

        const gastosEstimados: GastoEstimadoAnualUI[] = await obtenerGastosEstimadosParaLaFechaElegida();
        const categoriasColapsadasInicialmente = ['Viajes - Total mensual', 'Other - Total mensual'];
        gastosEstimados
          .filter((gasto) => categoriasColapsadasInicialmente.includes(gasto.descripcion))
          .forEach((gasto) => (gasto.colapsado = true));

        setGastosEstimados(gastosEstimados);
      }
    };
    obtenerGastosEstimados();
  }, [anio]);

  useEffect(() => {
    setAnio(new Date().getFullYear());
  }, []);

  const mostrarInformacion = !!anio;

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
      <SeleccionadorPeriodo anio={anio} setAnio={setAnio} setMeses={setMeses} meses={meses} />
      {mostrarInformacion && (
        <Box sx={{ height: mostrandoGrilla ? '100%' : 0 }}>
          <GastosEstimadosDelMesGrilla gastos={gastosEstimados} mesesAMostrar={meses} anio={anio} />
        </Box>
      )}
      <Notificacion configuracionProp={configNotificacion} />
    </Box>
  );
};

export default GastosDelMes;
