# Esquemas de Datos - FinanzasPro

## Debt (Deuda)

```typescript
{
  id: string,              // Timestamp como string: Date.now().toString()
  date: string,            // ISO string: new Date().toISOString()
  name: string,            // Nombre de la deuda
  totalMount: number,      // Monto total de la deuda
  estimateMonths: number,  // Tiempo estimado en meses para pagar
  minimumFee: number,      // Cuota mínima mensual (totalMount / estimateMonths)
  partialPayments: Array<{
    id: string,
    mount: number,        // Monto del abono
    date: string,         // Fecha del pago (YYYY-MM-DD)
    description?: string  // Descripción opcional
  }>
}
```

## Income (Ingreso Mensual/Quincenal)

```typescript
{
  id: string,              // Timestamp como string
  month: string,           // Mes: "Enero", "Febrero", etc. o "Enero-1", "Enero-2"
  year: number,            // Año: 2024, 2025, etc.
  totalIncomes: number,    // Ingreso total del mes/quincena
  date: string,            // ISO string de creación
  expenses: Array<{
    id: string,
    categorie: string,     // Categoría del gasto
    mount: number,        // Monto del gasto
    date: string,         // Fecha del gasto (YYYY-MM-DD)
    description?: string  // Descripción opcional
  }>
}
```

## Categorías de Gastos

```javascript
const CATEGORIES_INCOMES = [
  "Arriendo",
  "Mercado",
  "Transporte",
  "Servicios",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Otros"
];
```

## Claves en localStorage

| Clave | Descripción |
|-------|-------------|
| `debts` | Array de objetos Debt |
| `incomes` | Array de objetos Income |

## Formato de Moneda

```javascript
new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0
}).format(value)
// Ejemplo: $ 1.500.000
```

## Notas para Migración a Supabase

- La tabla `debts` corresponde al array de deudas
- La tabla `incomes` corresponde al array de ingresos
- Considerar columna `user_id` para identificación de usuario
- Los timestamps de `id` pueden convertirse a timestamps Unix o timestamps de Supabase
