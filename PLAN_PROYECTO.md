# 📋 Plan de Desarrollo - Plataforma de Venta de Productos Digitales

## 🎯 Resumen del Proyecto

Plataforma web completa para venta de productos digitales (cursos online, música, samples, loops) con integración a YouTube, sistema de pagos y área de aprendizaje.

**Stack Tecnológico:**
- Next.js 14+ (App Router)
- PostgreSQL + Prisma ORM
- Material UI (MUI) con diseño moderno y gradientes
- NextAuth.js / Clerk (autenticación)
- Stripe / PayPal (pagos)
- AWS S3 / Vercel Blob (almacenamiento)
- YouTube Data API v3

---

## 📦 FASE 1: Configuración Inicial del Proyecto

**Duración estimada:** Inicio del proyecto

### Tareas:

#### 1.1 Crear proyecto Next.js
```bash
npx create-next-app@latest digital-marketplace --typescript --app --tailwind
cd digital-marketplace
```

#### 1.2 Instalar dependencias principales
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @prisma/client prisma
npm install next-auth @auth/prisma-adapter
npm install stripe @stripe/stripe-js
npm install react-hook-form zod
npm install axios swr
npm install dayjs
```

#### 1.3 Instalar dependencias de desarrollo
```bash
npm install -D @types/node typescript eslint prettier
```

#### 1.4 Configurar variables de entorno
Crear `.env.local`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/marketplace"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-generado"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# AWS S3
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_BUCKET_NAME=""

# YouTube API
YOUTUBE_API_KEY=""

# Email (Resend, SendGrid, etc.)
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM=""
```

#### 1.5 Crear estructura de carpetas
```
src/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx (home)
│   │   ├── about/
│   │   └── blog/
│   ├── (shop)/
│   │   ├── products/
│   │   ├── cart/
│   │   └── checkout/
│   ├── (dashboard)/
│   │   ├── profile/
│   │   ├── purchases/
│   │   └── learning/
│   ├── admin/
│   │   ├── products/
│   │   ├── users/
│   │   └── orders/
│   ├── api/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── upload/
│   │   └── webhooks/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   └── ProductDetail.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartDrawer.tsx
│   └── player/
│       ├── AudioPlayer.tsx
│       └── VideoPlayer.tsx
├── lib/
│   ├── prisma.ts
│   ├── stripe.ts
│   ├── youtube.ts
│   ├── s3.ts
│   └── utils.ts
├── hooks/
│   ├── useCart.ts
│   ├── useAuth.ts
│   └── useProducts.ts
├── types/
│   ├── product.ts
│   ├── user.ts
│   └── order.ts
└── styles/
    └── theme.ts
```

**Entregables:**
- ✅ Proyecto Next.js creado
- ✅ Todas las dependencias instaladas
- ✅ Variables de entorno configuradas
- ✅ Estructura de carpetas completa

---

## 🗄️ FASE 2: Base de Datos y Modelos

### Tareas:

#### 2.1 Definir schema de Prisma

Crear `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?
  emailVerified DateTime?
  image         String?
  role          Role      @default(CUSTOMER)
  
  accounts      Account[]
  sessions      Session[]
  profile       Profile?
  orders        Order[]
  products      Product[]
  lessonsCompleted UserLesson[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Profile {
  id             String   @id @default(cuid())
  bio            String?
  avatar         String?
  youtubeChannel String?
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Product {
  id          String        @id @default(cuid())
  title       String
  description String        @db.Text
  price       Float
  category    Category      @default(COURSE)
  type        ProductType
  authorId    String
  author      User          @relation(fields: [authorId], references: [id])
  images      String[]
  previewUrl  String?
  fileUrl     String?
  lessons     Lesson[]
  tags        String[]
  published   Boolean       @default(false)
  featured    Boolean       @default(false)
  
  orderItems  OrderItem[]
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Lesson {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  videoUrl    String
  videoId     String?
  duration    Int?
  order       Int
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  completedBy UserLesson[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model UserLesson {
  userId      String
  lessonId    String
  completed   Boolean  @default(false)
  completedAt DateTime?
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@id([userId, lessonId])
}

model Order {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  items         OrderItem[]
  total         Float
  status        OrderStatus @default(PENDING)
  paymentIntent String?
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int      @default(1)
  price     Float
}

enum Role {
  ADMIN
  INSTRUCTOR
  CUSTOMER
}

enum Category {
  COURSE
  MUSIC
  SAMPLE
  LOOP
}

enum ProductType {
  COURSE
  DIGITAL_DOWNLOAD
}

enum OrderStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

#### 2.2 Configurar cliente Prisma

Crear `src/lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

