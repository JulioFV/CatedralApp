export interface Loan {
  id: string;
  itemName: string;
  itemCode: string;
  borrowerName: string;
  borrowerPhone: string;
  registeredUser: boolean;
  userName?: string;
  guaranteeType: string;
  guaranteeDescription: string;
  expectedDate: string;
  realDate?: string;
  status: 'ACTIVO' | 'DEVUELTO' | 'VENCIDO';
  notes: string;
}