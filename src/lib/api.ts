import axios from 'axios';
import {
  BuscarMovimientosPayload,
  BuscarMovimientosResponse,
  Inversion,
  InversionCreatePayload,
  InversionMeta,
  Instrumento,
  InstrumentoPrecio,
  FciLocal,
  InstrumentoExterior,
  InstrumentoLocal,
  CotizacionDolar,
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

export const obtenerInversiones = async () => {
  const response = await apiClient.post<Inversion[]>('/inversiones/inversiones', { active: true });
  return response.data;
};

export const crearInversion = async (payload: InversionCreatePayload) => {
  const response = await apiClient.post<Inversion>('/inversiones/inversion', payload);
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

export default apiClient;