#### 2.3 Ejecutar migraciones
```bash
npx prisma generate
npx prisma db push
npx prisma studio # para verificar
```

**Entregables:**
- ✅ Schema de Prisma completo
- ✅ Cliente Prisma configurado
- ✅ Base de datos migrada

---

## 🔐 FASE 3: Autenticación

### Tareas:

#### 3.1 Configurar NextAuth.js

Crear `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Implementar lógica de autenticación
      }
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

#### 3.2 Crear páginas de autenticación
- `app/auth/signin/page.tsx` - Login
- `app/auth/signup/page.tsx` - Registro
- `app/auth/forgot-password/page.tsx` - Recuperación

#### 3.3 Crear middleware de protección
Crear `middleware.ts`:
```typescript
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  },
})

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
```

**Entregables:**
- ✅ NextAuth configurado
- ✅ Páginas de login/registro
- ✅ Middleware de protección

---

## 🎨 FASE 4: UI/UX y Tema MUI

### Tareas:

#### 4.1 Crear tema personalizado

Crear `src/styles/theme.ts`:
```typescript
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#764ba2',
      dark: '#5568d3',
    },
    secondary: {
      main: '#f093fb',
      light: '#4facfe',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
        contained: {
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(90deg, #5568d3 0%, #653a91 100%)',
            boxShadow: '0 6px 25px rgba(102, 126, 234, 0.6)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
          },
        },
      },
    },
  },
})
```

#### 4.2 Componentes base reutilizables
- `components/ui/Button.tsx` - Botón con gradiente
- `components/ui/Card.tsx` - Tarjeta con hover effect
- `components/ui/Input.tsx` - Input con validación
- `components/ui/Modal.tsx` - Modal reutilizable

#### 4.3 Layout principal
- `components/layout/Navbar.tsx` - Navbar responsive
- `components/layout/Footer.tsx` - Footer
- `app/layout.tsx` - Root layout con ThemeProvider

**Entregables:**
- ✅ Tema MUI personalizado con gradientes
- ✅ Componentes UI base
- ✅ Layout responsive

---

## 🏠 FASE 5: Páginas Públicas

### Tareas:

#### 5.1 Página de inicio
`app/(marketing)/page.tsx`:
- Hero section con gradiente
- Categorías destacadas
- Productos recientes
- Testimonios
- CTA buttons

#### 5.2 Página About
`app/(marketing)/about/page.tsx`:
- Historia del proyecto
- Equipo
- Misión y visión

#### 5.3 Blog/Recursos
`app/(marketing)/blog/page.tsx`:
- Listado de artículos
- Vídeos de YouTube incrustados
- Filtros por categoría

**Entregables:**
- ✅ Home page completa
- ✅ About page
- ✅ Blog con YouTube embeds

---

## 🛍️ FASE 6: Sistema de Productos

### Tareas:

#### 6.1 API Routes para productos
- `app/api/products/route.ts` - GET (list), POST (create)
- `app/api/products/[id]/route.ts` - GET, PUT, DELETE

#### 6.2 Página de listado
`app/(shop)/products/page.tsx`:
- Grid de productos
- Filtros (categoría, precio, género, popularidad)
- Paginación
- Búsqueda

#### 6.3 Página de detalle
`app/(shop)/products/[id]/page.tsx`:
- Reproductor preview (audio/video)
- Descripción completa
- Lista de contenidos
- Botones: "Añadir al carrito" / "Comprar ahora"
- Productos relacionados

#### 6.4 ProductCard component
`components/product/ProductCard.tsx`:
- Imagen con gradiente overlay
- Título, precio, autor
- Rating
- Hover effects

**Entregables:**
- ✅ API de productos funcional
- ✅ Listado con filtros
- ✅ Detalle de producto
- ✅ ProductCard con efectos

---

## 🛒 FASE 7: Carrito de Compras

### Tareas:

#### 7.1 Hook de carrito
`hooks/useCart.ts`:
```typescript
export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([])
  
  const addItem = (product: Product) => { /* ... */ }
  const removeItem = (id: string) => { /* ... */ }
  const updateQuantity = (id: string, qty: number) => { /* ... */ }
  const clearCart = () => { /* ... */ }
  const applyCoupon = (code: string) => { /* ... */ }
  
  return { items, addItem, removeItem, total, ... }
}
```

#### 7.2 Componentes de carrito
- `components/cart/CartDrawer.tsx` - Sidebar del carrito
- `components/cart/CartItem.tsx` - Item individual
- `components/cart/CartSummary.tsx` - Resumen y totales

#### 7.3 Persistencia
- localStorage para invitados
- API para usuarios autenticados

**Entregables:**
- ✅ Hook de carrito funcional
- ✅ UI del carrito
- ✅ Persistencia implementada

---

## 💳 FASE 8: Checkout y Pagos

### Tareas:

#### 8.1 Configurar Stripe
`lib/stripe.ts`:
```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})
```

#### 8.2 Página de checkout
`app/(shop)/checkout/page.tsx`:
- Step 1: Datos de facturación
- Step 2: Método de pago (Stripe Elements)
- Resumen del pedido

#### 8.3 API de pagos
- `app/api/checkout/route.ts` - Crear Payment Intent
- `app/api/webhooks/stripe/route.ts` - Webhook de Stripe

#### 8.4 Confirmación y emails
- Página de confirmación
- Envío de email con Resend/SendGrid

**Entregables:**
- ✅ Stripe integrado
- ✅ Checkout funcional
- ✅ Webhooks configurados
- ✅ Emails de confirmación

---

## 👤 FASE 9: Área de Usuario

### Tareas:

#### 9.1 Perfil
`app/(dashboard)/profile/page.tsx`:
- Editar datos personales
- Cambiar contraseña
- Avatar

#### 9.2 Historial de compras
`app/(dashboard)/purchases/page.tsx`:
- Listado de órdenes
- Estado de cada orden
- Facturas descargables

#### 9.3 Área de descargas
`app/(dashboard)/downloads/page.tsx`:
- Productos digitales adquiridos
- Enlaces de descarga seguros

**Entregables:**
- ✅ Perfil editable
- ✅ Historial de compras
- ✅ Descargas seguras

---

## 📚 FASE 10: Sistema de Cursos

### Tareas:

#### 10.1 Mis cursos
`app/(dashboard)/learning/page.tsx`:
- Grid de cursos adquiridos
- Barra de progreso por curso

#### 10.2 Reproductor de curso
`app/(dashboard)/learning/[courseId]/page.tsx`:
- Lista de lecciones (sidebar)
- Reproductor de YouTube embebido
- Botón "Marcar como completado"
- Navegación anterior/siguiente

#### 10.3 Tracking de progreso
- API para marcar lecciones completadas
- Actualización en tiempo real
- Certificado al 100%

**Entregables:**
- ✅ Área de aprendizaje
- ✅ Reproductor de curso
- ✅ Sistema de progreso

---

## 🔧 FASE 11: Panel de Administración

### Tareas:

#### 11.1 Dashboard admin
`app/admin/page.tsx`:
- Estadísticas de ventas
- Gráficos (Chart.js / Recharts)
- Métricas clave

#### 11.2 CRUD de productos
`app/admin/products/page.tsx`:
- Listado con acciones
- Formulario dinámico según tipo
- Subida de imágenes

#### 11.3 Gestión de usuarios
`app/admin/users/page.tsx`:
- Listado de usuarios
- Cambiar roles
- Ver actividad

#### 11.4 Gestión de órdenes
`app/admin/orders/page.tsx`:
- Listado de órdenes
- Filtros y búsqueda
- Exportar a CSV

**Entregables:**
- ✅ Dashboard con estadísticas
- ✅ CRUD completo
- ✅ Gestión de usuarios/órdenes

---

## 📺 FASE 12: Integración con YouTube

### Tareas:

#### 12.1 Configurar YouTube API
`lib/youtube.ts`:
```typescript
import { google } from 'googleapis'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})

