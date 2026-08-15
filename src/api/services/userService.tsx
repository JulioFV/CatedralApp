import { Usuario } from "../../models/Usuario";
import axiosClient from "../axiosClient";

interface UsersApiResponse {
  status: string;
  data: Usuario[];
}

export const getUsers = async (): Promise<UsersApiResponse> => {
  const response = await axiosClient.get<UsersApiResponse>("users");
  return response.data;
};