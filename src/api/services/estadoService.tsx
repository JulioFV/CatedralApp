import { Estado } from "../../models/Estado";
import axiosClient from "../axiosClient";

interface EstadosApiResponse {
  success: boolean;
  data: Estado[];
}

export const getEstados = async (): Promise<EstadosApiResponse> => {
  const response = await axiosClient.get<EstadosApiResponse>("estado");
  return response.data;
};