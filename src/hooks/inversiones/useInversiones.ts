import { useEffect, useMemo, useState } from 'react';
import type { MRT_RowSelectionState } from 'material-react-table';
import {
  DolarCotizaciones,
  INSTRUMENTO_MONEDA,
  Instrumento,
  InstrumentoMoneda,
  InstrumentoPrecio,
  Inversion,
} from '@/lib/definitions';
import { createPrecio } from '@/lib/api';
import { PRECIO_FETCHERS, findTodayPrecio, todayISO } from '@/lib/inversiones/precios';
import { transformNumberToCurrenty } from '@/lib/helpers';

interface PrecioInstrumento {
  simbolo: string;
  precio: string;
  monto: number;
  loading: boolean;
}

export interface DatoGrafico {
  label: string;
  value: number;
}

const MAX_CATEGORIAS = 8;

export const calcularValorInversion = ({
  inversion,
  precioPorInstrumento,
  moneda,
  ventaDolar,
  cotizacionesDolar,
}: {
  inversion: Inversion;
  precioPorInstrumento: Map<string, PrecioInstrumento>;
  moneda: InstrumentoMoneda;
  ventaDolar: number;
  cotizacionesDolar: DolarCotizaciones | null;
}): number => {
  const enPesos = moneda === INSTRUMENTO_MONEDA.PESO;
  const monto = precioPorInstrumento.get(inversion.instrumento.id)?.monto ?? 0;
  const valorNativo = inversion.cantidad * monto;
  const esDolar = MONEDAS_DOLAR.includes(inversion.instrumento.moneda);
  const precioDolarInstrumento =
    inversion.instrumento.moneda === INSTRUMENTO_MONEDA.DOLAR_BOLSA
      ? cotizacionesDolar?.bolsa
      : cotizacionesDolar?.contadoconliqui;
  const valorPesos = esDolar ? valorNativo * (precioDolarInstrumento ?? ventaDolar) : valorNativo;

  return enPesos ? valorPesos : valorPesos / ventaDolar;
};

const MONEDAS_DOLAR: string[] = [INSTRUMENTO_MONEDA.DOLAR_BOLSA, INSTRUMENTO_MONEDA.DOLAR_CCL];

