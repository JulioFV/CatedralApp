export const ESTATUS_ACTIVO = 1;
export const ESTATUS_DEVUELTO = 2;

export type LoanStatusLabel = 'ACTIVO' | 'DEVUELTO' | undefined;

export const mapEstatusToLabel = (estatus: number): LoanStatusLabel => {
  if (estatus === ESTATUS_ACTIVO) return 'ACTIVO';
  if (estatus === ESTATUS_DEVUELTO) return 'DEVUELTO';
  return undefined;
};