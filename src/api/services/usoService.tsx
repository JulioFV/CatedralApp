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