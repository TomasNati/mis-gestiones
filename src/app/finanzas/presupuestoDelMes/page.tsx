'use client';

import { obtenerGastosEstimadosPorAnio } from '@/lib/orm/data';
import { Box, Breadcrumbs, FormControlLabel, FormGroup, Link, Switch, Typography } from '@mui/material';
import { useState } from 'react';
import { GastoEstimadoAnualUI, months } from '@/lib/definitions';
import { GastosEstimadosDelMesGrilla } from '@/components/presupuesto/GastosEstimadosDelMesGrilla';
import { ConfiguracionNotificacion, Notificacion } from '@/components/Notificacion';
import { SeleccionadorPeriodo } from '@/components/comun/SeleccionadorPeriodo';
import { AnioConMeses } from '@/components/comun/seleccionadorPeriodoHelper';
import { SonIguales } from '@/lib/helpers';

const today = new Date();
const tenMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 10, today.getDate());
const anio = tenMonthsAgo.getFullYear();
const mes = tenMonthsAgo.getMonth();

const PresupuestoDelMes = () => {
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [aniosYMesesAMostrar, setAniosYMesesAMostrar] = useState<AnioConMeses[]>([]);
  const [mesesElegidos, setMesesElegidos] = useState<string[]>([]);
  const [gastosEstimados, setGastosEstimados] = useState<GastoEstimadoAnualUI[]>([]);
  const [mostrandoGrilla] = useState(true);
  const [incluirInactivos, setIncluirInactivos] = useState(false);
  const [configNotificacion] = useState<ConfiguracionNotificacion>({
    open: false,
    severity: 'success',
    mensaje: '',
  });

  const onAnioConMesesElegidos = async (
    mesesElegidos: string[],
    aniosYMesesAMostrarNuevos: AnioConMeses[],
    incluirInactivosVal: boolean,
  ) => {
    if (!aniosYMesesAMostrarNuevos.length) return;

    if (!SonIguales(aniosYMesesAMostrarNuevos, aniosYMesesAMostrar) || incluirInactivosVal !== incluirInactivos) {
      let primerAnioConMeses = aniosYMesesAMostrarNuevos[0];
      let ultimoAnioConMeses = aniosYMesesAMostrarNuevos[1] || aniosYMesesAMostrarNuevos[0];

      const ultimoMes = ultimoAnioConMeses.meses[ultimoAnioConMeses.meses.length - 1];

      const fechaDesde = new Date(primerAnioConMeses.anio, months.indexOf(primerAnioConMeses.meses[0]));
      const fechaHasta = new Date(ultimoAnioConMeses.anio, months.indexOf(ultimoMes));

      const gastosEstimados: GastoEstimadoAnualUI[] = await obtenerGastosEstimadosPorAnio(
        fechaDesde,
        fechaHasta,
        incluirInactivosVal,
      );
      const categoriasColapsadasInicialmente = ['Viajes - Total mensual', 'Other - Total mensual'];
      gastosEstimados
        .filter((gasto) => categoriasColapsadasInicialmente.includes(gasto.descripcion))
        .forEach((gasto) => (gasto.colapsado = true));

      setGastosEstimados(gastosEstimados);
      setAniosYMesesAMostrar(aniosYMesesAMostrarNuevos);
    }
    const todosLosMesesAMostrar = aniosYMesesAMostrarNuevos.flatMap(({ meses }) => meses);
    const mesesElegidosOrdenados = mesesElegidos.sort(
      (a, b) => todosLosMesesAMostrar.indexOf(a) - todosLosMesesAMostrar.indexOf(b),
    );
    setMesesElegidos(mesesElegidosOrdenados);
  };

  const handleIncluirInactivos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncluirInactivos(event.target.checked);
    await onAnioConMesesElegidos(mesesElegidos, aniosYMesesAMostrar, event.target.checked);
  };

  const handleOnAniosYMesesAMostrarChanged = async (
    mesesElegidos: string[],
    aniosYMesesAMostrarNuevos: AnioConMeses[],
  ) => {
    await onAnioConMesesElegidos(mesesElegidos, aniosYMesesAMostrarNuevos, incluirInactivos);
  };

  const mostrarInformacion = aniosYMesesAMostrar.length > 0;

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
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2, gap: 2 }}>
        <SeleccionadorPeriodo
          anio={anio}
          mes={months[mes]}
          onAnioConMesesElegidos={handleOnAniosYMesesAMostrarChanged}
          disableChangeMonths={cambiosPendientes}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={incluirInactivos}
                onChange={handleIncluirInactivos}
                slotProps={{ input: { 'aria-label': 'controlled' } }}
              />
            }
            label="Incluir inactivos"
          />
        </FormGroup>
      </Box>
      {mostrarInformacion && (
        <Box sx={{ height: mostrandoGrilla ? '100%' : 0 }}>
          <GastosEstimadosDelMesGrilla
            gastos={gastosEstimados}
            mesesElegidos={mesesElegidos}
            aniosYMesesAMostrar={aniosYMesesAMostrar}
            onTieneCambiosPendientesChanged={setCambiosPendientes}
          />
        </Box>
      )}
      <Notificacion configuracionProp={configNotificacion} />
    </Box>
  );
};

export default PresupuestoDelMes;
