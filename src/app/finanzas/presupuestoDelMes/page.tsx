'use client';

import { obtenerGastosEstimadosPorAnio } from '@/lib/orm/data';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { useState } from 'react';
import { GastoEstimadoAnualUI, months } from '@/lib/definitions';
import { GastosEstimadosDelMesGrilla } from '@/components/presupuesto/GastosEstimadosDelMesGrilla';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';
import { SeleccionadorPeriodo } from '@/components/comun/SeleccionadorPeriodo';
import { AnioConMeses } from '@/components/comun/seleccionadorPeriodoHelper';

const mesActual: string = months.at(new Date().getMonth()) || 'Enero';

const GastosDelMes = () => {
  const [aniosYMesesElegidos, setAniosYMesesElegidos] = useState<AnioConMeses[]>([]);
  const [gastosEstimados, setGastosEstimados] = useState<GastoEstimadoAnualUI[]>([]);
  const [mostrandoGrilla, setMostrandoGrilla] = useState(true);
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });

  const onAnioConMesesElegidos = async (meses: AnioConMeses[]) => {
    if (!meses.length) return;

    let primerAnioConMeses = meses[0];
    let ultimoAnioConMeses = meses[1] || meses[0];

    const ultimoMes = ultimoAnioConMeses.meses[ultimoAnioConMeses.meses.length - 1];

    const fechaDesde = new Date(primerAnioConMeses.anio, months.indexOf(primerAnioConMeses.meses[0]));
    const fechaHasta = new Date(ultimoAnioConMeses.anio, months.indexOf(ultimoMes));

    const gastosEstimados: GastoEstimadoAnualUI[] = await obtenerGastosEstimadosPorAnio(fechaDesde, fechaHasta);
    const categoriasColapsadasInicialmente = ['Viajes - Total mensual', 'Other - Total mensual'];
    gastosEstimados
      .filter((gasto) => categoriasColapsadasInicialmente.includes(gasto.descripcion))
      .forEach((gasto) => (gasto.colapsado = true));

    setGastosEstimados(gastosEstimados);
    setAniosYMesesElegidos(meses);
  };

  const mostrarInformacion = aniosYMesesElegidos.length > 0;

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
      <SeleccionadorPeriodo />
      {mostrarInformacion && (
        <Box sx={{ height: mostrandoGrilla ? '100%' : 0 }}>
          <GastosEstimadosDelMesGrilla gastos={gastosEstimados} aniosYMesesElegidos={aniosYMesesElegidos} />
        </Box>
      )}
      <Notificacion configuracionProp={configNotificacion} />
    </Box>
  );
};

export default GastosDelMes;
