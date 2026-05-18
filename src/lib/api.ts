import axios from 'axios';
import {
  BuscarMovimientosPayload,
  BuscarMovimientosResponse,
  Inversion,
  InversionCreatePayload,
  InversionMeta,
  Instrumento,
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
  const response = await apiClient.get<Inversion[]>('/inversiones/inversiones');
  return response.data;
};

export const crearInversion = async (payload: InversionCreatePayload) => {
  const response = await apiClient.post<Inversion>('/inversiones/inversion', payload);
  return response.data;
};

export const obtenerInstrumentos = async () => {
  const response = await apiClient.get<Instrumento[]>('/inversiones/instrumentos', {
    params: { limit_precios: 50 },
  });
  return response.data;
};

export const obtenerMetaInversiones = async () => {
  const response = await apiClient.get<InversionMeta>('/inversiones/inversiones/meta');
  return response.data;
};

export default apiClient;
