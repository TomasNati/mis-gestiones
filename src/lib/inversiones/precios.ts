import { Instrumento, InstrumentoPrecio, INSTRUMENTO_TIPO } from '@/lib/definitions';
import {
  getCotizacionFciLocal,
  getCotizacionInstrumentoExterior,
  getCotizacionInstrumentoLocal,
} from '@/lib/api';

export type PrecioFetcher = {
  tipos: string[];
  fetchPrecio: (ins: Instrumento) => Promise<number | null>;
};

const PRECIO_STORAGE_PREFIX = 'instrumento_precio:';

type StoredPrecio = {
  precio: number | null;
  fecha: string;
};

export const todayISO = (): string => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const findTodayPrecio = (
  precios: InstrumentoPrecio[] | null | undefined,
): InstrumentoPrecio | undefined => {
  if (!precios?.length) return undefined;
  const today = todayISO();
  return precios.find((p) => p.fecha?.slice(0, 10) === today);
};

const storageKey = (ins: Instrumento): string | null => {
  if (!ins.tipo || !ins.codigo) return null;
  return `${PRECIO_STORAGE_PREFIX}${ins.tipo}:${ins.codigo}`;
};

const readCachedPrecio = (ins: Instrumento): StoredPrecio | null => {
  const key = storageKey(ins);
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as StoredPrecio;
  } catch {
    return null;
  }
};

const writeCachedPrecio = (ins: Instrumento, precio: number | null): void => {
  const key = storageKey(ins);
  if (!key) return;
  try {
    const value: StoredPrecio = { precio, fecha: todayISO() };
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable; skip persistence
  }
};

const withCache =
  (fetchPrecio: (ins: Instrumento) => Promise<number | null>) =>
  async (ins: Instrumento): Promise<number | null> => {
    const cached = readCachedPrecio(ins);
    if (cached && cached.fecha === todayISO()) {
      return cached.precio;
    }
    const precio = await fetchPrecio(ins);
    writeCachedPrecio(ins, precio);
    return precio;
  };

export const PRECIO_FETCHERS: PrecioFetcher[] = [
  {
    tipos: [
      INSTRUMENTO_TIPO.ACCION_INTERNACIONAL,
      INSTRUMENTO_TIPO.ETF,
      INSTRUMENTO_TIPO.FCI_EXTERIOR,
      INSTRUMENTO_TIPO.CRIPTO,
    ],
    fetchPrecio: withCache(async (ins) => {
      const identifier = ins.codigo ?? ins.nombre;
      const r = await getCotizacionInstrumentoExterior(identifier);
      return r?.price ?? null;
    }),
  },
  {
    tipos: [
      INSTRUMENTO_TIPO.ACCION_LOCAL,
      INSTRUMENTO_TIPO.BONO,
      INSTRUMENTO_TIPO.CEDEAR,
      INSTRUMENTO_TIPO.ON,
    ],
    fetchPrecio: withCache(async (ins) => {
      const identifier = ins.codigo ?? ins.nombre;
      const r = await getCotizacionInstrumentoLocal(identifier);
      return r?.precio ?? null;
    }),
  },
  {
    tipos: [INSTRUMENTO_TIPO.FCI],
    fetchPrecio: withCache(async (ins) => {
      const codigoCafci = Number(ins.codigo);
      if (!Number.isFinite(codigoCafci)) return null;
      const r = await getCotizacionFciLocal(codigoCafci);
      return r?.precio_actual ?? null;
    }),
  },
];
