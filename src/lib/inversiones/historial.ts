import dayjs, { type Dayjs } from 'dayjs';
import type {
  DolarCotizaciones,
  DolarHistorico,
  HistorialInversionesResponse,
  Inversion,
  InversionCompletaIncompleta,
  InversionHistorico,
  ValorInversion,
} from '@/lib/definitions';
import { INSTRUMENTO_MONEDA } from '@/lib/definitions';

export const COLORES_SERIE = [
  '#4493f8',
  '#d95926',
  '#199e70',
  '#c98500',
  '#d55181',
  '#008300',
  '#9085e9',
  '#e66767',
  '#00a6a6',
  '#a855f7',
  '#e0703a',
  '#7aa92f',
] as const;

export interface InstrumentoDelHistorial {
  id: string;
  tick: string;
  nombre: string;
  tipo: string;
  color: string;
}

export const extraerInstrumentosDelHistorial = (
  data: HistorialInversionesResponse | undefined,
): InstrumentoDelHistorial[] => {
  const vistos = new Set<string>();
  const instrumentos: InstrumentoDelHistorial[] = [];

  (data?.por_fecha ?? []).forEach((porFecha) => {
    porFecha.inversiones.forEach(({ inversion }) => {
      const inst = inversion.instrumento;
      if (vistos.has(inst.id)) return;
      vistos.add(inst.id);
      instrumentos.push({
        id: inst.id,
        tick: inst.nombreCorto || inst.codigo || inst.nombre,
        nombre: inst.nombre,
        tipo: inst.tipo.trim() || 'SIN TIPO',
        color: COLORES_SERIE[instrumentos.length % COLORES_SERIE.length],
      });
    });
  });

  return instrumentos;
};

export interface FilaTotalHistorial {
  fecha: string;
  total: number;
}

export const totalesDelHistorial = (
  data: HistorialInversionesResponse | undefined,
  moneda: keyof ValorInversion,
): FilaTotalHistorial[] =>
  (data?.por_fecha ?? [])
    .slice()
    .reverse()
    .map((porFecha) => ({
      fecha: dayjs(porFecha.fecha).format('DD/MM'),
      total: porFecha.inversiones.reduce((acc, inv) => acc + inv.valor[moneda], 0),
    }));

/**
 * Valora una inversión en las cuatro monedas con las cotizaciones del día.
 * Espeja `_calcular_valores` del backend para que el punto de hoy tenga el
 * mismo formato que las filas del histórico.
 */
export const calcularValoresInversion = ({
  inversion,
  monto,
  cotizaciones,
}: {
  inversion: Inversion;
  monto: number;
  cotizaciones: DolarCotizaciones;
}): ValorInversion => {
  const valorNativo = inversion.cantidad * monto;
  const esDolar =
    inversion.instrumento.moneda === INSTRUMENTO_MONEDA.DOLAR_BOLSA ||
    inversion.instrumento.moneda === INSTRUMENTO_MONEDA.DOLAR_CCL;
  const dolarInstrumento =
    inversion.instrumento.moneda === INSTRUMENTO_MONEDA.DOLAR_BOLSA ? cotizaciones.bolsa : cotizaciones.contadoconliqui;
  const valorPesos = esDolar ? valorNativo * dolarInstrumento : valorNativo;

  return {
    peso: valorPesos,
    dolar_oficial: valorPesos / cotizaciones.oficial,
    dolar_ccl: valorPesos / cotizaciones.contadoconliqui,
    dolar_bolsa: valorPesos / cotizaciones.bolsa,
  };
};

interface FiltrosDelHistorial {
  tipo: string[];
  renta: string[];
  moneda: string[];
  broker: string[];
  busqueda: string;
}

