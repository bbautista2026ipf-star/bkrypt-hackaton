---
doc_id: react-hooks-usestate-useeffect
institucion: Instituto Politécnico Formosa
curso: "React: Hooks y Rutas"
modulo_origen: "Módulos 7, 8 y 9"
tema: "Fundamentos de Hooks, useState (estado local) y useEffect (efectos secundarios)"
fuentes_origen:
  - "Introducción y conceptos generales de React.pdf"
fecha_actualizacion_contenido: "Hooks introducidos en React 16.8 (2019); notas sobre React Compiler"
relacion_con_otros_docs: >
  Se apoya en la asincronía (fetch, async/await) descrita en
  docs-ia/javascript/01-javascript-fundamentos-y-asincronia.md (sección 7 y 8). Precede a
  05-custom-hooks-y-context.md, que reutiliza estos mismos hooks dentro de hooks personalizados.
nivel: intermedio
---

# React — Hooks: useState y useEffect

## Índice

1. [¿Qué son los Hooks?](#1-qué-son-los-hooks)
2. [¿Qué son las dependencias?](#2-qué-son-las-dependencias)
3. [useState: gestión de estado local](#3-usestate-gestión-de-estado-local)
4. [useEffect: efectos secundarios](#4-useeffect-efectos-secundarios)
5. [Fases del ciclo de vida (equivalencia con componentes de clase)](#5-fases-del-ciclo-de-vida-equivalencia-con-componentes-de-clase)

---

## 1. ¿Qué son los Hooks?

Los **Hooks** son una característica introducida en **React 16.8 (2019)** que permite a los componentes funcionales manejar **estado**, **efectos secundarios** y otras características que antes solo eran posibles con componentes de clase. Hoy, prácticamente todo el código React nuevo se escribe con componentes funcionales y Hooks.

## 2. ¿Qué son las dependencias?

Las **dependencias** son valores que determinan si un Hook debe volver a ejecutarse. Cuando una dependencia cambia, el Hook se vuelve a ejecutar.

| Hook                      | Dependencias                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `useState`                | Utiliza el estado actual como dependencia implícita.                                             |
| `useEffect`               | Recibe un array de dependencias explícito como segundo argumento.                                |
| `useMemo` / `useCallback` | También reciben un array de dependencias explícito.                                              |
| `useRef`                  | No depende de ningún valor para "reejecutarse": su referencia se mantiene estable entre renders. |
| Custom hooks              | Pueden combinar cualquiera de los hooks anteriores.                                              |

> **Actualizado:** con el **React Compiler** (ya estable — ver documento `01-introduccion-y-entorno-vite.md`, sección 3), gran parte del trabajo manual de declarar dependencias para `useMemo` y `useCallback` deja de ser necesario: el compilador memoiza automáticamente en la mayoría de los casos. De todas formas, entender cómo funcionan las dependencias sigue siendo clave para leer y depurar código React existente.

## 3. useState: gestión de estado local

`useState` es el Hook que permite a un componente funcional declarar y actualizar su propio estado interno.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
}

export default Counter;
```

`useState(0)` declara la variable de estado `count` con valor inicial `0` y la función `setCount` para actualizarla. Al hacer clic en el botón, `setCount` actualiza el estado y el contador aumenta en 1.

> **Buena práctica:** cuando el nuevo valor depende del anterior, es más seguro usar la forma funcional del setter: `setCount(c => c + 1)` en lugar de `setCount(count + 1)`. Esto evita bugs si React agrupa varias actualizaciones seguidas (_batching_).

## 4. useEffect: efectos secundarios

`useEffect` permite ejecutar **efectos secundarios** en un componente: acciones que ocurren después de que el componente se renderizó, como hacer una petición a un servidor, actualizar el DOM manualmente o configurar un evento.

```jsx
import { useEffect, useState } from "react";

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      const response = await fetch("https://api.github.com/users", {
        signal: controller.signal,
      });
      const data = await response.json();
      setUsers(data);
    }

    fetchUsers();

    return () => controller.abort();
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.login}</li>
      ))}
    </ul>
  );
}

export default UsersList;
```

Dentro de `useEffect`, una función `async` interna hace la petición a la API de GitHub con `fetch` y, al resolverse, actualiza el estado con `setUsers`. El array de dependencias vacío (`[]`) indica que el efecto se ejecuta una sola vez (al montar el componente). La función que se retorna es la **limpieza del efecto**: cancela la petición si el componente se desmonta antes de que termine.

> **Buena práctica:** usar `async`/`await` dentro de una función interna (nunca marcando el propio callback de `useEffect` como `async`) y un `AbortController` para cancelar peticiones pendientes es el patrón recomendado hoy.

## 5. Fases del ciclo de vida (equivalencia con componentes de clase)

Para quienes vienen de componentes de clase, esta tabla mapea las fases clásicas a su equivalente moderno con Hooks:

| Fase              | Método de clase (clásico) | Equivalente hoy                                 |
| ----------------- | ------------------------- | ----------------------------------------------- |
| **Montaje**       | `constructor`             | Los argumentos iniciales de `useState`.         |
|                   | `componentDidMount`       | Un `useEffect` con dependencias `[]`.           |
| **Actualización** | `shouldComponentUpdate`   | `React.memo`, o directamente el React Compiler. |
|                   | `componentDidUpdate`      | Un `useEffect` con dependencias específicas.    |
| **Desmontaje**    | `componentWillUnmount`    | La función de limpieza que retorna `useEffect`. |

---

**Documento anterior:** `03-react-router.md` · **Siguiente:** `05-custom-hooks-y-context.md` (Módulos 10-11: custom hooks y useContext).
