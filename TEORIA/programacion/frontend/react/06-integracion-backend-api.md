---
doc_id: react-integracion-backend-api
institucion: Instituto Politécnico Formosa
curso: "React: Hooks y Rutas"
modulo_origen: "Módulo 12"
tema: "Integración con un backend y consumo de una API"
fuentes_origen:
  - "Introducción y conceptos generales de React.pdf"
relacion_con_otros_docs: >
  Combina useState/useEffect (04-hooks-usestate-useeffect.md) con las técnicas de fetch/async-await
  descritas en docs-ia/javascript/01-javascript-fundamentos-y-asincronia.md (secciones 7 y 8).
  Es el último documento de la serie de React de este curso.
nivel: intermedio-avanzado
---

# React — Integración con un Backend y Consumo de una API

## Índice

1. [Qué hay que resolver](#1-qué-hay-que-resolver)
2. [Ejemplo completo: lista de usuarios con estados de carga y error](#2-ejemplo-completo-lista-de-usuarios-con-estados-de-carga-y-error)
3. [Nota sobre librerías especializadas](#3-nota-sobre-librerías-especializadas)

---

## 1. Qué hay que resolver

Para integrar React con un backend generalmente hay que resolver:

1. Configurar la comunicación HTTP (`GET`/`POST`/`PUT`/`DELETE`).
2. Definir los _endpoints_ de la API.
3. Conectar con `fetch` o `axios` (normalmente dentro de un `useEffect`).
4. Procesar la respuesta actualizando el estado del componente.

## 2. Ejemplo completo: lista de usuarios con estados de carga y error

```jsx
import { useEffect, useState } from "react";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        if (!response.ok)
          throw new Error("No se pudo obtener la lista de usuarios");
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UsersList;
```

### 2.1 Explicación

Se declaran **tres estados**: `users`, `loading` y `error`. El bloque `try/catch/finally` maneja errores de red o del servidor y garantiza que `loading` se apague al terminar (tanto en el caso de éxito como en el de error), evitando que la interfaz quede "cargando" indefinidamente.

| Estado    | Rol                                              |
| --------- | ------------------------------------------------ |
| `users`   | Almacena los datos obtenidos del backend.        |
| `loading` | Controla si se muestra un indicador de carga.    |
| `error`   | Almacena el mensaje de error, si ocurrió alguno. |

## 3. Nota sobre librerías especializadas

> **Nota:** en proyectos reales es muy común delegar esta lógica (caché, reintentos, invalidación de datos) a una librería especializada como **TanStack Query** o **SWR**, en lugar de reimplementar manualmente los estados `loading`/`error` en cada componente.

---

**Documento anterior:** `05-custom-hooks-y-context.md` · Fin de la serie React (Módulos 1 a 12 cubiertos en 6 documentos).
