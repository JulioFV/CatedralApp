import { Rol } from "../../models/Rol";
import axiosClient from "../axiosClient";

interface RolesApiResponse {
  error: boolean;
  mensaje: string;
  contenido: Rol[];
}

export const getRoles = async (): Promise<RolesApiResponse> => {
  const response = await axiosClient.get<RolesApiResponse>("roles");
  return response.data;
};