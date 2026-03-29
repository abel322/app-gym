# Body Transformation Planner 💪

Aplicación web completa para seguimiento de transformación física, entrenamientos, nutrición y progreso corporal.

## 🚀 Características

- ✅ Autenticación con NextAuth
- ✅ Dashboard interactivo con estadísticas
- ✅ Gestión de mediciones corporales
- ✅ Seguimiento de entrenamientos
- ✅ Planes de nutrición personalizados
- ✅ Análisis y gráficos de progreso
- ✅ Recomendaciones basadas en IA
- ✅ Cálculo automático de macros
- ✅ Predicciones de progreso

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js
- **UI**: Tailwind CSS + Radix UI + Framer Motion
- **Estado**: Zustand
- **Validación**: Zod
- **Gráficos**: Recharts

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd app-gym
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/body_transformation?schema=public"

# NextAuth
NEXTAUTH_SECRET="tu-secret-key-super-segura"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Configurar la base de datos**

```bash
# Crear las tablas en la base de datos
npm run db:push

# Poblar con datos iniciales (ejercicios)
npm run db:seed
```

5. **Ejecutar en desarrollo**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/          # Páginas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/     # Páginas del dashboard
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── measurements/
│   │   ├── workouts/
│   │   ├── nutrition/
│   │   ├── analytics/
│   │   └── progress/
│   └── api/            # API Routes
│       ├── auth/
│       ├── users/
│       ├── workouts/
│       ├── measurements/
│       └── nutrition/
├── components/
│   ├── cards/          # Componentes de tarjetas
│   ├── charts/         # Gráficos
│   ├── layout/         # Layout components
│   └── ui/             # Componentes UI base
├── hooks/              # Custom hooks
├── lib/
│   ├── algorithms/     # Algoritmos de cálculo
│   ├── auth.ts         # Configuración NextAuth
│   ├── prisma.ts       # Cliente Prisma
│   ├── utils.ts        # Utilidades
│   └── validations.ts  # Schemas Zod
├── store/              # Zustand stores
└── types/              # TypeScript types
```

## 🎯 Uso

### Registro e Inicio de Sesión

1. Accede a `/register` para crear una cuenta
2. Inicia sesión en `/login`
3. Completa tu perfil con datos personales

### Dashboard

- **Vista general**: Estadísticas, peso actual, IMC, racha de entrenamientos
- **Gráficos**: Evolución de peso y actividad

### Mediciones

- Registra peso, medidas corporales y porcentaje de grasa
- Visualiza evolución en gráficos
- Compara con mediciones anteriores

### Entrenamientos

- Crea rutinas personalizadas
- Selecciona ejercicios de la biblioteca (27 ejercicios predefinidos)
- Registra tus sesiones de entrenamiento

### Nutrición

- Crea planes nutricionales
- Calcula macros automáticamente según tu objetivo
- Registra comidas diarias

### Análisis y Progreso

- Visualiza gráficos de evolución
- Recibe recomendaciones personalizadas
- Analiza tendencias de progreso

## 🗄️ Base de Datos

El proyecto usa PostgreSQL con Prisma. Modelos principales:

- **User**: Usuarios y perfiles
- **BodyMeasurement**: Mediciones corporales
- **Workout**: Rutinas de entrenamiento
- **Exercise**: Biblioteca de ejercicios
- **WorkoutLog**: Registro de entrenamientos
- **NutritionPlan**: Planes nutricionales
- **Meal**: Comidas registradas

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Iniciar producción
npm run lint         # Linter
npm run db:push      # Sincronizar schema con DB
npm run db:seed      # Poblar datos iniciales
npm run db:studio    # Abrir Prisma Studio
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otras plataformas

Asegúrate de:
- Configurar PostgreSQL
- Establecer variables de entorno
- Ejecutar `npm run db:push` después del despliegue

## 📝 Licencia

MIT

## 👨‍💻 Autor

Tu nombre
