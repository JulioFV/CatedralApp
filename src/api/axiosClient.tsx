import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { UrlBase } from "../config";

const axiosClient = axios.create({
  baseURL: UrlBase,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export interface ApiError extends AxiosError {
  mensaje: string;
}

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let mensaje = "Ocurrió un error inesperado";

    if (error.response) {
      const data = error.response.data as { message?: string };
      mensaje = data?.message || `Error del servidor (${error.response.status})`;
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    } else if (error.code === "ECONNABORTED") {
      mensaje = "La solicitud tardó demasiado tiempo (timeout).";
    }

    const apiError: ApiError = { ...error, mensaje } as ApiError;
    return Promise.reject(apiError);
  }
);

export default axiosClient;