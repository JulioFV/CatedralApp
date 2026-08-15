import { Usuario } from "../../models/Usuario";
import axiosClient from "../axiosClient";

interface UsersApiResponse {
  status: string;
  success: string;
  data: Usuario[];
}

export const getUsers = async (): Promise<UsersApiResponse> => {
  const response = await axiosClient.get<UsersApiResponse>("users");
  return response.data;
};

export interface UserPayload {
  nombre: string;
  app: string;
  email: string;
  password: string;
  id_rol: number;
}

export interface UpdateUserPayload extends UserPayload {
  id_usuario: number;
}

// Formato ASUMIDO — confirmar con el backend
interface UserMutationResponse {
  success: boolean;
  message: string;
  status: string;
}

export const createUser = async (
  payload: UserPayload
): Promise<UserMutationResponse> => {
  const response = await axiosClient.post<UserMutationResponse>("createuser", payload);
  return response.data;
};

export const updateUser = async (
  id_usuario: number,
  payload: UpdateUserPayload
): Promise<UserMutationResponse> => {
  const response = await axiosClient.put<UserMutationResponse>(`users/${id_usuario}`, payload);
  return response.data;
};