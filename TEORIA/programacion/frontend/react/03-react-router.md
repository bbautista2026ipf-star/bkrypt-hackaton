---
doc_id: react-router-navegacion
institucion: Instituto Politécnico Formosa
curso: "React: Hooks y Rutas"
modulo_origen: "Módulo 6"
tema: "Navegación con React Router"
fuentes_origen:
  - "Introducción y conceptos generales de React.pdf"
fecha_actualizacion_contenido: "React Router 8 (paquete único react-router, sin react-router-dom)"
relacion_con_otros_docs: >
  Utiliza componentes definidos como en 02-componentes-props-listas.md y suele combinarse con
  useState/useEffect (04-hooks-usestate-useeffect.md) dentro de los componentes de página.
nivel: intermedio
---

# React — Navegación con React Router

## Índice

1. [¿Qué es React Router?](#1-qué-es-react-router)
2. [Instalación](#2-instalación)
3. [Componentes principales](#3-componentes-principales)
4. [Ejemplo de configuración de rutas](#4-ejemplo-de-configuración-de-rutas)
5. [Formas de trabajar con React Router 8](#5-formas-de-trabajar-con-react-router-8)

---

## 1. ¿Qué es React Router?

**React Router** es la librería estándar para agregar rutas a una aplicación React. Las rutas permiten definir distintas páginas y mostrar la correcta según la URL a la que navega el usuario.

> **Actualizado — cambio de paquete:** a partir de la versión 7, y consolidado en la versión 8 (actual), el paquete `react-router-dom` fue eliminado. Ahora todo se instala e importa desde el paquete único **`react-router`**.

## 2. Instalación

```bash
npm install react-router
```

## 3. Componentes principales

| Componente      | Función                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------- |
| `BrowserRouter` | Envuelve la aplicación y habilita el enrutamiento basado en la API de History del navegador. |
| `Routes`        | Agrupa y define el conjunto de rutas de la aplicación.                                       |
| `Route`         | Define una ruta puntual, con un `path` (la URL) y un `element` (el componente a renderizar). |
| `Link`          | Crea enlaces de navegación entre rutas sin recargar la página.                               |

## 4. Ejemplo de configuración de rutas

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

`BrowserRouter` envuelve toda la aplicación y establece el contexto de enrutamiento. Los elementos `Link` arman la navegación, y dentro de `Routes` cada `Route` indica qué componente se muestra según el `path` activo: `HomePage` en la raíz (`/`) y `AboutPage` en `/about`.

## 5. Formas de trabajar con React Router 8

React Router 8 ofrece tres formas de trabajar:

1. **Modo declarativo** (el usado en el ejemplo de la sección 4): ideal para empezar.
2. **Modo de datos** (con `createBrowserRouter`): agrega `loader`/`action` por ruta.
3. **Modo framework** (`npx create-react-router@latest`): ruteo por archivos, similar a Remix/Next.js.

---

**Documento anterior:** `02-componentes-props-listas.md` · **Siguiente:** `04-hooks-usestate-useeffect.md` (Módulos 7-9: fundamentos de Hooks, useState y useEffect).
