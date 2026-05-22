---
version: "alpha"
name: Materna
description: Diseño móvil para app de embarazo, cálida y tranquilizadora, con paleta rosa suave sobre fondo blanco y tarjetas limpias.

colors:
  background: "#FFF7FA"        # fondo general ligeramente rosado
  surface: "#FFFFFF"           # tarjetas y paneles
  surface-variant: "#FFEFF4"   # fondos destacados (cards secundarias, chips grandes)
  primary: "#FF8AA5"           # rosa principal: CTAs, acentos
  primary-soft: "#FFD5E0"      # rosa suave: chips, fondos
  secondary: "#FFC6D6"         # rosa medio: navegación e iconos activos
  text-primary: "#1F1F1F"      # texto principal casi negro
  text-secondary: "#808080"    # texto secundario / metadatos
  border-subtle: "#F3E3EA"     # bordes muy suaves
  success: "#5BC8A8"           # progreso positivo (anillos, stats)
  chart-primary: "#FF8AA5"     # anillo principal
  chart-secondary: "#FFE4EC"   # anillo de fondo

typography:
  headline-lg:
    fontFamily: SF Pro Rounded
    fontSize: 28px
    fontWeight: 700
    lineHeight: 34px
  headline-md:
    fontFamily: SF Pro Rounded
    fontSize: 22px
    fontWeight: 600
    lineHeight: 28px
  headline-sm:
    fontFamily: SF Pro Rounded
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
  body-md:
    fontFamily: SF Pro Text
    fontSize: 16px
    fontWeight: 400
    lineHeight: 22px
  body-sm:
    fontFamily: SF Pro Text
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label-sm:
    fontFamily: SF Pro Text
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.5px

rounded:
  sm: 8px
  md: 16px
  lg: 24px
  full: 999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 16px

  button-secondary:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 16px

  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 16px

  app-bar:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
    typography: "{typography.headline-sm}"
    height: 56px

  bottom-nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.label-sm}"
    height: 72px

  bottom-nav-item-active:
    textColor: "{colors.primary}"
  bottom-nav-item-inactive:
    textColor: "{colors.text-secondary}"

  chip-topic:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.text-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 8px

  pill-day-counter:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
    padding: 8px

  progress-ring-main:
    color: "{colors.chart-primary}"
    backgroundColor: "{colors.chart-secondary}"
    size: 220px

  list-item-article:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 16px

---

## Overview

Sistema de diseño para una app de embarazo centrada en la información y el acompañamiento emocional.  
Se prioriza un aspecto suave y femenino mediante una paleta de rosas claros, grandes áreas en blanco y tipografía redondeada para transmitir calma y cercanía.

## Colors

- **Primary** (`{colors.primary}`): botones principales, estados activos y elementos clave del flujo.
- **Primary Soft** (`{colors.primary-soft}`): chips de temas, tags y fondos secundarios.
- **Background** (`{colors.background}`): fondo general de las pantallas.
- **Surface / Surface Variant** (`{colors.surface}`, `{colors.surface-variant}`): tarjetas, módulos y contenedores de contenido.
- **Text Primary / Secondary** (`{colors.text-primary}`, `{colors.text-secondary}`): jerarquía entre títulos, cuerpo y metadatos.

## Typography

- **Headlines** (`headline-lg`, `headline-md`, `headline-sm`): SF Pro Rounded con pesos medios y altos para títulos y encabezados de secciones.
- **Body** (`body-md`, `body-sm`): SF Pro Text para contenido principal y descripciones largas.
- **Labels** (`label-sm`): usado para navegación, chips y pequeñas etiquetas, con ligero aumento de tracking.

## Layout

- Base de espaciado: `{spacing.sm}` con escala `{spacing.sm}`, `{spacing.md}`, `{spacing.lg}`, `{spacing.xl}` para separar secciones.  
- Márgenes horizontales estándar: `{spacing.lg}` desde el borde de pantalla en vistas principales.  
- Las pantallas se organizan en scroll vertical con secciones apiladas y pocas columnas, para favorecer la lectura.

## Elevation & Depth

- Las tarjetas se diferencian principalmente por contraste de color y radio de esquinas, con sombras muy sutiles o inexistentes.  
- Elementos flotantes (p. ej., bottom nav) pueden tener una sombra suave de gran blur y baja opacidad para destacar sobre el fondo.

## Shapes

- Tarjetas: `{rounded.md}` como radio principal, coherente en toda la app.  
- Contenedores grandes y secciones destacadas: `{rounded.lg}` para enfatizar bloques clave.  
- Botones y chips: `{rounded.full}` en forma de píldora para reforzar la sensación agradable y accesible.

## Components

- **Botones**  
  - `button-primary`: CTA principal en rosa intenso con texto blanco, suelen ocupar casi todo el ancho disponible.  
  - `button-secondary`: botones de apoyo con fondo rosa suave y texto rosa intenso.

- **Navegación**  
  - `app-bar`: barra superior clara con título de sección y posible icono de menú o ajustes.  
  - `bottom-nav`: barra inferior con iconos y etiquetas; el elemento activo usa `{colors.primary}`.

- **Contenido**  
  - `card-surface`: tarjetas para secciones como resumen de embarazo, métricas del bebé o bloques de bienvenida.  
  - `list-item-article`: ítems de lista para artículos de “Healthy Tips”, con título, descripción breve y posible thumbnail.  
  - `chip-topic`: chips para filtrar por temas (p. ej., “Body Care”, “Safety & Care”).  
  - `progress-ring-main`: anillo de progreso que muestra día/semana de embarazo en el centro.

## Do's and Don'ts

**Do**

- Usar el color primario para la acción más importante de cada pantalla.  
- Mantener espacios generosos entre tarjetas y secciones para evitar saturación visual.  
- Respetar los radios de esquina definidos en `rounded` para mantener consistencia.

**Don'ts**

- No usar el rosa primario como fondo de pantalla completo.  
- No introducir colores saturados adicionales que compitan con la paleta de rosas.  
- No mezclar esquinas completamente rectas con esquinas muy redondeadas en la misma vista.