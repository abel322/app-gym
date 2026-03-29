# 🎨 Especificaciones de Diseño - Digital Marketplace

## 📋 Resumen

Este documento define las especificaciones de diseño visual para la plataforma de venta de productos digitales, basado en la imagen de referencia proporcionada.

**Filosofía de diseño:** Limpio, moderno, minimalista con toques de color vibrantes.

---

## 🎨 Paleta de Colores

### Colores Principales

```css
/* Primary - Naranja/Coral */
--primary-main: #FF6B35;
--primary-light: #FF8C61;
--primary-dark: #E65A2E;
--primary-gradient: linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%);

/* Secondary - Azul suave */
--secondary-main: #4ECDC4;
--secondary-light: #6FD9D1;
--secondary-dark: #3BB5AD;

/* Background */
--bg-primary: #FFFFFF;
--bg-secondary: #F8F9FA;
--bg-tertiary: #F1F3F5;

/* Text */
--text-primary: #212529;
--text-secondary: #6C757D;
--text-tertiary: #ADB5BD;
--text-white: #FFFFFF;

/* Neutrals */
--gray-50: #F8F9FA;
--gray-100: #F1F3F5;
--gray-200: #E9ECEF;
--gray-300: #DEE2E6;
--gray-400: #CED4DA;
--gray-500: #ADB5BD;
--gray-600: #6C757D;
--gray-700: #495057;
--gray-800: #343A40;
--gray-900: #212529;

/* Semantic Colors */
--success: #28A745;
--warning: #FFC107;
--error: #DC3545;
--info: #17A2B8;
```

### Gradientes

```css
/* Primary Gradient */
--gradient-primary: linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%);

/* Secondary Gradient */
--gradient-secondary: linear-gradient(135deg, #4ECDC4 0%, #6FD9D1 100%);

/* Subtle Background Gradients */
--gradient-bg-1: linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%);
--gradient-bg-2: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);

/* Hero Gradients */
--gradient-hero: linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%);
```

---

## 📱 Diseño Móvil (320px - 768px)

### Layout Principal

```
┌─────────────────────────┐
│   Search Bar + Icons    │ ← 60px altura
├─────────────────────────┤
│                         │
│   Contenido Principal   │
│   (Grid 2 columnas)     │
│                         │
├─────────────────────────┤
│   Bottom Navigation     │ ← 70px altura
└─────────────────────────┘
```

### Componentes Móviles

#### 1. Search Bar
```
- Altura: 48px
- Border radius: 24px (pill shape)
- Background: #F8F9FA
- Padding: 12px 20px
- Icon: Lupa (20px)
- Placeholder: color #ADB5BD
- Font size: 14px
```

#### 2. Product Card (Móvil)
```
┌──────────────────┐
│                  │
│   [Imagen]       │  ← 150px altura
│     ♥️           │  ← Icono favorito (top-right)
│   -20%           │  ← Badge descuento (top-left)
├──────────────────┤
│ Título Producto  │  ← 14px, font-weight 600
│ Categoría        │  ← 12px, color secondary
│ ★★★★★ (4.5)     │  ← Rating
│ $99.99  $79.99   │  ← Precio tachado + precio final
│   [+ Carrito]    │  ← Botón con gradiente
└──────────────────┘

- Border radius: 16px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Padding: 12px
- Gap interno: 8px
- Hover: transform scale(1.02)
```

#### 3. Bottom Navigation
```
┌───────┬───────┬───────┬───────┬───────┐
│ Home  │ Categ │ Cart  │ Favor │ Profil│
│  🏠   │  📁   │  🛒   │  ❤️   │  👤  │
└───────┴───────┴───────┴───────┴───────┘

- Altura: 70px
- Background: #FFFFFF
- Border top: 1px solid #E9ECEF
- Icons: 24px
- Labels: 11px
- Active color: #FF6B35
- Inactive color: #ADB5BD
```

#### 4. Badge de Descuento
```
- Background: #FF6B35
- Color: #FFFFFF
- Padding: 4px 8px
- Border radius: 8px
- Font size: 12px
- Font weight: 700
- Position: absolute top-left (8px, 8px)
```

---

## 💻 Diseño Desktop (769px+)

### Layout Principal

```
┌─────────────────────────────────────────────────────┐
│  Logo    [Search Bar]         Cart  Profile  Login  │ ← Header 80px
├─────────────────────────────────────────────────────┤
│  [Navigation Menu]                                   │ ← 60px
├──────────┬──────────────────────────────────────────┤
│          │                                           │
│ Filters  │     Product Grid (3-4 columnas)          │
│ Sidebar  │                                           │
│          │                                           │
│  150px   │                                           │
├──────────┴──────────────────────────────────────────┤
│                    Footer                            │
└─────────────────────────────────────────────────────┘
```

### Componentes Desktop

#### 1. Header
```
- Altura: 80px
- Background: #FFFFFF
- Box shadow: 0 2px 12px rgba(0,0,0,0.04)
- Padding: 0 40px
- Sticky position

Elementos:
  - Logo: 120px ancho
  - Search bar: max-width 500px
  - Icons: 28px
  - Espaciado: flex justify-between
```

