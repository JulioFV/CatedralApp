import { Lugar } from "../../models/Lugar";
import axiosClient from "../axiosClient";

interface AreasApiResponse {
  success: boolean;
  data: Lugar[];
}

export const getAreas = async (): Promise<AreasApiResponse> => {
  const response = await axiosClient.get<AreasApiResponse>("areas");
  return response.data;
};
export interface AreaPayload {
  nombre: string;
  referencia: string;
  responsable: string;
  observaciones: string;
  codigo: string;
}

interface AreaMutationResponse {
  success: boolean;
  message: string;
}

export const createArea = async (
  payload: AreaPayload
): Promise<AreaMutationResponse> => {
  const response = await axiosClient.post<AreaMutationResponse>("areas", payload);
  return response.data;
};

export const updateArea = async (
  id_lugar: number,
  payload: AreaPayload
): Promise<AreaMutationResponse> => {
  const response = await axiosClient.put<AreaMutationResponse>(`areas/${id_lugar}`, payload);
  return response.data;
};