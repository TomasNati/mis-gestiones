import dayjs from 'dayjs';
import type { HistorialInversionesResponse, ValorInversion } from '@/lib/definitions';

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