#### 2. Navigation Menu
```
- Altura: 60px
- Background: gradient o color sólido
- Links: 16px, font-weight 500
- Hover: underline + color change
- Gap entre items: 32px
```

#### 3. Product Card (Desktop)
```
┌──────────────────┐
│                  │
│   [Imagen]       │  ← 220px altura
│     ♥️           │
│   -20%           │
├──────────────────┤
│ Título Producto  │  ← 16px, font-weight 600
│ Categoría        │  ← 13px
│ ★★★★★ (4.5)     │
│                  │
│ $99.99  $79.99   │
│ [Ver Detalles]   │  ← Botón outline
│ [Añadir Carrito] │  ← Botón filled con gradiente
└──────────────────┘

- Border radius: 20px
- Shadow: 0 4px 16px rgba(0,0,0,0.08)
- Padding: 16px
- Max-width: 320px
- Hover: transform translateY(-8px)
- Transition: all 0.3s ease
```

#### 4. Sidebar de Filtros
```
- Width: 280px
- Background: #FFFFFF
- Border radius: 16px
- Padding: 24px
- Sticky position (top: 100px)

Secciones:
  - Categorías (checkboxes)
  - Rango de precio (slider)
  - Rating mínimo
  - Tags/Etiquetas
```

---

## 🔤 Tipografía

### Font Family

```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-headings: 'Inter', sans-serif;
```

### Escala Tipográfica

```css
/* Headings */
--h1: 48px / 700 / 1.2;      /* Hero titles */
--h2: 36px / 700 / 1.3;      /* Section titles */
--h3: 28px / 600 / 1.4;      /* Card titles */
--h4: 24px / 600 / 1.4;      /* Subsections */
--h5: 20px / 600 / 1.5;      /* Small headings */
--h6: 18px / 600 / 1.5;      /* Labels */

/* Body */
--body-large: 18px / 400 / 1.6;
--body-regular: 16px / 400 / 1.6;
--body-small: 14px / 400 / 1.5;
--body-tiny: 12px / 400 / 1.4;

/* Special */
--caption: 11px / 500 / 1.3;
--overline: 10px / 700 / 1.2 / uppercase / letter-spacing: 1px;
```

### Responsive Typography (Móvil)

```css
/* Móvil - Reducir 20% */
--h1-mobile: 38px / 700 / 1.2;
--h2-mobile: 28px / 700 / 1.3;
--h3-mobile: 22px / 600 / 1.4;
--h4-mobile: 20px / 600 / 1.4;
--body-regular-mobile: 14px / 400 / 1.6;
```

---

## 🎭 Componentes UI

### 1. Botones

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: #FF6B35;
  border: 2px solid #FF6B35;
  border-radius: 12px;
  padding: 12px 26px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #FF6B35;
  color: #FFFFFF;
}
```

#### Icon Button
```css
.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #F8F9FA;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: #E9ECEF;
  transform: scale(1.1);
}
```

### 2. Input Fields

```css
.input-field {
  width: 100%;
  height: 48px;
  border: 2px solid #E9ECEF;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 15px;
  color: #212529;
  transition: all 0.3s ease;
  background: #FFFFFF;
}

.input-field:focus {
  border-color: #FF6B35;
  outline: none;
  box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
}

.input-field::placeholder {
  color: #ADB5BD;
}
```

### 3. Cards

```css
.card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.card-image {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}
```

### 4. Badges

```css
.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-discount {
  background: #FF6B35;
  color: #FFFFFF;
}

.badge-new {
  background: #28A745;
  color: #FFFFFF;
}

.badge-featured {
  background: linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%);
  color: #FFFFFF;
}
```

### 5. Rating Stars

```css
.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  font-size: 16px;
  color: #FFC107;
}

.star-empty {
  color: #DEE2E6;
}

.rating-number {
  margin-left: 6px;
  font-size: 14px;
  color: #6C757D;
  font-weight: 500;
}
```

---

## 🎬 Animaciones y Transiciones

### Transiciones Base

```css
/* Suaves y naturales */
--transition-fast: 0.15s ease;
--transition-base: 0.3s ease;
--transition-slow: 0.5s ease;

/* Específicas */
--transition-transform: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-fade: opacity 0.3s ease;
--transition-slide: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover Effects

```css
/* Cards */
.card-hover {
  transition: all 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* Buttons */
.btn-hover {
  transition: all 0.3s ease;
}
.btn-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

/* Images */
.image-zoom {
  transition: transform 0.5s ease;
}
.image-zoom:hover {
  transform: scale(1.1);
}
```

### Loading States

```css
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #F1F3F5 0%,
    #E9ECEF 50%,
    #F1F3F5 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}
```

---

## 📐 Espaciado y Grid

### Sistema de Espaciado (8px base)

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
```

### Grid System

```css
/* Móvil */
--grid-mobile: repeat(2, 1fr);
--gap-mobile: 16px;

/* Tablet */
--grid-tablet: repeat(3, 1fr);
--gap-tablet: 20px;

