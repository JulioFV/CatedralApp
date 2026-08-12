import { ApiResponse } from "../../types/api";
import { LoginData } from "../../types/auth";
import axiosClient from "../axiosClient";

export const login = async (
  email: string,
  password: string
): Promise<ApiResponse<LoginData>> => {
  const response = await axiosClient.post<ApiResponse<LoginData>>("login", {
    email,
    password,
  });
  return response.data;
};