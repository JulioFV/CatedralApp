import { Item } from "../../models/Item";
import axiosClient from "../axiosClient";

interface ItemsApiResponse {
  status: string;
  data: Item[];
}

export const getItems = async (): Promise<ItemsApiResponse> => {
  const response = await axiosClient.get<ItemsApiResponse>("item");
  return response.data;
};

export const updateItemStatus = async (
  id_item: number,
  activo: number
): Promise<{ status: string; message?: string }> => {
  const response = await axiosClient.put(`items/${id_item}`, { activo });
  return response.data;
};
export const getItemsByLocation = async (id_lugar: number): Promise<ItemsApiResponse> => {
  const response = await axiosClient.get<ItemsApiResponse>(`item/${id_lugar}`);
  return response.data;
};

export interface CreateItemPayload {
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  id_material: number;
  id_estado: number;
  id_lugar: number;
  id_uso: number;
  cantidad_prestada: number;
  activo: number;
  observaciones: string;
}

interface ItemMutationResponse {
  status: string;
  message: string;
}

export const createItem = async (
  payload: CreateItemPayload
): Promise<ItemMutationResponse> => {
  const response = await axiosClient.post<ItemMutationResponse>("item", payload);
  return response.data;
};

// Endpoint asumido — confirmar método y ruta reales con el backend
export const updateItem = async (
  id_item: number,
  payload: CreateItemPayload
): Promise<ItemMutationResponse> => {
  const response = await axiosClient.put<ItemMutationResponse>(`item/${id_item}`, payload);
  return response.data;
};