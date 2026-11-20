'use client';

import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { obtenerHistorialInversiones, obtenerInversiones } from '@/lib/api';
import type {
  DolarCotizaciones,
  HistorialInversionesPayload,
  InstrumentoMoneda,
  Inversion,
  TipoDolar,
  ValorInversion,
} from '@/lib/definitions';
import { INSTRUMENTO_MONEDA, TIPO_DOLAR, TIPO_DOLAR_LABEL } from '@/lib/definitions';
import type { PrecioInstrumento } from '@/hooks/inversiones/useInversiones';
import {
  ETIQUETA_TIPO_INSTRUMENTO,
  conFechaHoy,
  extraerInstrumentosDelHistorial,
  totalesDelHistorial,
  type InstrumentoDelHistorial,
} from '@/lib/inversiones/historial';
import { ChartPanel } from '@/components/ui';
import { HistorialInversionesGrafico } from './HistorialInversionesGrafico';
import { EvolucionPreciosGrafico, type MetricaPrecios } from './EvolucionPreciosGrafico';
import { FILTROS_INVERSIONES_DEFAULT, type FiltrosInversiones } from './InversionesFiltros';
import { styles } from './EvolucionInversiones.styles';
import { dateFieldSx } from './dateField.styles';

export const RANGO_HISTORIAL = {
  TRES_MESES: '3_MESES',
  SEIS_MESES: '6_MESES',
  UN_ANIO: '1_ANIO',
  OTRO: 'OTRO',
} as const;

export type RangoHistorial = (typeof RANGO_HISTORIAL)[keyof typeof RANGO_HISTORIAL];

const RANGO_INICIAL = RANGO_HISTORIAL.TRES_MESES;

const MESES_POR_RANGO: Record<RangoHistorial, number | null> = {
  [RANGO_HISTORIAL.TRES_MESES]: 3,
  [RANGO_HISTORIAL.SEIS_MESES]: 6,
  [RANGO_HISTORIAL.UN_ANIO]: 12,
  [RANGO_HISTORIAL.OTRO]: null,
};

const RANGO_LABEL: Record<RangoHistorial, string> = {
  [RANGO_HISTORIAL.TRES_MESES]: '3 m',
  [RANGO_HISTORIAL.SEIS_MESES]: '6 m',
  [RANGO_HISTORIAL.UN_ANIO]: '1 a',
  [RANGO_HISTORIAL.OTRO]: 'período elegido',
};

const desdePreset = (rango: RangoHistorial, hasta: Dayjs): Dayjs | null => {
  const meses = MESES_POR_RANGO[rango];
  return meses == null ? null : hasta.subtract(meses, 'month');
};

const crearSolicitud = (desde: Dayjs, hasta: Dayjs, filtros: FiltrosInversiones): HistorialInversionesPayload => {
  const busqueda = filtros.busqueda.trim();
  return {
    desde: desde.toISOString(),
    hasta: hasta.toISOString(),
    tipo: filtros.tipo.length > 0 ? filtros.tipo : undefined,
    clase_renta: filtros.renta.length > 0 ? filtros.renta : undefined,
    broker: filtros.broker.length > 0 ? filtros.broker : undefined,
    moneda: filtros.moneda.length > 0 ? filtros.moneda : undefined,
    busqueda: busqueda || undefined,
  };
};

const resumenFiltros = (filtros: FiltrosInversiones): string => {
  const partes: string[] = [];
  if (filtros.tipo.length > 0) partes.push(`Tipo: ${filtros.tipo.join(', ')}`);
  if (filtros.renta.length > 0) partes.push(`Tipo de renta: ${filtros.renta.join(', ')}`);
  if (filtros.moneda.length > 0) partes.push(`Moneda: ${filtros.moneda.join(', ')}`);
  if (filtros.broker.length > 0) partes.push(`Broker: ${filtros.broker.join(', ')}`);
  const busqueda = filtros.busqueda.trim();
  if (busqueda) partes.push(`Instrumento o código: "${busqueda}"`);
  return partes.join(' · ');
};

