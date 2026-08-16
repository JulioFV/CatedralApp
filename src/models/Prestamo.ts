export interface Prestamo {
  id_prestamo: number;
  nombre_solicitante: string;
  telefono_solicitante: string;
  estatus: number; // 1 = activo, 2 = devuelto/inactivo
  cantidad: number;
  fecha_prestamo: string;
  fecha_devolucion: string | null;
  observaciones: string;
  id_item: number;
  codigo_item: string;
  item: string; // nombre del artículo
  id_garantia: number;
  garantia: string;
  id_usuario: number | null;
  usuario: string | null;
  cantidad_devuelta: number;
}