/* Desktop */
--grid-desktop: repeat(4, 1fr);
--gap-desktop: 24px;
```

### Container Widths

```css
--container-sm: 540px;
--container-md: 720px;
--container-lg: 960px;
--container-xl: 1140px;
--container-2xl: 1320px;
```

---

## 🌓 Modo Oscuro (Opcional)

```css
/* Dark Mode Colors */
--dark-bg-primary: #1A1A1A;
--dark-bg-secondary: #242424;
--dark-bg-tertiary: #2E2E2E;
--dark-text-primary: #FFFFFF;
--dark-text-secondary: #B0B0B0;
--dark-text-tertiary: #808080;

/* Mantener colores de acento */
--dark-primary: #FF6B35; /* Sin cambios */
```

---

## 📱 Breakpoints

```css
/* Mobile First */
--breakpoint-xs: 0px;      /* Extra small devices */
--breakpoint-sm: 576px;    /* Small devices */
--breakpoint-md: 768px;    /* Medium devices */
--breakpoint-lg: 992px;    /* Large devices */
--breakpoint-xl: 1200px;   /* Extra large devices */
--breakpoint-2xl: 1400px;  /* XXL devices */
```

### Media Queries

```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 991px) { }

/* Desktop */
@media (min-width: 992px) { }

/* Large Desktop */
@media (min-width: 1200px) { }
```

---

## 🎯 Iconografía

### Icon System

```
- Librería: Material Icons / Heroicons
- Tamaños:
  - xs: 16px (badges, tags)
  - sm: 20px (botones pequeños)
  - md: 24px (navegación, cards)
  - lg: 32px (headers, features)
  - xl: 48px (hero sections)
```

### Iconos Principales

```
🏠 Home - Casa
📁 Categorías - Carpeta/Grid
🛒 Carrito - Carrito de compra
❤️ Favoritos - Corazón
👤 Perfil - Usuario
🔍 Buscar - Lupa
⭐ Rating - Estrella
➕ Añadir - Plus
✓ Completado - Check
🎓 Cursos - Gorro graduación
🎵 Música - Nota musical
📦 Productos - Caja
```

---

## 📄 Páginas Específicas

### Home Page (Móvil)

```
1. Search Bar (60px)
2. Hero Banner (200px) - Con gradiente
3. Categorías Destacadas (horizontal scroll)
4. Productos en Oferta (grid 2 col)
5. Nuevos Productos (grid 2 col)
6. Testimonios (carousel)
7. Bottom Navigation (70px)
```

### Home Page (Desktop)

```
1. Header (80px)
2. Navigation Menu (60px)
3. Hero Section (500px) - Full width con gradiente
4. Categorías Grid (4 columnas)
5. Featured Products (4 columnas)
6. Promociones (banner full width)
7. Productos Recientes (4 columnas)
8. Newsletter Section
9. Footer
```

### Product Detail Page

```
Móvil:
- Image Carousel (300px)
- Title + Price
- Rating + Reviews
- Descripción (collapsible)
- Contenidos (collapsible)
- Botón Añadir al Carrito (sticky bottom)
- Productos Relacionados

Desktop:
- Layout 2 columnas (60/40)
- Izquierda: Images + Gallery
- Derecha: Info + Purchase
- Below: Tabs (Descripción, Contenidos, Reviews)
- Productos Relacionados (4 col)
```

---

## ✨ Efectos Especiales

### Glass Morphism

```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### Gradient Text

```css
.gradient-text {
  background: linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Floating Animation

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.floating {
  animation: float 3s ease-in-out infinite;
}
```

---

## 🎨 Tema Material UI

### Configuración Completa

```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35',
      light: '#FF8C61',
      dark: '#E65A2E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4ECDC4',
      light: '#6FD9D1',
      dark: '#3BB5AD',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212529',
      secondary: '#6C757D',
      disabled: '#ADB5BD',
    },
    error: { main: '#DC3545' },
    warning: { main: '#FFC107' },
    info: { main: '#17A2B8' },
    success: { main: '#28A745' },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.04)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 16px rgba(0,0,0,0.08)',
    '0 8px 24px rgba(0,0,0,0.12)',
    '0 12px 32px rgba(0,0,0,0.12)',
    // ... más niveles
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E65A2E 0%, #FF6B35 100%)',
            boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover fieldset': {
              borderColor: '#FF6B35',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF6B35',
            },
          },
        },
      },
    },
  },
});
```

---

## 📝 Checklist de Implementación

- [ ] Instalar fuente Inter desde Google Fonts
- [ ] Configurar tema MUI con colores personalizados
- [ ] Crear variables CSS globales
- [ ] Implementar componentes base (Button, Card, Input)
- [ ] Configurar grid responsive
- [ ] Añadir transiciones y animaciones
- [ ] Implementar Bottom Navigation (móvil)
- [ ] Crear Header responsive (desktop)
- [ ] Configurar iconos (Material Icons)
- [ ] Testear en diferentes dispositivos

---

**Última actualización:** Marzo 2026 | Versión 1.0
