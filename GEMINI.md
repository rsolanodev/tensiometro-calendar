# Materna - Tensiometro Calendar (Guía de Desarrollo)

Este documento sirve como guía de referencia y especificaciones para el desarrollo de la aplicación **Materna - Tensiometro Calendar**.

## Descripción del Proyecto

**Materna** es una aplicación web diseñada para que una mujer embarazada pueda llevar un registro diario de:
1. **Datos de tensión arterial** (presión sistólica, diastólica y pulso).
2. **Control de medicación** (si ha tomado la pastilla de la tensión diaria).
3. **Notas y síntomas diarios** (opcional, para añadir contexto emocional o de salud física).

El objetivo principal es proporcionar una interfaz cálida, tranquilizadora y sumamente intuitiva, optimizada para dispositivos móviles (diseño Mobile-First).

---

## Directrices Clave de Desarrollo

### 1. Pruebas y Cobertura (Testing Mandate)
* **Requisito Obligatorio:** Se deben añadir pruebas unitarias o de integración para **cada nueva funcionalidad** que se implemente.
* Esto incluye componentes de interfaz clave, lógica de estado, validación de formularios y utilidades de cálculo de tensión arterial.
* El framework de pruebas a utilizar debe estar integrado con Next.js (por ejemplo, Jest o Vitest junto con React Testing Library).

### 2. Consistencia de Diseño (DESIGN.md)
* **Requisito Obligatorio:** Antes de realizar cualquier implementación de UI/diseño o modificar componentes visuales, se **debe leer y seguir estrictamente el archivo `DESIGN.md`**.
* La paleta de colores (rosa suave `#FF8AA5`, fondo `#FFF7FA`, etc.), tipografías, radios de esquina (`rounded`) y espaciados deben ser seguidos fielmente para mantener la armonía, calidez y tranquilidad de la aplicación.

---

## Estructura y Flujo de la Aplicación (Plan General)

### Funcionalidades Core
1. **Calendario Mensual/Semanal:**
   - Visualización de los días del mes.
   - Indicador visual rápido en cada día (por ejemplo, si se registró la tensión, si se tomó la pastilla, o alertas de tensión fuera de rango).
2. **Formulario de Registro Diario:**
   - Entrada de presión sistólica y diastólica.
   - Entrada de pulso.
   - Interruptor (toggle) o checkbox para marcar "Pastilla tomada".
   - Campo de notas/síntomas.
3. **Panel de Estadísticas y Alertas:**
   - Resumen de lecturas recientes.
   - Indicadores visuales claros utilizando colores de seguridad y éxito (como el verde `#5BC8A8` para niveles correctos y rosa/rojo primario para alertas de tensión alta).
4. **Artículos y Consejos (Opcional/Sección Informativa):**
   - Acceso rápido a tips saludables de embarazo de acuerdo a las pautas de `DESIGN.md`.

---

## Tecnologías Utilizadas

- **Framework:** Next.js (App Router, TypeScript)
- **Estilos:** Tailwind CSS (basado en el archivo `DESIGN.md`)
- **Gestión de Estado:** React Context / Hooks
- **Testing:** Jest / Vitest + React Testing Library (por configurar)
