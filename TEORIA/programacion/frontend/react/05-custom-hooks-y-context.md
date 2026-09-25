---
doc_id: react-custom-hooks-y-context
institucion: Instituto Politécnico Formosa
curso: "React: Hooks y Rutas"
modulo_origen: "Módulos 10 y 11"
tema: "Custom Hooks (reutilización de lógica) y useContext (estado global)"
fuentes_origen:
  - "Introducción y conceptos generales de React.pdf"
fecha_actualizacion_contenido: "Sintaxis de Provider simplificada desde React 19"
relacion_con_otros_docs: >
  Reutiliza useState (04-hooks-usestate-useeffect.md). Es prerrequisito conceptual para
  06-integracion-backend-api.md, donde useEffect y estado se combinan para consumir un backend real.
nivel: intermedio-avanzado
---

# React — Custom Hooks y useContext

## Índice

1. [Custom Hooks: reutilización de lógica](#1-custom-hooks-reutilización-de-lógica)
2. [useContext: estado global](#2-usecontext-estado-global)

---

## 1. Custom Hooks: reutilización de lógica

Los **custom hooks** permiten extraer y reutilizar lógica de estado y efectos entre distintos componentes. Por convención, su nombre siempre empieza con **`use`**.

### 1.1 `hooks/useCounter.js`

```javascript
import { useState } from "react";

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);

  return { count, increment, decrement };
}

export default useCounter;
```

### 1.2 `components/Counter.jsx`

```jsx
import useCounter from "../hooks/useCounter";

function Counter() {
  const { count, increment, decrement } = useCounter();

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

export default Counter;
```

`useCounter` gestiona un contador y expone `count`, `increment` y `decrement`. `Counter` los desestructura y los usa sin conocer los detalles de implementación — esa es la ventaja de los custom hooks: encapsular lógica reutilizable detrás de una interfaz simple.

## 2. useContext: estado global

### 2.1 ¿Qué es useContext?

`useContext` es el Hook que permite acceder a un contexto específico en la jerarquía de componentes, para compartir datos "globales" **sin pasar props manualmente nivel por nivel** (evitando el problema conocido como _"prop drilling"_).

### 2.2 `context/UserContext.jsx`

```jsx
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState({ id: 1, name: "John Doe" });

  return <UserContext value={{ user, setUser }}>{children}</UserContext>;
}

export function useGlobalContext() {
  return useContext(UserContext);
}
```

> **Actualizado — React 19:** desde React 19 se puede usar directamente `<UserContext value={...}>` como proveedor, sin escribir `<UserContext.Provider value={...}>`. La forma clásica con `.Provider` sigue funcionando (no está deprecada), pero la nueva sintaxis es más corta.

### 2.3 `App.jsx`

```jsx
import { UserProvider } from "./context/UserContext";
import MyComponent from "./components/MyComponent";

function App() {
  return (
    <UserProvider>
      <MyComponent />
    </UserProvider>
  );
}

export default App;
```

### 2.4 `components/MyComponent.jsx`

```jsx
import { useGlobalContext } from "../context/UserContext";

function MyComponent() {
  const { user, setUser } = useGlobalContext();

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => setUser({ id: 2, name: "Jane Doe" })}>
        Cambiar usuario
      </button>
    </div>
  );
}

export default MyComponent;
```

`App` envuelve a `MyComponent` con `UserProvider`, por lo que `MyComponent` tiene acceso a `user` y `setUser` sin recibirlos como props.

---

**Documento anterior:** `04-hooks-usestate-useeffect.md` · **Siguiente:** `06-integracion-backend-api.md` (Módulo 12: integración con un backend y consumo de una API).