/** Mismos filtros que aplica el backend en `/inversiones-historico`. */
const cumpleFiltros = (inversion: Inversion, filtros: FiltrosDelHistorial): boolean => {
  if (filtros.tipo.length > 0 && !filtros.tipo.includes(inversion.instrumento.tipo)) return false;
  if (filtros.renta.length > 0 && !filtros.renta.includes(inversion.instrumento.clase_renta)) return false;
  if (filtros.moneda.length > 0 && !filtros.moneda.includes(inversion.instrumento.moneda)) return false;
  if (filtros.broker.length > 0 && !filtros.broker.includes(inversion.broker)) return false;
  const busqueda = filtros.busqueda.trim().toLocaleLowerCase();
  if (!busqueda) return true;
  return [inversion.instrumento.nombre, inversion.instrumento.codigo ?? ''].some((valor) =>
    valor.toLocaleLowerCase().includes(busqueda),
  );
};

/**
 * El histórico del backend solo contiene snapshots guardados con "Guardar
 * estado"; las inversiones vigentes tienen `fecha = NULL` y no aparecen nunca.
 * Esta función agrega (o reemplaza) la fila de hoy con esas inversiones vivas,
 * valoradas con los precios y cotizaciones que ya tiene la página.
 */
export const conFechaHoy = ({
  data,
  fecha,
  desde,
  hasta,
  inversiones,
  precios,
  cotizaciones,
  filtros,
}: {
  data: HistorialInversionesResponse | undefined;
  fecha: Dayjs;
  desde?: string;
  hasta?: string;
  inversiones: Inversion[] | undefined;
  precios: ReadonlyMap<string, { monto: number; loading: boolean }>;
  cotizaciones: DolarCotizaciones | null;
  filtros: FiltrosDelHistorial;
}): HistorialInversionesResponse | undefined => {
  if (!data || !desde || !hasta || !inversiones?.length || !cotizaciones) return data;

  const hoy = fecha.startOf('day');
  if (hoy.isBefore(dayjs(desde).startOf('day')) || hoy.isAfter(dayjs(hasta).startOf('day'))) return data;

  const dolar: DolarHistorico = {
    ...cotizaciones,
    id: 'hoy',
    active: true,
    fecha: hoy.toISOString(),
  };

  const valorizadas: InversionHistorico[] = [];
  const incompletas: InversionCompletaIncompleta[] = [];
  for (const inversion of inversiones.filter((inv) => cumpleFiltros(inv, filtros))) {
    const precio = precios.get(inversion.instrumento.id);
    if (!precio || precio.loading || !(precio.monto > 0)) {
      incompletas.push({ fecha: hoy.toISOString(), inversion, motivo: 'sin_precio' });
      continue;
    }
    valorizadas.push({
      inversion,
      precio: precio.monto,
      valor: calcularValoresInversion({ inversion, monto: precio.monto, cotizaciones }),
    });
  }

  const esHoy = (fechaFila: string) => dayjs(fechaFila).isSame(hoy, 'day');
  const porFecha = [
    ...data.por_fecha.filter((fila) => !esHoy(fila.fecha)),
    { fecha: hoy.toISOString(), dolar, inversiones: valorizadas },
  ].sort((a, b) => dayjs(b.fecha).valueOf() - dayjs(a.fecha).valueOf());

  return {
    por_fecha: porFecha,
    inversiones_incompletas: [...data.inversiones_incompletas.filter((fila) => !esHoy(fila.fecha)), ...incompletas],
  };
};

export const formatearVariacion = (valor: number): string =>
  `${valor >= 0 ? '+' : '−'}${Math.abs(valor).toFixed(1).replace('.', ',')} %`;

export const ETIQUETA_TIPO_INSTRUMENTO: Record<string, string> = {
  ACCION_LOCAL: 'Acción local',
  ACCION_INTERNACIONAL: 'Acción internacional',
  BONO: 'Bono',
  CEDEAR: 'CEDEAR',
  CRIPTO: 'Cripto',
  ETF: 'ETF',
  FCI: 'FCI',
  FCI_EXTERIOR: 'FCI exterior',
  ON: 'ON',
};

export const ETIQUETA_RENTA: Record<string, string> = {
  VARIABLE: 'Variable',
  FIJA: 'Fija',
  MIXTA: 'Mixta',
};
