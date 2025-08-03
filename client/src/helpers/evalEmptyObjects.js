export const isEmpty = (obj) => {
  // Verificar si es null o undefined
  if (obj == null) return true;

  // Verificar si es un objeto
  if (typeof obj !== "object") return false;

  // Verificar si es un array
  if (Array.isArray(obj)) return obj.length === 0;

  // Verificar si es un objeto vacío
  return Object.keys(obj).length === 0;
};

export const isNotEmpty = (obj) => {
  return !isEmpty(obj);
};
