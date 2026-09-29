import axios from 'axios';
import {
  BuscarMovimientosPayload,
  BuscarMovimientosResponse,
  Inversion,
  InversionCreatePayload,
  InversionUpdatePayload,
  GuardarEstadoInversionesPayload,
  DolarHistorico,
  DolaresHistoricosResponse,
  FechasHistorialInversionesResponse,
  HistorialInversionesPayload,
  HistorialInversionesResponse,
  InversionMeta,
  Instrumento,
  InstrumentoPrecio,
  PrecioConInstrumento,
  FciLocal,
  InstrumentoExterior,
  InstrumentoLocal,
  CotizacionDolar,
  ComprobantePago,
  ComprobantePagoParaSubir,
  ComprobanteErrorAPI,
  ComprobanteDetalleValidacion,
  LimitesComprobantes,
} from './definitions';

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const apiClient = axios.create({
  baseURL: backendBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const buscarMovimientos = async (payload: BuscarMovimientosPayload) => {
  const response = await apiClient.post<BuscarMovimientosResponse>('/movimientos-gasto', payload);
  return response.data;
};

export const obtenerInversiones = async (fecha?: string) => {
  const response = await apiClient.post<Inversion[]>('/inversiones/inversiones', {
    active: true,
    fecha: fecha ?? null,
  });
  return response.data;
};

export const obtenerFechasHistorialInversiones = async () => {
  const response = await apiClient.get<FechasHistorialInversionesResponse>('/inversiones/inversiones/historial/fechas');
  return response.data.fechas;
};

export const obtenerPreciosPorFecha = async (fecha: string) => {
  const response = await apiClient.post<PrecioConInstrumento[]>('/inversiones/precios', {
    fecha,
    active: true,
  });
  return response.data;
};

export const obtenerDolarHistorico = async (fecha: string): Promise<DolarHistorico | null> => {
  const response = await apiClient.post<DolaresHistoricosResponse>('/inversiones/dolares-historicos', {
    fecha,
    active: true,
  });
  return response.data.dolares_historicos[0] ?? null;
};

export const obtenerHistorialInversiones = async (
  payload: HistorialInversionesPayload,
): Promise<HistorialInversionesResponse> => {
  const response = await apiClient.post<HistorialInversionesResponse>('/inversiones/inversiones-historico', payload);
  return response.data;
};

export const crearInversion = async (payload: InversionCreatePayload) => {
  const response = await apiClient.post<Inversion>('/inversiones/inversion', payload);
  return response.data;
};

export const actualizarInversion = async (id: string, payload: InversionUpdatePayload) => {
  const response = await apiClient.put<Inversion>(`/inversiones/inversion/${id}`, payload);
  return response.data;
};

export const guardarEstadoInversiones = async (payload: GuardarEstadoInversionesPayload) => {
  const response = await apiClient.post<Inversion[]>('/inversiones/inversiones/estado', payload);
  return response.data;
};

export const obtenerInstrumentos = async () => {
  const response = await apiClient.post<Instrumento[]>('/inversiones/instrumentos', { limit_precios: 1 });
  return response.data;
};

export const eliminarInversion = async (id: string) => {
  const response = await apiClient.delete(`/inversiones/inversion/${id}`);
  return response.data;
};

export const obtenerMetaInversiones = async () => {
  const response = await apiClient.get<InversionMeta>('/inversiones/inversiones/meta');
  return response.data;
};

export const createPrecio = async (payload: {
  monto: number;
  fecha: string;
  instrumento_id: string;
}): Promise<InstrumentoPrecio> => {
  const { data } = await apiClient.post<InstrumentoPrecio>('/inversiones/precio', payload);
  return data;
};

export const getCotizacionFciLocal = async (codigo_cafci: number): Promise<FciLocal | null> => {
  const { data } = await apiClient.get<FciLocal[]>(`/cotizaciones/fondos?codigo_cafci=${codigo_cafci}`);
  return data.length > 0 ? data[0] : null;
};

export const getCotizacionInstrumentoExterior = async (symbol: string): Promise<InstrumentoExterior | null> => {
  const { data } = await apiClient.get<InstrumentoExterior>(`/cotizaciones/cotizaciones/us/${symbol}`);
  return data ?? null;
};

export const getCotizacionInstrumentoLocal = async (instrumento: string): Promise<InstrumentoLocal | null> => {
  const { data } = await apiClient.get<InstrumentoLocal>(`/cotizaciones/instrumento/${instrumento}`);
  return data ?? null;
};

export const getCotizacionDolarOficial = async (): Promise<CotizacionDolar | null> => {
  const { data } = await apiClient.get<CotizacionDolar>('/cotizaciones/dolar/oficial');
  return data ?? null;
};

export const getCotizacionesDolar = async (): Promise<CotizacionDolar[]> => {
  const { data } = await apiClient.get<CotizacionDolar[]>('/cotizaciones/dolar');
  return data ?? [];
};

const errorComprobante = (error: unknown, fallback: string): ComprobanteErrorAPI => {
  if (axios.isAxiosError<ComprobanteErrorAPI>(error)) {
    return (
      error.response?.data ?? {
        detail: { error: error.message || fallback, message: error.message || fallback },
      }
    );
  }
  const message = error instanceof Error ? error.message : fallback;
  return { detail: { error: fallback, message } };
};

const esDetalleValidacion = (detail: ComprobanteErrorAPI['detail']): detail is ComprobanteDetalleValidacion[] =>
  Array.isArray(detail);

export const mensajeErrorComprobante = (error: unknown, fallback: string): string => {
  const { detail } = errorComprobante(error, fallback);

  if (esDetalleValidacion(detail)) {
    const mensajes = detail
      .map((errorValidacion) => errorValidacion.msg)
      .filter((mensaje): mensaje is string => Boolean(mensaje));
    return mensajes.length ? mensajes.join(', ') : fallback;
  }

  return detail.message || fallback;
};

const comprobantesClient = axios.create({
  baseURL: backendBaseUrl,
});

export const subirComprobantePago = async (params: {
  vencimientoId: string;
  basePath: string;
  comprobante: ComprobantePagoParaSubir;
}): Promise<ComprobantePago> => {
  const formData = new FormData();
  formData.append('vencimiento_id', params.vencimientoId);
  formData.append('base_path', params.basePath);
  formData.append('subpath', params.comprobante.subpath);
  formData.append('file', params.comprobante.archivo, params.comprobante.archivo.name);

  try {
    const { data } = await comprobantesClient.post<ComprobantePago>('/comprobantes', formData);
    return data;
  } catch (error: unknown) {
    throw errorComprobante(error, `no se pudo subir el comprobante ${params.comprobante.subpath}`);
  }
};

export const obtenerLimitesComprobantes = async (): Promise<LimitesComprobantes | null> => {
  try {
    const { data } = await comprobantesClient.get<LimitesComprobantes>('/comprobantes/limites');
    return data;
  } catch (error: unknown) {
    console.error('no se pudieron obtener los limites de comprobantes:', error);
    return null;
  }
};

export default apiClient;