export const searchVideos = async (query: string) => { /* ... */ }
export const getVideoDetails = async (videoId: string) => { /* ... */ }
```

#### 12.2 Buscador de vídeos
`components/admin/YouTubeSearch.tsx`:
- Buscar vídeos por keyword
- Vista previa
- Seleccionar para asociar

#### 12.3 Extracción de metadatos
- Duración del vídeo
- Thumbnail
- Título y descripción

#### 12.4 Perfil de instructor
- Mostrar canal de YouTube
- Lista de reproducción destacada

**Entregables:**
- ✅ YouTube API configurada
- ✅ Buscador de vídeos
- ✅ Metadatos automáticos
- ✅ Perfil de instructor

---

## ☁️ FASE 13: Almacenamiento de Archivos

### Tareas:

#### 13.1 Configurar S3 / Vercel Blob
`lib/s3.ts`:
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const uploadFile = async (file: File, folder: string) => { /* ... */ }
export const getSignedUrl = async (key: string) => { /* ... */ }
```

#### 13.2 API de upload
`app/api/upload/route.ts`:
- Recibir archivos
- Validar tipo y tamaño
- Subir a S3
- Retornar URL

#### 13.3 URLs firmadas
- Generar URLs con expiración
- Proteger descargas

**Entregables:**
- ✅ S3/Blob configurado
- ✅ API de upload
- ✅ Descargas seguras

