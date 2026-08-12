import { ApiResponse } from "../../types/api";
import { GeneralStats } from "../../types/general";
import axiosClient from "../axiosClient";

export const getGeneralStats = async (): Promise<ApiResponse<GeneralStats[]>> => {
  const response = await axiosClient.get<ApiResponse<GeneralStats[]>>("general");
  return response.data;
};