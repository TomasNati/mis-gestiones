import axios from "axios";
import { BuscarMovimientosPayload, BuscarMovimientosResponse } from "./definitions";

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL; 

const apiClient = axios.create({
  baseURL: backendBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const buscarMovimientos = async (payload: BuscarMovimientosPayload) => {
  const response = await apiClient.post<BuscarMovimientosResponse>('/movimientos-gasto', payload);
  return response.data;
};

export default apiClient;