const monedaDelValor = (moneda: InstrumentoMoneda, tipoDolar: TipoDolar): keyof ValorInversion => {
  if (moneda === INSTRUMENTO_MONEDA.PESO) return 'peso';
  if (tipoDolar === TIPO_DOLAR.OFICIAL) return 'dolar_oficial';
  if (tipoDolar === TIPO_DOLAR.CCL) return 'dolar_ccl';
  return 'dolar_bolsa';
};

export interface ResumenHistorialInversiones {
  fechaInicial: string;
  totalInicial: number;
  totalFinal: number;
}

interface EvolucionInversionesProps {
  maxFecha: Dayjs;
  moneda: InstrumentoMoneda;
  tipoDolar: TipoDolar;
  filtros: FiltrosInversiones;
  preciosHoy: Map<string, PrecioInstrumento>;
  cotizacionesDolarHoy: DolarCotizaciones | null;
  onResumenHistorial: (resumen: ResumenHistorialInversiones | null) => void;
}

export const EvolucionInversiones = ({
  maxFecha,
  moneda,
  tipoDolar,
  filtros,
  preciosHoy,
  cotizacionesDolarHoy,
  onResumenHistorial,
}: EvolucionInversionesProps) => {
  const [rango, setRango] = useState<RangoHistorial>(RANGO_INICIAL);
  const [desde, setDesde] = useState<Dayjs | null>(() => desdePreset(RANGO_INICIAL, maxFecha));
  const [hasta, setHasta] = useState<Dayjs | null>(maxFecha);
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosInversiones>(() => ({
    ...FILTROS_INVERSIONES_DEFAULT,
  }));
  const [solicitudId, setSolicitudId] = useState(0);
  const [solicitado, setSolicitado] = useState<HistorialInversionesPayload | null>(() => {
    const inicio = desdePreset(RANGO_INICIAL, maxFecha);
    return inicio ? crearSolicitud(inicio, maxFecha, FILTROS_INVERSIONES_DEFAULT) : null;
  });
  const [metrica, setMetrica] = useState<MetricaPrecios>('variacion');
  const [seleccion, setSeleccion] = useState<{ firma: string; ids: string[] }>({ firma: '', ids: [] });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const historicoQuery = useQuery({
    queryKey: ['inversionesHistorico', solicitado, solicitudId],
    queryFn: () => obtenerHistorialInversiones(solicitado as HistorialInversionesPayload),
    enabled: solicitado != null,
  });

  const inversionesHoyQuery = useQuery({
    queryKey: ['inversiones', null],
    queryFn: () => obtenerInversiones(),
  });

  const datosGrafico = useMemo(
    () =>
      conFechaHoy({
        data: historicoQuery.data,
        fecha: maxFecha,
        desde: solicitado?.desde,
        hasta: solicitado?.hasta,
        inversiones: inversionesHoyQuery.data,
        precios: preciosHoy,
        cotizaciones: cotizacionesDolarHoy,
        filtros: filtrosAplicados,
      }),
    [
      historicoQuery.data,
      maxFecha,
      solicitado,
      inversionesHoyQuery.data,
      preciosHoy,
      cotizacionesDolarHoy,
      filtrosAplicados,
    ],
  );

  const instrumentos = useMemo(() => extraerInstrumentosDelHistorial(datosGrafico), [datosGrafico]);

  const firmaInstrumentos = instrumentos.map((inst) => inst.id).join('|');
  // Cada fetch nuevo arranca sin instrumentos marcados: el gráfico queda vacío
  // hasta que el usuario elija qué líneas quiere ver.
  const seleccionados = seleccion.firma === firmaInstrumentos ? seleccion.ids : [];
  const instrumentosVisibles = instrumentos.filter((inst) => seleccionados.includes(inst.id));

  const grupos = useMemo(() => {
    const porTipo = new Map<string, InstrumentoDelHistorial[]>();
    instrumentos.forEach((inst) => {
      const delTipo = porTipo.get(inst.tipo) ?? [];
      delTipo.push(inst);
      porTipo.set(inst.tipo, delTipo);
    });
    return Array.from(porTipo, ([tipo, items]) => ({ tipo, items }));
  }, [instrumentos]);

  const monedaValor = monedaDelValor(moneda, tipoDolar);
  const simbolo = moneda === INSTRUMENTO_MONEDA.PESO ? '$' : 'US$';
  const unidad = moneda === INSTRUMENTO_MONEDA.PESO ? 'Peso' : `Dólar ${TIPO_DOLAR_LABEL[tipoDolar]}`;
  const rangoEsPersonalizado = rango === RANGO_HISTORIAL.OTRO;
  const resumenAplicado = resumenFiltros(filtrosAplicados);
  const rangoTexto = `cierre semanal · ${RANGO_LABEL[rango]}`;

  const resumenHistorial = useMemo<ResumenHistorialInversiones | null>(() => {
    const filas = totalesDelHistorial(datosGrafico, monedaValor);
    if (filas.length < 2 || filas[0].total === 0) return null;
    return {
      fechaInicial: filas[0].fecha,
      totalInicial: filas[0].total,
      totalFinal: filas[filas.length - 1].total,
    };
  }, [datosGrafico, monedaValor]);

  useEffect(() => {
    onResumenHistorial(resumenHistorial);
  }, [resumenHistorial, onResumenHistorial]);

  const handleRangoChange = (_event: MouseEvent<HTMLElement>, nuevoRango: RangoHistorial | null) => {
    if (!nuevoRango) return;
    setRango(nuevoRango);
    if (nuevoRango === RANGO_HISTORIAL.OTRO) return;

    const inicio = desdePreset(nuevoRango, maxFecha);
    if (!inicio) return;
    setDesde(inicio);
    setHasta(maxFecha);
    setSolicitado(crearSolicitud(inicio, maxFecha, filtrosAplicados));
  };

  const handleAplicar = () => {
    if (desde && hasta) setSolicitado(crearSolicitud(desde, hasta, filtrosAplicados));
  };

  const handleAplicarFiltros = () => {
    const inicio = desde ?? (solicitado ? dayjs(solicitado.desde) : desdePreset(RANGO_INICIAL, maxFecha));
    const fin = hasta ?? (solicitado ? dayjs(solicitado.hasta) : maxFecha);
    if (!inicio || !fin) return;

    setFiltrosAplicados({ ...filtros });
    setSolicitado(crearSolicitud(inicio, fin, filtros));
    setSolicitudId((id) => id + 1);
    setAnchorEl(null);
  };

  const toggleInstrumento = (id: string) => {
    setSeleccion((anterior) => {
      const actuales = anterior.firma === firmaInstrumentos ? anterior.ids : [];
      return {
        firma: firmaInstrumentos,
        ids: actuales.includes(id) ? actuales.filter((valor) => valor !== id) : [...actuales, id],
      };
    });
  };

  const toggleGrupo = (ids: string[]) => {
    setSeleccion((anterior) => {
      const actuales = anterior.firma === firmaInstrumentos ? anterior.ids : [];
      const todosMarcados = ids.every((id) => actuales.includes(id));
      const idsDelGrupo = new Set(ids);
      return {
        firma: firmaInstrumentos,
        ids: todosMarcados ? actuales.filter((id) => !idsDelGrupo.has(id)) : Array.from(new Set([...actuales, ...ids])),
      };
    });
  };

  const estadoGrupo = (ids: string[]) => {
    const marcados = ids.filter((id) => seleccionados.includes(id)).length;
    return { todos: marcados === ids.length, algunos: marcados > 0 };
  };

  const handleMetricaChange = (_event: MouseEvent<HTMLElement>, nuevaMetrica: MetricaPrecios | null) => {
    if (nuevaMetrica) setMetrica(nuevaMetrica);
  };

  const renderHistorico = () => {
    if (historicoQuery.isPending) {
      return (
        <Box sx={styles.placeholder}>
          <CircularProgress size={22} />
        </Box>
      );
    }
    if (historicoQuery.isError) {
      return (
        <Box sx={styles.placeholder}>
          <Typography variant="body2" color="text.secondary">
            No se pudo cargar el historial.
          </Typography>
        </Box>
      );
    }
    if (!datosGrafico) {
      return (
        <Box sx={styles.placeholder}>
          <Typography variant="body2" color="text.secondary">
            Sin datos para mostrar.
          </Typography>
        </Box>
      );
    }
    return <HistorialInversionesGrafico data={datosGrafico} moneda={monedaValor} simbolo={simbolo} />;
  };

  return (
    <ChartPanel
      title="Evolución"
      hint={`${unidad} · ${rangoTexto}`}
      aside={
        <>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={rango}
            onChange={handleRangoChange}
            aria-label="Rango del histórico"
            sx={styles.segmented}
          >
            <ToggleButton value={RANGO_HISTORIAL.TRES_MESES}>3 m</ToggleButton>
            <ToggleButton value={RANGO_HISTORIAL.SEIS_MESES}>6 m</ToggleButton>
            <ToggleButton value={RANGO_HISTORIAL.UN_ANIO}>1 a</ToggleButton>
            <ToggleButton value={RANGO_HISTORIAL.OTRO}>
              <CalendarMonthOutlinedIcon sx={{ fontSize: 14 }} />
              Otro
            </ToggleButton>
          </ToggleButtonGroup>
          <Box component="span" aria-hidden sx={styles.separadorHeader} />
          <Button variant="outlined" size="small" onClick={handleAplicarFiltros}>
            Aplicar filtros actuales
          </Button>
        </>
      }
    >
      {rangoEsPersonalizado && (
        <Box sx={styles.rangoPersonalizado}>
          <DatePicker
            label="Desde"
            value={desde}
            onChange={(nuevaFecha) => setDesde(nuevaFecha)}
            maxDate={hasta ?? maxFecha}
            format="DD/MM/YYYY"
            slots={{ openPickerIcon: CalendarMonthOutlinedIcon }}
            slotProps={{
              openPickerIcon: { sx: { fontSize: 16 } },
              textField: {
                size: 'small',
                sx: dateFieldSx,
                inputProps: { 'aria-label': 'Desde' },
              },
            }}
          />
          <DatePicker
            label="Hasta"
            value={hasta}
            onChange={(nuevaFecha) => setHasta(nuevaFecha)}
            minDate={desde ?? undefined}
            maxDate={maxFecha}
            format="DD/MM/YYYY"
            slots={{ openPickerIcon: CalendarMonthOutlinedIcon }}
            slotProps={{
              openPickerIcon: { sx: { fontSize: 16 } },
              textField: {
                size: 'small',
                sx: dateFieldSx,
                inputProps: { 'aria-label': 'Hasta' },
              },
            }}
          />
          <Button variant="contained" size="small" onClick={handleAplicar} disabled={!desde || !hasta}>
            Aplicar
          </Button>
        </Box>
      )}

      {resumenAplicado && (
        <Typography variant="caption" color="text.secondary" sx={styles.filtrosAplicados}>
          <Box component="strong" sx={styles.filtrosAplicadosTitulo}>
            Filtros aplicados:
          </Box>{' '}
          {resumenAplicado}
        </Typography>
      )}

      <Box sx={styles.subhead}>
        <Box component="h4" sx={styles.subheadTitle}>
          Evolución del total
        </Box>
        <Box component="span" sx={styles.subheadHint}>
          cierre semanal · mismo período para ambos gráficos
        </Box>
      </Box>
      {renderHistorico()}

      <Box sx={styles.divider} />

      <Box sx={styles.subhead}>
        <Box component="h4" sx={styles.subheadTitle}>
          Evolución de precios
        </Box>
        <Box component="span" sx={styles.subheadHint}>
          {instrumentosVisibles.length} de {instrumentos.length} instrumentos del histórico
        </Box>
        <Box sx={styles.spacer} />
        <ToggleButtonGroup
          exclusive
          size="small"
          value={metrica}
          onChange={handleMetricaChange}
          aria-label="Métrica del gráfico"
          sx={styles.segmented}
        >
          <ToggleButton value="variacion">Variación %</ToggleButton>
          <ToggleButton value="precio">Precio</ToggleButton>
        </ToggleButtonGroup>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterAltOutlinedIcon />}
          endIcon={<ExpandMoreIcon />}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-haspopup="dialog"
          aria-expanded={anchorEl !== null}
          sx={styles.filtrosButton}
        >
          Filtros
          {instrumentosVisibles.length > 0 && (
            <Box component="span" sx={styles.countBadge}>
              {instrumentosVisibles.length}
            </Box>
          )}
        </Button>

        <Popover
          id="evolucion-precios-filtros"
          open={anchorEl !== null}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          // Mismo problema de foco que los filtros de la grilla (MRT + Popover).
          disableEnforceFocus
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{ paper: { sx: styles.popover } }}
        >
          <Box sx={styles.popoverHeader}>
            <Box component="span">
              <b>Instrumentos</b> · tipos según el histórico consultado
            </Box>
            <Box>
              <Button
                size="small"
                onClick={() => setSeleccion({ firma: firmaInstrumentos, ids: instrumentos.map((inst) => inst.id) })}
                sx={styles.popoverClear}
              >
                Todos
              </Button>
              <Button
                size="small"
                onClick={() => setSeleccion({ firma: firmaInstrumentos, ids: [] })}
                sx={styles.popoverClear}
              >
                Limpiar
              </Button>
            </Box>
          </Box>
          {grupos.map((grupo) => {
            const ids = grupo.items.map((inst) => inst.id);
            const { todos, algunos } = estadoGrupo(ids);
            const etiqueta = ETIQUETA_TIPO_INSTRUMENTO[grupo.tipo] ?? grupo.tipo;

            return (
              <Box key={grupo.tipo} sx={styles.popoverGrupo}>
                <Box sx={styles.popoverGrupoTitulo}>
                  <Checkbox
                    size="small"
                    sx={styles.popoverGrupoCheck}
                    checked={todos}
                    indeterminate={algunos && !todos}
                    onChange={() => toggleGrupo(ids)}
                    inputProps={{ 'aria-label': `Seleccionar todos los instrumentos de ${etiqueta}` }}
                  />
                  <Box component="span" sx={{ ...styles.popoverTipoDot, backgroundColor: grupo.items[0].color }} />
                  {etiqueta}
                  <Box component="span" sx={styles.popoverGrupoCount}>
                    {grupo.items.length}
                  </Box>
                </Box>
                <Box sx={styles.popoverOpciones}>
                  {grupo.items.map((inst) => (
                    <FormControlLabel
                      key={inst.id}
                      sx={styles.popoverOpcion}
                      control={
                        <Checkbox
                          size="small"
                          checked={seleccionados.includes(inst.id)}
                          onChange={() => toggleInstrumento(inst.id)}
                        />
                      }
                      label={
                        <>
                          <Box component="span" sx={{ ...styles.popoverLinea, backgroundColor: inst.color }} />
                          <Box component="span" sx={styles.popoverTick}>
                            {inst.tick}
                          </Box>
                          <Box component="span" sx={styles.popoverNombre}>
                            {inst.nombre}
                          </Box>
                        </>
                      }
                    />
                  ))}
                </Box>
              </Box>
            );
          })}
          <Box sx={styles.popoverFooter}>Incluye instrumentos del histórico y de las inversiones vigentes de hoy.</Box>
        </Popover>
      </Box>

      <Box sx={styles.caption}>
        {metrica === 'variacion'
          ? 'Variación acumulada desde el primer día del período · precio de cierre de cada instrumento, incluido hoy.'
          : 'Precio de cierre de cada instrumento del período, incluido hoy.'}
      </Box>
      <Box sx={styles.priceChartWrap}>
        {instrumentosVisibles.length === 0 ? (
          <Box sx={styles.emptyInline}>
            Marcá instrumentos en <b>Filtros</b> para ver la evolución de sus precios.
          </Box>
        ) : (
          <EvolucionPreciosGrafico
            data={datosGrafico}
            instrumentos={instrumentosVisibles}
            metrica={metrica}
            simbolo={simbolo}
          />
        )}
      </Box>
      <Box sx={styles.priceLegend}>
        {instrumentosVisibles.map((inst) => (
          <Box component="span" key={inst.id} sx={styles.priceLegendItem}>
            <Box component="span" sx={{ ...styles.priceSwatch, backgroundColor: inst.color }} />
            {inst.tick}
            <Box component="span" sx={styles.priceLegendTipo}>
              {ETIQUETA_TIPO_INSTRUMENTO[inst.tipo] ?? inst.tipo}
            </Box>
          </Box>
        ))}
      </Box>
    </ChartPanel>
  );
};;
