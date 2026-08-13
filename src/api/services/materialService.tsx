import { Material } from "../../models/Material";
import axiosClient from "../axiosClient";

interface MaterialesApiResponse {
  success: boolean;
  data: Material[];
}

export const getMateriales = async (): Promise<MaterialesApiResponse> => {
  const response = await axiosClient.get<MaterialesApiResponse>("materiales");
  return response.data;
};