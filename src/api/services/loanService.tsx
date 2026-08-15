import { Prestamo } from "../../models/Prestamo";
import axiosClient from "../axiosClient";

interface PrestamosApiResponse {
  error: boolean;
  mensaje: string;
  contenido: Prestamo[];
}

export const getPrestamos = async (): Promise<PrestamosApiResponse> => {
  const response = await axiosClient.get<PrestamosApiResponse>("prestamos");
  return response.data;
};
export interface CreateLoanPayload {
  id_item: number;
  id_usuario: number | null;
  nombre_solicitante: string;
  telefono_solicitante: string;
  estatus: number;
  cantidad: number;
  id_garantia: number;
  observaciones: string;
}

interface LoanSuccessResponse {
  status: string;
  message: string;
}

interface LoanErrorResponse {
  error: boolean;
  mensaje: string;
  contenido: unknown[];
}

export type LoanMutationResponse = LoanSuccessResponse | LoanErrorResponse;

// Type guard: distingue cuál de las dos formas llegó en la respuesta
export const isLoanSuccess = (res: LoanMutationResponse): res is LoanSuccessResponse => {
  return "status" in res && res.status === "success";
};

export interface CreateLoanPayload {
  id_item: number;
  id_usuario: number | null;
  nombre_solicitante: string;
  telefono_solicitante: string;
  estatus: number;
  cantidad: number;
  id_garantia: number;
  observaciones: string;
}

export interface UpdateLoanPayload extends CreateLoanPayload {
  fecha_prestamo: string;
  fecha_devolucion: string | null;
}

// Respuesta de éxito exclusiva de "crear"
interface LoanCreateSuccessResponse {
  status: string;
  message: string;
}

// Formato genérico: lo usa "editar" siempre (éxito y error),
// y "crear" solo cuando falla
interface LoanGenericResponse {
  error: boolean;
  mensaje: string;
  contenido: unknown[] | null;
}

export type CreateLoanResult = LoanCreateSuccessResponse | LoanGenericResponse;
export type UpdateLoanResult = LoanGenericResponse;

export const isCreateSuccess = (res: CreateLoanResult): res is LoanCreateSuccessResponse => {
  return "status" in res && res.status === "success";
};

export const createLoan = async (
  payload: CreateLoanPayload
): Promise<CreateLoanResult> => {
  const response = await axiosClient.post<CreateLoanResult>("prestamos", payload);
  return response.data;
};

export const updateLoan = async (
  id_prestamo: number,
  payload: UpdateLoanPayload
): Promise<UpdateLoanResult> => {
  const response = await axiosClient.put<UpdateLoanResult>(`prestamos/${id_prestamo}`, payload);
  return response.data;
};
export interface GenericLoanResponse {
  error: boolean;
  mensaje: string;
  contenido: string | unknown[];
}

export const returnLoan = async (id_prestamo: number): Promise<GenericLoanResponse> => {
  const response = await axiosClient.put<GenericLoanResponse>(`devolverprestamo/${id_prestamo}`);
  return response.data;
};