const agruparPorCategoria = (valores: { categoria: string; valor: number }[]): DatoGrafico[] => {
  const totales = new Map<string, number>();
  for (const { categoria, valor } of valores) {
    totales.set(categoria, (totales.get(categoria) ?? 0) + valor);
  }

  const ordenados = Array.from(totales.entries())
    .map(([label, value]) => ({ label, value }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  if (ordenados.length <= MAX_CATEGORIAS) return ordenados;

  const principales = ordenados.slice(0, MAX_CATEGORIAS - 1);
  const otros = ordenados.slice(MAX_CATEGORIAS - 1).reduce((acc, d) => acc + d.value, 0);
  return [...principales, { label: 'Otros', value: otros }];
};

interface UseInversionesParams {
  instrumentos: Instrumento[] | undefined;
  inversiones: Inversion[] | undefined;
  moneda: InstrumentoMoneda;
  ventaDolar: number | null;
  cotizacionesDolar: DolarCotizaciones | null;
  preciosHistoricos: Map<string, number> | null;
  rowSelection: MRT_RowSelectionState;
}

interface UseInversionesResult {
  precioPorInstrumento: Map<string, PrecioInstrumento>;
  /** Total de la cartera completa; `null` si falta la cotización del dólar. */
  totalValor: number | null;
  totalDisplay: string;
  /** Cantidad de filas seleccionadas en la grilla. */
  cantidadSeleccionada: number;
  /** Total de las filas seleccionadas; `null` si no hay selección o falta la cotización. */
  totalSeleccionado: number | null;
  datosPorBroker: DatoGrafico[];
  datosPorRenta: DatoGrafico[];
  datosPorTipoInstrumento: DatoGrafico[];
}

export const useInversiones = ({
  instrumentos,
  inversiones,
  moneda,
  ventaDolar,
  cotizacionesDolar,
  preciosHistoricos,
  rowSelection,
}: UseInversionesParams): UseInversionesResult => {
  const [preciosPorInstrumento, setPreciosPorInstrumento] = useState<Map<string, InstrumentoPrecio>>(new Map());
  // Instrumentos whose live-precio fetch finished without a usable value (error or
  // no price returned). Used to stop showing the spinner for them.
  const [precioFetchFailed, setPrecioFetchFailed] = useState<Set<string>>(new Set());

  // For each instrumento missing today's precio, fetch the live cotización, persist
  // it as a new Precio record, and merge it into local state. The fetch itself is
  // cached in localStorage (see @/lib/inversiones/precios). Instrumentos that already
  // have today's precio in the DB are resolved directly in the memo below.
  useEffect(() => {
    let cancelled = false;

    const items = instrumentos ?? [];

    for (const ins of items) {
      if (findTodayPrecio(ins.precios)) continue;
      const fetcher = PRECIO_FETCHERS.find((f) => f.tipos.includes(ins.tipo || ''));
      if (!fetcher) continue;
      fetcher
        .fetchPrecio(ins)
        .then(async (precio) => {
          if (cancelled) return;
          if (precio == null) {
            setPrecioFetchFailed((prev) => new Set(prev).add(ins.id));
            return;
          }
          const created = await createPrecio({
            monto: precio,
            fecha: todayISO(),
            instrumento_id: ins.id,
          });
          if (cancelled) return;
          setPreciosPorInstrumento((prev) => {
            const next = new Map(prev);
            next.set(ins.id, created);
            return next;
          });
        })
        .catch((error) => {
          console.error(`Failed to fetch/create precio for instrumento ${ins.id}:`, error);
          if (!cancelled) setPrecioFetchFailed((prev) => new Set(prev).add(ins.id));
        });
    }

    return () => {
      cancelled = true;
    };
  }, [instrumentos]);

  const precioPorInstrumento = useMemo(() => {
    const map = new Map<string, PrecioInstrumento>();
    instrumentos?.forEach((inst) => {
      const simboloMoneda = MONEDAS_DOLAR.includes(inst.moneda) ? 'US$' : '$';

      if (preciosHistoricos) {
        const monto = preciosHistoricos.get(inst.id);
        map.set(inst.id, {
          simbolo: simboloMoneda,
          precio: monto != null ? transformNumberToCurrenty(monto) || '-' : '-',
          monto: monto ?? 0,
          loading: false,
        });
        return;
      }

      const precio = preciosPorInstrumento.get(inst.id) ?? findTodayPrecio(inst.precios);
      const monto = precio?.monto ?? 0;
      const hasFetcher = PRECIO_FETCHERS.some((f) => f.tipos.includes(inst.tipo || ''));
      const loading = !precio && hasFetcher && !precioFetchFailed.has(inst.id);
      map.set(inst.id, {
        simbolo: simboloMoneda,
        precio: precio ? transformNumberToCurrenty(monto) || '-' : '-',
        monto,
        loading,
      });
    });
    return map;
  }, [instrumentos, preciosPorInstrumento, precioFetchFailed, preciosHistoricos]);

  // Valor de cada inversión en la moneda de visualización. Se calcula siempre
  // sobre TODAS las inversiones de la página: la tira de stats (total y
  // composiciones) y los gráficos no dependen de la selección. El total de lo
  // seleccionado se muestra aparte, como chip del toolbar (`totalSeleccionado`).
  const inversionesConValor = useMemo(() => {
    if (!ventaDolar) return [] as { inversion: Inversion; valor: number }[];

    return (inversiones ?? []).map((inv) => ({
      inversion: inv,
      valor: calcularValorInversion({
        inversion: inv,
        precioPorInstrumento,
        moneda,
        ventaDolar,
        cotizacionesDolar,
      }),
    }));
  }, [inversiones, precioPorInstrumento, moneda, ventaDolar, cotizacionesDolar]);

  const totalValor = useMemo(() => {
    if (!ventaDolar) return null;
    return Math.round(inversionesConValor.reduce((acc, { valor }) => acc + valor, 0));
  }, [inversionesConValor, ventaDolar]);

  const totalDisplay = useMemo(() => {
    const enPesos = moneda === INSTRUMENTO_MONEDA.PESO;
    const simbolo = enPesos ? '$' : 'US$';
    if (totalValor == null) return `${simbolo} -`;

    return `${simbolo} ${transformNumberToCurrenty(totalValor) ?? '-'}`;
  }, [totalValor, moneda]);

  // Selección de la grilla (checkboxes). Sólo alimenta el chip del toolbar:
  // no altera ni el total de la cartera ni las composiciones.
  const cantidadSeleccionada = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]).length,
    [rowSelection],
  );

  const totalSeleccionado = useMemo(() => {
    if (!ventaDolar || cantidadSeleccionada === 0) return null;
    const total = inversionesConValor
      .filter(({ inversion }) => rowSelection[inversion.id])
      .reduce((acc, { valor }) => acc + valor, 0);
    return Math.round(total);
  }, [inversionesConValor, rowSelection, ventaDolar, cantidadSeleccionada]);

  const datosPorBroker = useMemo(
    () =>
      agruparPorCategoria(
        inversionesConValor.map(({ inversion, valor }) => ({
          categoria: inversion.broker || 'Sin broker',
          valor,
        })),
      ),
    [inversionesConValor],
  );

  const datosPorRenta = useMemo(
    () =>
      agruparPorCategoria(
        inversionesConValor.map(({ inversion, valor }) => ({
          categoria: inversion.instrumento.clase_renta || 'Sin renta',
          valor,
        })),
      ),
    [inversionesConValor],
  );

  const datosPorTipoInstrumento = useMemo(
    () =>
      agruparPorCategoria(
        inversionesConValor.map(({ inversion, valor }) => ({
          categoria: inversion.instrumento.tipo || 'Sin tipo',
          valor,
        })),
      ),
    [inversionesConValor],
  );

  return {
    precioPorInstrumento,
    totalValor,
    totalDisplay,
    cantidadSeleccionada,
    totalSeleccionado,
    datosPorBroker,
    datosPorRenta,
    datosPorTipoInstrumento,
  };
};
