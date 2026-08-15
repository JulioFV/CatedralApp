export interface Uso {
  id_uso: number;
  nombre: string;
  descripcion: string;
  estado: number; // 1 = activo, 2 = inactivo (confirmar con backend)
}