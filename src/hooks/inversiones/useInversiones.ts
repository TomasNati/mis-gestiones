import { useEffect, useMemo, useState } from 'react';
import type { MRT_RowSelectionState } from 'material-react-table';
import {
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
  preciosHistoricos: Map<string, number> | null;
  rowSelection: MRT_RowSelectionState;
}

interface UseInversionesResult {
  precioPorInstrumento: Map<string, PrecioInstrumento>;
  totalDisplay: string;
  datosPorBroker: DatoGrafico[];
  datosPorRenta: DatoGrafico[];
}

export const useInversiones = ({
  instrumentos,
  inversiones,
  moneda,
  ventaDolar,
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

  // Valor de cada inversión en la moneda de visualización, considerando sólo las
  // filas seleccionadas (o todas si no hay selección). Es la base compartida del
  // total y de los datos de los gráficos, para que la conversión de moneda viva
  // en un único lugar.
  const inversionesConValor = useMemo(() => {
    const enPesos = moneda === INSTRUMENTO_MONEDA.PESO;

    if (!ventaDolar) return [] as { inversion: Inversion; valor: number }[];

    const items = inversiones ?? [];
    const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
    const inversionesATotalizar = selectedIds.length > 0 ? items.filter((inv) => rowSelection[inv.id]) : items;

    return inversionesATotalizar.map((inv) => {
      const monto = precioPorInstrumento.get(inv.instrumento.id)?.monto ?? 0;
      const valorNativo = inv.cantidad * monto;
      const esDolar = MONEDAS_DOLAR.includes(inv.instrumento.moneda);
      const valorPesos = esDolar ? valorNativo * ventaDolar : valorNativo;
      const valor = enPesos ? valorPesos : valorPesos / ventaDolar;
      return { inversion: inv, valor };
    });
  }, [inversiones, precioPorInstrumento, moneda, ventaDolar, rowSelection]);

  const totalDisplay = useMemo(() => {
    const enPesos = moneda === INSTRUMENTO_MONEDA.PESO;
    const simbolo = enPesos ? '$' : 'US$';
    if (!ventaDolar) return `${simbolo} -`;

    const valor = inversionesConValor.reduce((acc, { valor }) => acc + valor, 0);
    return `${simbolo} ${transformNumberToCurrenty(valor) ?? '-'}`;
  }, [inversionesConValor, moneda, ventaDolar]);

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

  return { precioPorInstrumento, totalDisplay, datosPorBroker, datosPorRenta };
};;
