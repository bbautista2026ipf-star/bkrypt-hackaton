---
doc_id: react-componentes-props-listas
institucion: Instituto Politécnico Formosa
curso: "React: Hooks y Rutas"
modulo_origen: "Módulos 4 y 5"
tema: "Componentes funcionales, props y renderizado de listas"
fuentes_origen:
  - "Introducción y conceptos generales de React.pdf"
relacion_con_otros_docs: >
  Continúa 01-introduccion-y-entorno-vite.md. Requiere fundamentos de funciones flecha y
  desestructuración de docs-ia/javascript/01-javascript-fundamentos-y-asincronia.md.
  Precede a 04-hooks-usestate-useeffect.md (los componentes aquí definidos se combinan con Hooks).
nivel: introductorio
---

# React — Componentes, Props y Renderizado de Listas

## Índice

1. [¿Qué son los componentes?](#1-qué-son-los-componentes)
2. [Props: propiedades de los componentes](#2-props-propiedades-de-los-componentes)
3. [Renderizado de listas](#3-renderizado-de-listas)

---

## 1. ¿Qué son los componentes?

Un **componente funcional** es una pieza reutilizable de la interfaz de usuario: puede ser algo pequeño, como un botón, o algo más grande, como un formulario completo. Es una **función de JavaScript que devuelve JSX**.

> **Actualizado:** ya no hace falta escribir `import React from 'react'` en cada archivo para poder usar JSX. Desde el nuevo transformador de JSX ("_automatic runtime_"), que Vite usa por defecto, solo se importa lo que realmente se necesita, por ejemplo `import { useState } from 'react'`.

### 1.1 Componente funcional (function)

```jsx
function Saludo() {
  return <h1>¡Hola, mundo!</h1>;
}

export default Saludo;
```

### 1.2 Componente funcional (arrow function) — más conciso

```jsx
const Saludo = () => {
  return <h1>¡Hola, mundo!</h1>;
};

export default Saludo;
```

## 2. Props: propiedades de los componentes

Las **props** son la forma en que los componentes reciben datos de un componente padre. Se definen como atributos al usar el componente y se acceden como argumento de la función.

```jsx
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

function App() {
  return <Button label="Saludar" onClick={() => alert("Hola")} />;
}

export default App;
```

`Button` recibe sus props ya desestructuradas (`label`, `onClick`) directamente en los parámetros de la función — la forma recomendada hoy, en lugar de recibir un único objeto `props`. Al hacer clic en el botón se ejecuta la función que `App` pasó como prop `onClick`, que muestra una alerta con el mensaje "Hola".

## 3. Renderizado de listas

React permite renderizar listas de datos usando el método **`map()`** de JavaScript para recorrer un array y generar un componente por cada ítem.

```jsx
function App() {
  const numbers = [1, 2, 3, 4, 5];

  return (
    <ul>
      {numbers.map((number) => (
        <li key={number}>{number}</li>
      ))}
    </ul>
  );
}

export default App;
```

`numbers` es un array con los números del 1 al 5. Se renderiza una lista no ordenada (`<ul>`) y, dentro de ella, `map()` genera un elemento `<li>` por cada número.

> **Nota — el atributo `key`:** ayuda a React a identificar de forma única cada elemento de la lista durante el renderizado eficiente (reconciliación). Si no se proporciona una `key`, React muestra una advertencia en la consola. Cuando el orden de la lista puede cambiar, se recomienda usar un identificador estable (como un `id`) y **evitar el índice del array como key**.

---

**Documento anterior:** `01-introduccion-y-entorno-vite.md` · **Siguiente:** `03-react-router.md` (Módulo 6: navegación con React Router).
