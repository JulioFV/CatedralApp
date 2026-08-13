export interface Item {
  id_item: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  cantidad_prestada: number;
  fecha_creacion: string;
  activo: number;
  observaciones: string | null;
  material: string;
  estado: string;
  lugar: string;
  codigo_lugar: string;
  uso: string;
}