---

## 🧪 FASE 14: Testing y Optimización

### Tareas:

#### 14.1 Tests unitarios
- Tests para funciones de pago
- Tests de autenticación
- Tests de carrito

#### 14.2 Optimización
- Implementar SSR/SSG según página
- Lazy loading de componentes
- Optimización de imágenes (next/image)

#### 14.3 UX improvements
- Skeletons de carga
- Error boundaries
- Toast notifications

**Entregables:**
- ✅ Suite de tests
- ✅ Optimizaciones aplicadas
- ✅ UX mejorada

---

## 🚀 FASE 15: Deployment

### Tareas:

#### 15.1 Base de datos en producción
- Configurar PostgreSQL (Vercel Postgres / Supabase / Railway)
- Ejecutar migraciones

#### 15.2 Deploy en Vercel
```bash
vercel --prod
```

#### 15.3 Configuración final
- Variables de entorno de producción
- Dominio personalizado
- SSL automático

#### 15.4 Monitoreo
- Error tracking (Sentry)
- Analytics (Google Analytics / Plausible)

**Entregables:**
- ✅ App desplegada en producción
- ✅ Dominio configurado
- ✅ Monitoreo activo

---

## 📊 Resumen de Fases

| Fase | Nombre | Complejidad | Dependencias |
|------|--------|-------------|--------------|
| 1 | Configuración Inicial | Baja | - |
| 2 | Base de Datos | Media | Fase 1 |
| 3 | Autenticación | Media | Fase 2 |
| 4 | UI/UX | Media | Fase 1 |
| 5 | Páginas Públicas | Baja | Fase 4 |
| 6 | Sistema de Productos | Alta | Fase 2, 4 |
| 7 | Carrito | Media | Fase 6 |
| 8 | Checkout y Pagos | Alta | Fase 3, 7 |
| 9 | Área de Usuario | Media | Fase 3, 8 |
| 10 | Sistema de Cursos | Alta | Fase 9 |
| 11 | Panel Admin | Alta | Fase 3, 6 |
| 12 | YouTube Integration | Media | Fase 10, 11 |
| 13 | Almacenamiento | Media | Fase 11 |
| 14 | Testing | Media | Todas |
| 15 | Deployment | Media | Todas |

---

## 🎯 Orden de Implementación Recomendado

1. **Fundamentos** (Fases 1-4): Base técnica y diseño
2. **Core Features** (Fases 6-8): Productos, carrito y pagos
3. **User Experience** (Fases 9-10): Perfil y cursos
4. **Advanced** (Fases 11-13): Admin y integraciones
5. **Launch** (Fases 14-15): Testing y deploy

---

## 📝 Notas Importantes

- Cada fase puede tomar varios días dependiendo de la complejidad
- Se recomienda hacer commits frecuentes y usar branches por feature
- Testear cada funcionalidad antes de pasar a la siguiente fase
- Documentar decisiones técnicas importantes
- Mantener el código limpio y siguiendo best practices

---

## 🔗 Recursos Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Material UI Docs](https://mui.com/)
- [Stripe Docs](https://stripe.com/docs)
- [YouTube API Docs](https://developers.google.com/youtube/v3)

---

**Última actualización:** Marzo 2026
