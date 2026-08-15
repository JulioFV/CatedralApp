import { Garantia } from "../../models/Garantia";
import axiosClient from "../axiosClient";

interface GarantiasApiResponse {
  success: boolean;
  data: Garantia[];
}

export const getGarantias = async (): Promise<GarantiasApiResponse> => {
  const response = await axiosClient.get<GarantiasApiResponse>("garantia");
  return response.data;
};