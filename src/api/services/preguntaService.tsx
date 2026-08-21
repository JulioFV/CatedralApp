import { Pregunta } from "../../models/Pregunta";
import axiosClient from "../axiosClient";

interface PreguntasApiResponse {
  error: boolean;
  mensaje: string;
  contenido: Pregunta[];
}

export const getPreguntas = async (): Promise<PreguntasApiResponse> => {
  const response = await axiosClient.get<PreguntasApiResponse>("preguntas");
  return response.data;
};