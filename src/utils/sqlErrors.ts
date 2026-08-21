// Convierte errores SQL crudos (como los que devuelve PDO) en mensajes
// legibles para el usuario final. Si no reconoce el patrón, devuelve el
// mensaje original tal cual.
export const simplifySqlError = (rawError: string): string => {
  const duplicateMatch = rawError.match(/Duplicate entry '([^']+)'/i);
  if (duplicateMatch) {
    return `El código "${duplicateMatch[1]}" ya existe en el sistema.`;
  }
  return rawError;
};