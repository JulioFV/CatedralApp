import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { DEFAULT_URL_BASE } from "../config";

const axiosClient = axios.create({
  baseURL: DEFAULT_URL_BASE,
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
export const setAxiosBaseUrl = (url: string): void => {
  axiosClient.defaults.baseURL = url;
};

export const getAxiosBaseUrl = (): string => {
  return axiosClient.defaults.baseURL ?? DEFAULT_URL_BASE;
};

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.baseURL?.includes("ngrok")) {
      config.headers.set("ngrok-skip-browser-warning", "true");
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

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