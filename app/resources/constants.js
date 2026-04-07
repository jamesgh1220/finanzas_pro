export const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const QUINCENAL = MONTHS.flatMap(mes => [`${mes}-1`, `${mes}-2`]);

export const CATEGORIES_INCOMES = [
  "Arriendo",
  "Mercado",
  "Transporte",
  "Servicios",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Otros",
];

export const CATEGORIES_COLORS = {
  Arriendo: "#3B82F6",
  Mercado: "#22c55e",
  Transporte: "#f59e0b",
  Servicios: "#8b5cf6",
  Entretenimiento: "#ec4899",
  Salud: "#14b8a6",
  Educación: "#f97316",
  Otros: "#6b7280",
};