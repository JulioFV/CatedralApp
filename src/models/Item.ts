export interface Item {
  id: string;
  areaCode: string;
  objectCode: string;
  name: string;
  description: string;
  material: string;
  quantity: number;
  status: 'DISPONIBLE' | 'EN USO' | 'PRESTADO' | 'INACTIVO';
  location: string;
  notes: string;
}