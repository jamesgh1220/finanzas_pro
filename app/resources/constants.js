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
  Arriendo: "#60A5FA",
  Mercado: "#10B981",
  Transporte: "#F59E0B",
  Servicios: "#8B5CF6",
  Entretenimiento: "#EC4899",
  Salud: "#14B8A6",
  Educación: "#F97316",
  Otros: "#6B7280",
};