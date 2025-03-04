'use client';

import { obtenerGastosEstimadosPorAnio } from '@/lib/orm/data';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { useState } from 'react';
import { GastoEstimadoAnualUI, months } from '@/lib/definitions';
import { GastosEstimadosDelMesGrilla } from '@/components/presupuesto/GastosEstimadosDelMesGrilla';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';
import { SeleccionadorPeriodo } from '@/components/comun/SeleccionadorPeriodo';
import { AnioConMeses } from '@/components/comun/seleccionadorPeriodoHelper';

const today = new Date();
const tenMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 10, today.getDate());
const anio = tenMonthsAgo.getFullYear();
const mes = tenMonthsAgo.getMonth();

const GastosDelMes = () => {
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [aniosYMesesVisibles, setAniosYMesesVisibles] = useState<AnioConMeses[]>([]);
  const [mesesElegidos, setMesesElegidos] = useState<string[]>([]);
  const [gastosEstimados, setGastosEstimados] = useState<GastoEstimadoAnualUI[]>([]);
  const [mostrandoGrilla, setMostrandoGrilla] = useState(true);
  const [configNotificacion, setConfigNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });

  const onAnioConMesesElegidos = async (mesesElegidos: string[], mesesVisibles: AnioConMeses[]) => {
    if (!mesesVisibles.length) return;

    let primerAnioConMeses = mesesVisibles[0];
    let ultimoAnioConMeses = mesesVisibles[1] || mesesVisibles[0];

    const ultimoMes = ultimoAnioConMeses.meses[ultimoAnioConMeses.meses.length - 1];

    const fechaDesde = new Date(primerAnioConMeses.anio, months.indexOf(primerAnioConMeses.meses[0]));
    const fechaHasta = new Date(ultimoAnioConMeses.anio, months.indexOf(ultimoMes));

    console.log(`Desde año y mes: ${fechaDesde.getFullYear()} - ${fechaDesde.getMonth() + 1}`);
    console.log(`Hasta año y mes: ${fechaHasta.getFullYear()} - ${fechaHasta.getMonth() + 1}`);
    const gastosEstimados: GastoEstimadoAnualUI[] = await obtenerGastosEstimadosPorAnio(fechaDesde, fechaHasta);
    const categoriasColapsadasInicialmente = ['Viajes - Total mensual', 'Other - Total mensual'];
    gastosEstimados
      .filter((gasto) => categoriasColapsadasInicialmente.includes(gasto.descripcion))
      .forEach((gasto) => (gasto.colapsado = true));

    setGastosEstimados(gastosEstimados);
    setAniosYMesesVisibles(mesesVisibles);
  };

  const mostrarInformacion = aniosYMesesVisibles.length > 0;

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
      <SeleccionadorPeriodo
        anio={anio}
        mes={months[mes]}
        onAnioConMesesElegidos={onAnioConMesesElegidos}
        disableChangeMonths={cambiosPendientes}
      />
      {mostrarInformacion && (
        <Box sx={{ height: mostrandoGrilla ? '100%' : 0 }}>
          <GastosEstimadosDelMesGrilla
            gastos={gastosEstimados}
            aniosYMesesElegidos={aniosYMesesVisibles}
            onTieneCambiosPendientesChanged={setCambiosPendientes}
          />
        </Box>
      )}
      <Notificacion configuracionProp={configNotificacion} />
    </Box>
  );
};

export default GastosDelMes;
