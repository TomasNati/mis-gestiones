import { useEffect, useMemo, useState } from 'react';
import type { MRT_RowSelectionState } from 'material-react-table';
import {
  CotizacionDolar,
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

interface UseInversionesParams {
  instrumentos: Instrumento[] | undefined;
  inversiones: Inversion[] | undefined;
  moneda: InstrumentoMoneda;
  cotizacionDolarSeleccionada: CotizacionDolar | null;
  rowSelection: MRT_RowSelectionState;
}

interface UseInversionesResult {
  precioPorInstrumento: Map<string, PrecioInstrumento>;
  totalDisplay: string;
}

export const useInversiones = ({
  instrumentos,
  inversiones,
  moneda,
  cotizacionDolarSeleccionada,
  rowSelection,
}: UseInversionesParams): UseInversionesResult => {
  const [preciosPorInstrumento, setPreciosPorInstrumento] = useState<Map<string, InstrumentoPrecio>>(
    new Map(),
  );
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
    const dolares: string[] = [INSTRUMENTO_MONEDA.DOLAR, INSTRUMENTO_MONEDA.DOLAR_CCL];
    instrumentos?.forEach((inst) => {
      const precio = preciosPorInstrumento.get(inst.id) ?? findTodayPrecio(inst.precios);
      const simboloMoneda = dolares.includes(inst.moneda) ? 'US$' : '$';
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
  }, [instrumentos, preciosPorInstrumento, precioFetchFailed]);

  const totalDisplay = useMemo(() => {
    const dolares: string[] = [INSTRUMENTO_MONEDA.DOLAR, INSTRUMENTO_MONEDA.DOLAR_CCL, INSTRUMENTO_MONEDA.DOLAR_MEP];
    const ventaDolar = cotizacionDolarSeleccionada?.venta ?? null;
    const enPesos = moneda === INSTRUMENTO_MONEDA.PESO;
    const simbolo = enPesos ? '$' : 'US$';

    if (!ventaDolar) return `${simbolo} -`;

    // Total the selected rows only; if nothing is selected, total all rows.
    const items = inversiones ?? [];
    const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
    const inversionesATotalizar =
      selectedIds.length > 0 ? items.filter((inv) => rowSelection[inv.id]) : items;

    const totalPesos = inversionesATotalizar.reduce((acc, inv) => {
      const monto = precioPorInstrumento.get(inv.instrumento.id)?.monto ?? 0;
      const valorNativo = inv.cantidad * monto;
      const esDolar = dolares.includes(inv.instrumento.moneda);
      return acc + (esDolar ? valorNativo * ventaDolar : valorNativo);
    }, 0);

    const valor = enPesos ? totalPesos : totalPesos / ventaDolar;
    return `${simbolo} ${transformNumberToCurrenty(valor) ?? '-'}`;
  }, [inversiones, precioPorInstrumento, moneda, cotizacionDolarSeleccionada, rowSelection]);

  return { precioPorInstrumento, totalDisplay };
};
