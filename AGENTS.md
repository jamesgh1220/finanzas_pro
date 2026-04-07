# FinanzasPro - Contexto para IA

## Tecnologías
- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript / JavaScript (JSX)
- **UI:** React 19, Tailwind CSS 4
- **Gráficos:** Recharts
- **Íconos:** Lucide React
- **Almacenamiento:** localStorage (pendiente migración a Supabase)

## Estructura del Proyecto
```
app/
├── page.tsx                    # Entry point - navegación por tabs
├── layout.tsx                  # Layout raíz
├── resources/constants.js      # Constantes compartidas
└── components/
    ├── ui/                     # Componentes reutilizables
    ├── dashboard/Home.jsx      # Dashboard principal
    ├── debts/                  # Módulo de gestión de deudas
    └── income/                 # Módulo de gestión de ingresos
docs/
└── DATA_SCHEMAS.md             # Esquemas de datos (fuente de verdad)
```

## Esquemas de Datos
Ver: `docs/DATA_SCHEMAS.md`

## Reglas de Desarrollo
- Componentes con "use client" cuando usen estado hooks
- Usar diálogos nativos HTML `<dialog>` con useRef
- Formato moneda: `new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" })`
- Colores de categorías en constants.js: CATEGORIES_COLORS
- IDs generados con `Date.now().toString()`

## Pendiente
- Migrar almacenamiento de localStorage a Supabase (no implementado aún)
