# Finanzas PRO

Aplicación web para la gestión de finanzas personales que permite visualizar un dashboard con métricas clave, administrar deudas y registrar ingresos con gráficos interactivos.

## Almacenamiento

Los datos se almacenan en **localStorage** del navegador. Esto significa que la información persiste localmente en el dispositivo del usuario, pero no se sincroniza entre dispositivos ni se respalda en un servidor.

## Tecnologías

- **Framework:** Next.js 16
- **Lenguaje:** TypeScript / JavaScript (JSX)
- **UI:** React 19
- **Estilos:** Tailwind CSS 4
- **Gráficos:** Recharts
- **Íconos:** Lucide React

## Arquitectura del Proyecto

```
finanzas_pro/
├── app/
│   ├── components/
│   │   ├── dashboard/       # Componentes del dashboard principal
│   │   │   └── Home.jsx
│   │   ├── debts/           # Módulo de gestión de deudas
│   │   │   ├── Debts.jsx
│   │   │   ├── HeaderDebts.jsx
│   │   │   ├── GraphsHistory.jsx
│   │   │   └── List.jsx
│   │   ├── income/          # Módulo de gestión de ingresos
│   │   │   ├── Income.jsx
│   │   │   ├── HeaderIncomes.jsx
│   │   │   ├── GraphsHistory.jsx
│   │   │   └── List.jsx
│   │   └── ui/              # Componentes de interfaz reutilizables
│   │       ├── HeaderComponent.jsx
│   │       └── TabsComponent.jsx
│   ├── assets/              # Recursos estáticos
│   ├── resources/           # Datos y recursos de la aplicación
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página principal con navegación por tabs
│   └── globals.css          # Estilos globales
├── public/                  # Archivos públicos
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Instalación y Ejecución

### Prerrequisitos

- Node.js 18.x o superior
- npm, yarn, pnpm o bun

### Pasos para ejecutar el proyecto

1. **Clonar el repositorio**

```bash
git clone https://github.com/jamesgh1220/finanzas_pro.git
cd finanzas_pro
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Ejecutar en modo desarrollo**

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

4. **Abrir en el navegador**

Navega a [http://localhost:3000](http://localhost:3000)

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el servidor en modo producción |
| `npm run lint` | Ejecuta el linter (ESLint) |

## Licencia

Desarrollado por **John James Gallego Hernández**
