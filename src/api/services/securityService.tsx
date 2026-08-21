import axiosClient from "../axiosClient";

interface ValidarUsuarioResponse {
  error: boolean;
  mensaje: string;
  contenido: boolean | unknown[]; // `true` si ya tiene respuesta, `[]` si no
}

export const validarUsuario = async (id_usuario: number): Promise<ValidarUsuarioResponse> => {
  const response = await axiosClient.get<ValidarUsuarioResponse>(`validarusuario/${id_usuario}`);
  return response.data;
};

export interface RegistrarRespuestaPayload {
  id_usuario: number;
  id_pregunta: number;
  respuesta: string;
}

interface RegistrarRespuestaResponse {
  error: boolean;
  mensaje: string;
  contenido: unknown;
}

export const registrarRespuesta = async (
  payload: RegistrarRespuestaPayload
): Promise<RegistrarRespuestaResponse> => {
  const response = await axiosClient.post<RegistrarRespuestaResponse>("registraRespuesta", payload);
  return response.data;
};