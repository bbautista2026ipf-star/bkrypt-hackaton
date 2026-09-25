---
doc_id: react-introduccion-y-entorno
institucion: Instituto Politécnico Formosa
curso: "React: Hooks y Rutas"
modulo_origen: "Módulos 1, 2 y 3"
tema: "Introducción a React, entorno de desarrollo con Vite y estructura de proyecto"
fuentes_origen:
  - "Introducción y conceptos generales de React.pdf"
fecha_actualizacion_contenido: "febrero 2026 (React 19.2 / React Foundation)"
relacion_con_otros_docs: >
  Requiere conocimientos previos de docs-ia/javascript (funciones, arrow functions, módulos import/export,
  desestructuración) y de docs-ia/html (estructura de documentos, <script>). Precede a
  02-componentes-props-listas.md dentro de esta misma serie de React.
nivel: introductorio
---

# React — Introducción, Entorno de Desarrollo (Vite) y Estructura de Proyecto

## Índice

1. [¿Qué es React?](#1-qué-es-react)
2. [Entorno de desarrollo con Vite](#2-entorno-de-desarrollo-con-vite)
3. [React vs. React Compiler](#3-react-vs-react-compiler)
4. [Hot Module Replacement (HMR)](#4-hot-module-replacement-hmr)
5. [Estructura de un proyecto React](#5-estructura-de-un-proyecto-react)

---

## 1. ¿Qué es React?

**React** es una biblioteca de JavaScript de código abierto, creada originalmente por **Meta (Facebook)** en **2013**, utilizada para construir interfaces de usuario (UI) interactivas y eficientes. A diferencia de un framework completo como Angular, React se enfoca en la **capa de vista** de una aplicación: es responsable de cómo se ve y se comporta la interfaz.

> **Actualizado (febrero 2026):** React es gobernado por la **React Foundation**, alojada bajo la Linux Foundation, aunque Meta sigue siendo uno de sus principales contribuyentes. La versión estable actual es **React 19.2**.

### 1.1 Principales características

| Característica             | Descripción                                                                                                                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Componentización**       | La aplicación se construye a partir de componentes: bloques reutilizables que representan partes de la UI, desde un botón hasta una página completa.                                                  |
| **Virtual DOM**            | React mantiene una representación virtual del DOM en memoria; al cambiar los datos, compara la versión anterior con la nueva y actualiza solo las partes modificadas, mejorando el rendimiento.       |
| **Reactividad**            | Los componentes se actualizan automáticamente cuando cambian sus datos, a través de **props** (datos que fluyen de un componente padre a un hijo) y **state** (datos internos del propio componente). |
| **JSX** (_JavaScript XML_) | Extensión de JavaScript que permite escribir una sintaxis parecida a HTML dentro del código JavaScript. Se compila a JavaScript puro antes de ejecutarse en el navegador.                             |

### 1.2 Ventajas de React

- **Reutilización de componentes**: se crean una vez y se usan en múltiples lugares de la aplicación.
- **Eficiencia mediante el Virtual DOM**: solo se actualizan las partes de la interfaz que cambiaron.
- **Comunidad y ecosistema**: una de las comunidades más grandes del desarrollo web, con gran cantidad de librerías y herramientas.
- **Interfaces modernas y dinámicas**, ideales para aplicaciones actuales.
- **Aplicaciones de una sola página (SPA)**: la navegación ocurre sin recargar la página completa, dando una experiencia más fluida.

## 2. Entorno de desarrollo con Vite

### 2.1 ¿Qué es Vite?

**Vite** es una herramienta de construcción y desarrollo de aplicaciones web, creada por **Evan You** (autor de Vue.js). Su nombre proviene del francés y significa "rápido". Se volvió muy popular por ofrecer un entorno de desarrollo veloz y productivo, especialmente para proyectos con React.

### 2.2 Características clave

| Característica                   | Descripción                                                                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desarrollo rápido                | Los cambios en el código se reflejan de inmediato en el navegador, sin recargar la página completa.                                                      |
| Basado en ES Modules             | Cada archivo JavaScript se trata como un módulo independiente, facilitando la gestión de dependencias.                                                   |
| Build de producción con Rolldown | La versión actual de Vite (8.x) usa un _bundler_ de producción basado en Rust, acelerando significativamente los builds respecto a versiones anteriores. |

### 2.3 Instalación de un proyecto React con Vite

```bash
npm create vite@latest
```

El asistente interactivo pregunta, en este orden:

1. **Project name**: el nombre de la carpeta/proyecto.
2. **Framework**: elegir **React** o **React Compiler** (ver sección 3).
3. **Variant**: **JavaScript** o **TypeScript**.
4. **Linter** (paso nuevo): **Oxlint** (por defecto, escrito en Rust, más rápido) o **ESLint** (el clásico).

Luego de la instalación:

```bash
cd nombre-del-proyecto
npm install
npm run dev
```

- `npm install` descarga todas las dependencias del proyecto.
- `npm run dev` inicia el servidor de desarrollo de Vite, que entrega una URL local para abrir la aplicación en el navegador.

## 3. React vs. React Compiler: qué framework elegir

> **Actualizado:** en versiones anteriores de Vite, "React Compiler" aparecía como una variante experimental dentro de la opción JavaScript. Hoy el React Compiler ya está estable (versión 1.0) y aparece como un framework propio en el asistente.

| Opción              | Características                                                                                                                                                                                                                                                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React (clásico)** | Usa `@vitejs/plugin-react`, basado en Babel, para transformar JSX. Es la configuración estándar, liviana y más que suficiente para proyectos chicos o medianos.                                                                                                                                                                                |
| **React Compiler**  | Incluye el React Compiler, que optimiza automáticamente el código en tiempo de build. Elimina, en la mayoría de los casos, la necesidad de usar manualmente `useMemo`, `useCallback` y `React.memo` para evitar renders innecesarios. Recomendado para proyectos nuevos que buscan aprovechar las optimizaciones automáticas desde el día uno. |

## 4. Hot Module Replacement (HMR)

El **HMR** es una característica clave de Vite que permite actualizar módulos de la aplicación mientras esta se ejecuta, sin recargar toda la página.

### 4.1 ¿Cómo funciona?

1. Vite detecta el cambio en un archivo automáticamente.
2. Solo actualiza el módulo modificado en el navegador.
3. Se preserva el estado de la aplicación (no se pierden los datos en memoria).
4. Los cambios se reflejan casi instantáneamente.

### 4.2 Beneficios

- **Desarrollo más rápido**: no hay que esperar a que se recargue toda la aplicación.
- **Preservación del estado**: se mantiene el estado actual (formularios completos, navegación, etc.).
- **Feedback inmediato**: los cambios se ven en milisegundos.
- **Mejor experiencia de desarrollo** en general.

## 5. Estructura de un proyecto React

Un proyecto de React creado con Vite consta principalmente de dos carpetas y un archivo `index.html`:

| Elemento     | Contenido                                                                       |
| ------------ | ------------------------------------------------------------------------------- |
| `src/`       | Todo el código de la aplicación (componentes, estilos, configuración).          |
| `public/`    | Archivos estáticos (por ejemplo imágenes) que no pasan por el proceso de build. |
| `index.html` | El archivo que carga el JavaScript de la aplicación.                            |

Dentro de `src/`, es habitual organizar el código así:

| Carpeta/archivo     | Contenido                                                      |
| ------------------- | -------------------------------------------------------------- |
| `components/`       | Componentes reutilizables de la aplicación.                    |
| `hooks/`            | Custom hooks creados para el proyecto.                         |
| `lib/` (o `utils/`) | Funciones o librerías propias compartidas entre componentes.   |
| `pages/`            | Páginas/vistas de la aplicación (útil junto con React Router). |
| `styles/`           | Estilos de la aplicación.                                      |
| `main.jsx`          | Punto de entrada de la aplicación.                             |
| `App.jsx`           | Componente raíz, encargado de renderizar la estructura básica. |

### 5.1 Ejemplo de estructura básica

```
mi-proyecto/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── vite.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    ├── hooks/
    ├── lib/
    ├── pages/
    └── styles/
```

### 5.2 `src/main.jsx`

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`createRoot` (de `react-dom/client`) es la forma vigente desde React 18 de montar la aplicación; `StrictMode` ayuda a detectar problemas potenciales durante el desarrollo.

---

**Siguiente documento de la serie:** `02-componentes-props-listas.md` (Módulos 4-5: componentes, props y renderizado de listas).
