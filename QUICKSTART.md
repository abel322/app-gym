# 🚀 Guía de Inicio Rápido

## Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL instalado y corriendo
- npm o yarn

## Pasos de Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar PostgreSQL

Crea una base de datos en PostgreSQL:

```sql
CREATE DATABASE body_transformation;
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y edítalo:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de PostgreSQL:

```env
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/body_transformation?schema=public"
NEXTAUTH_SECRET="genera-un-secret-seguro"
NEXTAUTH_URL="http://localhost:3000"
```

Para generar un NEXTAUTH_SECRET seguro:

```bash
openssl rand -base64 32
```

### 4. Inicializar la base de datos

```bash
# Crear las tablas
npm run db:push

# Poblar con ejercicios predefinidos
npm run db:seed
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎯 Primeros Pasos

### 1. Crear una cuenta

- Ve a `/register`
- Completa el formulario de registro
- Inicia sesión con tus credenciales

### 2. Completar tu perfil

- Ve a "Perfil" en el menú lateral
- Ingresa tus datos: edad, altura, peso, objetivo, nivel de actividad
- Guarda los cambios

### 3. Registrar tu primera medición

- Ve a "Mediciones"
- Haz clic en "Nueva Medición"
- Ingresa tu peso y medidas corporales
- Guarda

### 4. Crear un entrenamiento

- Ve a "Entrenamientos"
- Haz clic en "Nuevo Entrenamiento"
- Dale un nombre y selecciona ejercicios
- Guarda tu rutina

### 5. Explorar el Dashboard

- Vuelve al Dashboard para ver tus estadísticas
- Revisa tus gráficos de progreso
- Consulta tus recomendaciones personalizadas

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Ver la base de datos visualmente
npm run db:studio

# Linter
npm run lint

# Build para producción
npm run build
npm run start
```

## 📊 Datos de Ejemplo

El seed incluye 27 ejercicios predefinidos organizados por grupo muscular:

- Pecho (4 ejercicios)
- Espalda (4 ejercicios)
- Piernas (5 ejercicios)
- Hombros (4 ejercicios)
- Bíceps (3 ejercicios)
- Tríceps (3 ejercicios)
- Abdomen (4 ejercicios)

## ❓ Problemas Comunes

### Error de conexión a la base de datos

Verifica que:
- PostgreSQL esté corriendo
- Las credenciales en `.env` sean correctas
- La base de datos exista

```bash
# Verificar PostgreSQL (Linux/Mac)
sudo service postgresql status

# Verificar PostgreSQL (Windows)
# Busca "Services" y verifica que PostgreSQL esté corriendo
```

### Error "NEXTAUTH_SECRET is not set"

Asegúrate de tener `NEXTAUTH_SECRET` en tu archivo `.env`:

```bash
openssl rand -base64 32
```

Copia el resultado en tu `.env`.

### Prisma no encuentra el schema

Ejecuta:

```bash
npx prisma generate
npm run db:push
```

## 🎉 ¡Listo!

Tu aplicación está configurada y lista para usar. Explora todas las funcionalidades y comienza tu transformación física.

## 📚 Más Información

- [README.md](./README.md) - Documentación completa
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth Docs](https://next-auth.js.org)
