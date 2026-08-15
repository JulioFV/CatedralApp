export interface Usuario {
  id_usuario: number;
  nombre: string;
  app: string;
  email: string;
  id_rol: number;
  // Nota: la API también devuelve "password" en texto plano — se omite
  // aquí a propósito para no propagar su uso en el frontend.
}