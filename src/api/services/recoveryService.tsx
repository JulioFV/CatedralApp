import { Pregunta } from "../../models/Pregunta";
import axiosClient from "../axiosClient";

// --- 1. Buscar usuario por correo ---
export interface GetIdByEmailResponse {
  success: boolean;
  data?: string;    // id_usuario como string cuando success=true
  message?: string; // mensaje de error — pero a veces viaja en "data" (ver nota abajo)
}

// --- 2. Obtener la pregunta de seguridad del usuario ---
interface GetPreguntaResponse {
  error: boolean;
  mensaje: string;
  contenido: Pregunta | false;
}

export const getPreguntaUsuario = async (id_usuario: number): Promise<GetPreguntaResponse> => {
  const response = await axiosClient.get<GetPreguntaResponse>(`getpregunta/${id_usuario}`);
  return response.data;
};

// --- 3. Validar la respuesta a la pregunta de seguridad ---
export interface ValidarPreguntaPayload {
  id_usuario: number;
  id_pregunta: number;
  respuesta: string;
}

// ⚠️ Solo se confirmó el formato de ERROR con el backend; se asume que el
// éxito sigue el mismo patrón error/mensaje/contenido — confirmar con un
// caso real de respuesta correcta.

// --- 4. Restablecer contraseña ---
export interface UpdatePasswordPayload {
  id_usuario: number;
  password: string;
}

interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}

export const updatePassword = async (
  payload: UpdatePasswordPayload
): Promise<UpdatePasswordResponse> => {
  const response = await axiosClient.post<UpdatePasswordResponse>("updatepass", payload);
  return response.data;
};

// --- 1. Buscar usuario por correo ---
export interface GetIdByEmailResponse {
  success: boolean;
  data?: string;    // id_usuario como string cuando success=true
  message?: string; // mensaje de error, siempre en este campo
}

export const getIdByEmail = async (correo: string): Promise<GetIdByEmailResponse> => {
  const response = await axiosClient.post<GetIdByEmailResponse>("getIdByEmail", { correo });
  return response.data;
};


// --- 3. Validar la respuesta a la pregunta de seguridad ---
export interface ValidarPreguntaPayload {
  id_usuario: number;
  id_pregunta: number;
  respuesta: string;
}

interface ValidarPreguntaResponse {
  error: boolean;
  mensaje: string;
  contenido: boolean | unknown[]; // `true` si es correcta, `[]` si no
}

export const validarPreguntaRespuesta = async (
  payload: ValidarPreguntaPayload
): Promise<ValidarPreguntaResponse> => {
  const response = await axiosClient.post<ValidarPreguntaResponse>("preguntasvalidar", payload);
  return response.data;
};
