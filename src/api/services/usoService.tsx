import { Uso } from "../../models/Uso";
import axiosClient from "../axiosClient";

interface UsosApiResponse {
  error: boolean;
  mensaje: string;
  contenido: Uso[];
}

export const getUsos = async (): Promise<UsosApiResponse> => {
  const response = await axiosClient.get<UsosApiResponse>("usos");
  return response.data;
};
export interface UsoPayload {
  nombre: string;
  descripcion: string;
  estado: number;
}

interface UsoMutationResponse {
  error: boolean;
  mensaje: string;
  contenido: unknown;
}

export const createUso = async (
  payload: UsoPayload
): Promise<UsoMutationResponse> => {
  const response = await axiosClient.post<UsoMutationResponse>("usos", payload);
  return response.data;
};

export const updateUso = async (
  id_uso: number,
  payload: UsoPayload
): Promise<UsoMutationResponse> => {
  const response = await axiosClient.put<UsoMutationResponse>(`usos/${id_uso}`, payload);
  return response.data;
};