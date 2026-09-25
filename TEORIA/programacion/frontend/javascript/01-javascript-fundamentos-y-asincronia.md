---
doc_id: javascript-fundamentos-asincronia
institucion: Instituto Politécnico Formosa
carrera: Tecnicatura en Desarrollo de Software Multiplataforma
materia: Taller de Lenguaje de Programación I
unidad: "Unidades 2-3 — Desarrollo Web con JavaScript"
tema: "JavaScript: introducción, fundamentos, funciones, DOM, asincronía y consumo de APIs"
fuentes_origen:
  - "Material Teórico JavaScript 1.pdf (Componentes del lenguaje JavaScript)"
relacion_con_otros_docs: >
  El código descrito aquí se integra en documentos HTML mediante la etiqueta <script>
  (ver "01-html-estructura-y-web-semantica.md", sección 4). No depende de Bootstrap.
nivel: introductorio-intermedio
---

# JavaScript — Fundamentos, Funciones, DOM y Asincronía

## Índice

1. [Introducción a JavaScript](#1-introducción-a-javascript)
2. [Fundamentos del lenguaje](#2-fundamentos-del-lenguaje)
3. [Depuración (debugging)](#3-depuración-debugging)
4. [Funciones, objetos y arreglos](#4-funciones-objetos-y-arreglos)
5. [Modularización (import / export)](#5-modularización-import--export)
6. [Manipulación del DOM](#6-manipulación-del-dom)
7. [Asincronía: callbacks, promesas y async/await](#7-asincronía-callbacks-promesas-y-asyncawait)
8. [Consumo de APIs con fetch](#8-consumo-de-apis-con-fetch)

---

## 1. Introducción a JavaScript

### 1.1 Historia

JavaScript fue creado por **Brendan Eich** en **1995** mientras trabajaba en Netscape Communications Corporation, con el objetivo de crear un lenguaje que se ejecutara en el navegador para dar interactividad a las páginas web (hasta entonces mayormente estáticas). Nombres por los que pasó: **Mocha** → **LiveScript** (septiembre de 1995) → **JavaScript** (por estrategia de marketing, tras la adquisición de Netscape por Sun Microsystems, dueña del lenguaje Java).

En **febrero de 1996** fue adoptado por Microsoft en Internet Explorer, expandiendo rápidamente su uso. En **1997** su especificación fue estandarizada por Ecma International como **ECMA-262 (ECMAScript)**. Hitos posteriores: ES3 (1999), ES5 (2011), ES6/ES2015 (aprobado en diciembre de 2014, vigente desde junio de 2015, con mejoras significativas), y revisiones anuales posteriores (ES2022, etc.).

### 1.2 Usos principales

Originalmente pensado para el navegador (interactividad y dinamismo del lado del cliente), hoy también se usa en el servidor mediante **Node.js**, permitiendo un mismo lenguaje en cliente y servidor.

| Uso                            | Descripción                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------- |
| Validación de formularios      | Verificar que los datos ingresados sean válidos antes de enviarlos al servidor. |
| Efectos visuales y animaciones | Desplazamientos, transiciones, animaciones de carga.                            |
| Manipulación del DOM           | Agregar, eliminar o modificar elementos de la página.                           |
| Comunicación con el servidor   | Actualizar datos sin recargar la página (AJAX).                                 |

### 1.3 Integración en un documento HTML

**Opción 1 — etiqueta `<script>` inline** (dentro de `<head>` o `<body>`):

```html
<script>
  // código JavaScript
</script>
```

**Opción 2 — archivo externo `.js`**, referenciado con el atributo `src`:

```html
<script src="ruta/a/mi/archivo.js"></script>
```

### 1.4 Cómo interpreta el navegador el código JavaScript

1. **Análisis léxico**: el código se divide en _tokens_ (palabras clave, identificadores, números, etc.).
2. **Análisis sintáctico**: los tokens se combinan en un árbol de sintaxis abstracta (AST).
3. **Análisis semántico**: se valida el significado del código y se resuelven identificadores (variables, funciones) a sus valores.
4. **Ejecución**: el motor ejecuta el código en el contexto de la página, con acceso al DOM (asignación de variables, llamadas a funciones, manipulación del DOM, etc.).

Este proceso ocurre en tiempo real mientras la página se carga y se muestra al usuario.

## 2. Fundamentos del lenguaje

### 2.1 Tipos de datos

**Primitivos:**

| Tipo        | Descripción                                   |
| ----------- | --------------------------------------------- |
| `number`    | Números enteros o de punto flotante.          |
| `string`    | Cadenas de texto (comillas simples o dobles). |
| `boolean`   | `true` / `false`.                             |
| `null`      | Ausencia intencional de valor.                |
| `undefined` | Variable declarada pero sin valor asignado.   |
| `symbol`    | Identificador único e irrepetible.            |

**Complejos:**

| Tipo       | Descripción                                                                  |
| ---------- | ---------------------------------------------------------------------------- |
| `object`   | Colección de propiedades; también engloba arreglos. Se define con `{ }`.     |
| `function` | Bloque de código reutilizable que puede tomar argumentos y devolver valores. |

### 2.2 Variables

Una variable es un contenedor que almacena un valor utilizable o modificable durante la ejecución del programa. Se declaran con `var`, `let` o `const`.

| Palabra clave | Alcance                                                     | Reasignable                                    |
| ------------- | ----------------------------------------------------------- | ---------------------------------------------- |
| `var`         | Global o de función (desaconsejado por errores de alcance). | Sí                                             |
| `let`         | De bloque.                                                  | Sí                                             |
| `const`       | De bloque.                                                  | **No** (debe inicializarse en la declaración). |

```javascript
var nombre = "Juan";
let edad = 30;
const PI = 3.14159;
```

JavaScript tiene **tipado dinámico**: el tipo de una variable puede cambiar en tiempo de ejecución.

```javascript
let x = 10; // x es un número
x = "Hola"; // ahora x es una cadena de texto
```

### 2.3 Reglas y convenciones de nombres

**Reglas obligatorias:**

1. Deben comenzar con una letra, `_` o `$`.
2. Pueden contener letras, números, `_` y `$`.
3. Distinguen mayúsculas de minúsculas (`nombre` ≠ `Nombre`).

**Convenciones recomendadas:**

- Minúsculas con palabras separadas por guiones bajos, o camelCase.
- No usar palabras reservadas (`if`, `for`, `while`, `true`, `false`, etc.).
- Usar nombres descriptivos (`nombreCompleto` mejor que `n` o `nc`).
- Evitar nombres demasiado largos, confusos o engañosos.

### 2.4 Formas de inicializar variables

```javascript
// Declaración y asignación en dos pasos
let nombre;
nombre = "Juan";

// Declaración y asignación en un solo paso
let apellido = "Pérez";

// Declaración múltiple
let edad, direccion, telefono;
edad = 30;
direccion = "Calle 123";
telefono = "555-1234";

// Asignación múltiple
let nombre2 = "Ana",
  apellido2 = "González",
  edad2 = 25;
```

### 2.5 Ámbito (scope) de las variables

| Ámbito        | Descripción                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| **Global**    | Declarada fuera de cualquier función o bloque; accesible desde todo el programa.                             |
| **Local**     | Declarada dentro de una función; accesible solo dentro de ella.                                              |
| **De bloque** | Declarada con `let`/`const` dentro de un bloque (`if`, `for`, `while`); accesible solo dentro de ese bloque. |

```javascript
let nombre = "Juan"; // global
function saludar() {
  console.log("Hola " + nombre); // accede a la variable global
}
saludar(); // "Hola Juan"
```

```javascript
function saludar() {
  let nombre = "Juan"; // local
  console.log("Hola " + nombre);
}
saludar(); // "Hola Juan"
console.log(nombre); // Error: nombre is not defined
```

### 2.6 Estructuras de control de flujo

Existen tres tipos: **condicionales**, **de bucles** y **de saltos**.

**Condicionales**

```javascript
// if / else
if (edad >= 18) {
  console.log("Eres mayor de edad");
} else {
  console.log("Eres menor de edad");
}

// switch
switch (dia) {
  case 1:
    console.log("Lunes");
    break;
  case 2:
    console.log("Martes");
    break;
  default:
    console.log("Día no válido");
}
```

**Bucles**

```javascript
// for — repite un número determinado de veces
for (let i = 0; i < 10; i++) {
  console.log(i);
}

// while — repite mientras se cumpla una condición
let i = 0;
while (i < 10) {
  console.log(i);
  i++;
}

// do/while — se ejecuta al menos una vez antes de evaluar la condición
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 10);
```

**Saltos**

```javascript
// break — sale del bucle
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i);
}

// continue — salta a la siguiente iteración
for (let i = 0; i < 10; i++) {
  if (i === 5) continue;
  console.log(i); // omite el 5
}

// return — sale de una función
```

### 2.7 Operador ternario

Forma abreviada de un `if...else` en una sola línea:

```
condición ? expresión_verdadera : expresión_falsa
```

```javascript
let edad = 18;
let mensaje = edad >= 18 ? "Eres mayor de edad" : "Eres menor de edad";
```

### 2.8 Interpolación de strings (template literals)

Permite insertar variables y expresiones dentro de una cadena usando comillas invertidas (`` ` ``) y `${ }`, evitando la concatenación con `+`:

```javascript
let nombre = "Juan";
let edad = 25;
console.log(`Hola, mi nombre es ${nombre} y tengo ${edad} años`);
// → "Hola, mi nombre es Juan y tengo 25 años"

let precio = 100;
let descuento = 0.1;
console.log(`El precio final es ${precio - precio * descuento} dólares`);
// → "El precio final es 90 dólares"
```

### 2.9 Uso de la consola

La consola permite interactuar con el código y depurar errores en tiempo real:

1. **Depurar errores**: ver errores producidos y encontrar su origen.
2. **Probar código en tiempo real**: ejecutar fragmentos y ver resultados de inmediato.
3. **Imprimir mensajes o valores**: `console.log("Hola, mundo!");`.

## 3. Depuración (debugging)

La **depuración** es el proceso de identificar y corregir errores en el código para garantizar su correcto funcionamiento.

Herramientas y técnicas comunes:

1. **Consola de desarrolladores**: integrada en los navegadores modernos; permite inspeccionar código y ejecutar comandos en tiempo real.
2. **Puntos de interrupción (breakpoints)**: detienen la ejecución en una línea específica para inspeccionar el estado del programa (variables, flujo de ejecución). Se colocan haciendo clic en el número de línea del panel de fuentes de la herramienta de depuración del navegador.
3. **Mensajes de depuración**: impresiones (`console.log`) que ayudan a rastrear errores y a entender el flujo de ejecución.

```javascript
let sum = 0;
for (let i = 1; i <= 10; i++) {
  sum += i;
  console.log("Valor actual de la suma: " + sum);
}
console.log("La suma de los primeros 10 números naturales es: " + sum);
```

## 4. Funciones, objetos y arreglos

### 4.1 Funciones y argumentos

Las **funciones** son bloques de código reutilizables que realizan una tarea específica; pueden tomar **argumentos** como entrada y devolver un valor como salida.

**Tipos de funciones:**

| Tipo             | Descripción                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| Declarativa      | `function nombre() {}`. Se puede invocar antes de ser declarada (hoisting).                     |
| Expresiva        | Se asigna a una variable: `const f = function() {}`. No puede invocarse antes de su definición. |
| Flecha (_arrow_) | Forma abreviada de una función expresiva: `const f = (a, b) => a + b;`.                         |

```javascript
function sumar(a, b) {
  return a + b;
} // declarativa
const sumar2 = function (a, b) {
  return a + b;
}; // expresiva
const sumar3 = (a, b) => a + b; // flecha
```

**Tipos de argumentos:**

| Tipo           | Descripción                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| Sin argumentos | La función no recibe ningún valor de entrada.                                                         |
| Obligatorios   | Deben pasarse para que la función funcione correctamente.                                             |
| Por defecto    | Tienen un valor predeterminado si no se proporciona uno explícito: `function sumar(a = 0, b = 0) {}`. |

### 4.2 Objetos

Estructuras de datos que almacenan información en **propiedades** (variables) y **métodos** (funciones), definidas con `{ }` como pares clave-valor:

```javascript
const persona = {
  nombre: "Juan",
  apellido: "Pérez",
  edad: 30,
  ciudad: "Buenos Aires",
  saludar: function () {
    console.log("Hola, soy " + persona.nombre + " " + persona.apellido);
  },
};

console.log(persona.nombre); // "Juan" (notación de punto)
persona.saludar(); // "Hola, soy Juan Pérez"
persona.telefono = "123456789"; // agregar propiedad dinámicamente
```

Se puede acceder también con notación de corchetes: `persona["nombre"]`.

### 4.3 Desestructuración de objetos

Extrae valores de un objeto y los asigna a variables individuales:

```javascript
const miObjeto = { nombre: "Juan", apellido: "Pérez", edad: 30 };
const { nombre, apellido, edad } = miObjeto;

// con valores predeterminados y alias
const { nombre: primerNombre, apellido: segundoNombre } = miObjeto;
```

### 4.4 Arreglos (arrays)

Estructuras que almacenan una colección de elementos, con índice numérico comenzando en 0:

```javascript
let numeros = [1, 2, 3, 4, 5];
console.log(numeros[0]); // 1
numeros[1] = 4; // modificar un elemento

for (let i = 0; i < numeros.length; i++) {
  console.log(numeros[i]);
}
```

**Métodos útiles:**

| Método        | Función                                                           |
| ------------- | ----------------------------------------------------------------- |
| `push(x)`     | Agrega un elemento al final.                                      |
| `pop()`       | Elimina el último elemento.                                       |
| `slice(a, b)` | Obtiene una porción del arreglo (no modifica el original).        |
| `sort()`      | Ordena los elementos (modifica el arreglo sobre el que se llama). |
| `length`      | Número de elementos del arreglo.                                  |

### 4.5 Desestructuración de arreglos

```javascript
let numeros = [1, 2, 3, 4, 5];
let [a, b, c, d, e] = numeros; // asignación posicional

let [a2, , c2, , e2] = numeros; // omitir elementos

const miArreglo = [1];
const [x, y = 2] = miArreglo; // y recibe el valor predeterminado 2
```

## 5. Modularización (import / export)

Permite dividir un programa en módulos más pequeños y manejables, mejorando mantenibilidad y reutilización, y reduciendo errores y conflictos.

- **`export`**: hace disponible una función, variable o clase para otros módulos.
- **`import`**: accede a lo exportado desde otro módulo.

```javascript
// math.js
export function sumar(num1, num2) {
  return num1 + num2;
}

// otro-archivo.js
import { sumar } from "./math.js";
```

## 6. Manipulación del DOM

El **DOM** (_Document Object Model_) es la representación en memoria de la estructura de una página web, que permite acceder y modificar sus elementos HTML, CSS y JavaScript en tiempo real. Es una técnica fundamental para crear páginas dinámicas y reactivas.

| Operación                        | Ejemplo                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Cambiar contenido de un elemento | `document.getElementById("miParrafo").innerHTML = "Nuevo texto";`                                    |
| Modificar estilos                | `document.getElementById("miDiv").style.backgroundColor = "red";`                                    |
| Crear y agregar elementos        | `const li = document.createElement("li"); li.textContent = "Nuevo elemento"; lista.appendChild(li);` |
| Eliminar elementos               | `lista.removeChild(lista.firstElementChild);`                                                        |
| Agregar eventos                  | `miBoton.addEventListener('click', () => { miBoton.textContent = '¡Clickea de nuevo!'; });`          |

```javascript
const miBoton = document.getElementById("miBoton");
miBoton.addEventListener("click", () => {
  miBoton.textContent = "¡Clickea de nuevo!";
});
```

> Un uso excesivo o incorrecto de la manipulación del DOM puede afectar negativamente el rendimiento y la accesibilidad de la página.

## 7. Asincronía: callbacks, promesas y async/await

### 7.1 Sincrónico vs. asincrónico

- **Sincrónico**: una tarea se completa antes de pasar a la siguiente ("bloqueo" o "espera").
- **Asincrónico**: una tarea se inicia pero no se completa de inmediato; el flujo del programa continúa mientras se espera su finalización.

Las tareas asíncronas se manejan mediante **callbacks**, **promesas**, **funciones async/await** y el **bucle de eventos**, permitiendo trabajar con operaciones que tardan (peticiones HTTP, acceso a bases de datos) sin bloquear el resto del código.

### 7.2 Callbacks

Un **callback** es una función que se pasa como argumento a otra función y se ejecuta después de que esta complete su tarea.

```javascript
function mostrarMensaje(mensaje, callback) {
  console.log(mensaje);
  callback();
}
function mostrarMensajeDeConfirmacion() {
  console.log("Mensaje mostrado");
}
mostrarMensaje("Este es un mensaje", mostrarMensajeDeConfirmacion);
```

Ejemplo con `setTimeout` (simula una tarea que tarda):

```javascript
console.log("Inicio");
setTimeout(function () {
  console.log("Después de 2 segundos");
}, 2000);
console.log("Fin");
// Salida: Inicio → Fin → Después de 2 segundos
```

Uso típico con solicitudes HTTP (librería Axios):

```javascript
const axios = require("axios");
axios
  .get("https://jsonplaceholder.typicode.com/todos/1")
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
```

**Problema — "callback hell":** cuando una tarea depende de otra, el código se anida excesivamente:

```javascript
obtenerUsuario(function (usuario) {
  obtenerCursos(usuario.id, function (cursos) {
    obtenerNotas(cursos[0], function (notas) {
      console.log(notas);
    });
  });
});
```

Problemas que genera: mucho anidamiento, dificultad de lectura, errores repartidos, código poco mantenible. Las **promesas** existen precisamente para ordenar este flujo.

### 7.3 Promesas

Una **promesa** (`Promise`) es un objeto que representa el resultado de una operación que puede completarse ahora, en el futuro o nunca. Tiene tres estados:

| Estado      | Significado            |
| ----------- | ---------------------- |
| `pending`   | Todavía no terminó.    |
| `fulfilled` | Terminó correctamente. |
| `rejected`  | Terminó con error.     |

**Crear una promesa** (`resolve` para éxito, `reject` para error):

```javascript
const promesa = new Promise(function (resolve, reject) {
  const exito = true;
  if (exito) {
    resolve("La operación salió bien");
  } else {
    reject("La operación falló");
  }
});
```

**Consumir una promesa** (`.then()` para éxito, `.catch()` para error):

```javascript
promesa
  .then(function (resultado) {
    console.log("Resultado:", resultado);
  })
  .catch(function (error) {
    console.log("Error:", error);
  });
```

**Ejemplo asincrónico completo:**

```javascript
function obtenerUsuario() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve({ id: 1, nombre: "Ana" });
    }, 2000);
  });
}
obtenerUsuario()
  .then(function (usuario) {
    console.log("Usuario:", usuario);
  })
  .catch(function (error) {
    console.log("Error:", error);
  });
```

**Encadenamiento de promesas** — cada `.then()` puede devolver una nueva promesa, evitando el anidamiento:

```javascript
obtenerUsuario()
  .then(function (usuario) {
    console.log("Usuario:", usuario);
    return obtenerCursos(usuario.id);
  })
  .then(function (cursos) {
    console.log("Cursos:", cursos);
    return obtenerNotas(cursos[0]);
  })
  .then(function (notas) {
    console.log("Notas:", notas);
  })
  .catch(function (error) {
    console.log("Error:", error);
  });
```

Ventajas del encadenamiento: menos anidamiento, flujo más legible, errores centralizados en un único `.catch()`, mejor mantenimiento.

**Manejo de errores con `reject`:**

```javascript
function descargarArchivo(nombreArchivo) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (!nombreArchivo) {
        reject("Debe indicar un nombre de archivo");
      } else {
        resolve("Archivo descargado: " + nombreArchivo);
      }
    }, 2000);
  });
}
descargarArchivo("")
  .then(function (mensaje) {
    console.log(mensaje);
  })
  .catch(function (error) {
    console.log("Error:", error);
  });
```

### 7.4 Async/Await

Sintaxis que permite trabajar con promesas de forma más clara, haciendo que el código asíncrono se parezca al código sincrónico.

- `async` se coloca antes de una función para indicar que es asíncrona (siempre devuelve una promesa).
- `await` se coloca antes de una promesa, dentro de una función `async`, para esperar su resolución antes de continuar.

```javascript
async function obtenerDatos() {
  try {
    const respuesta = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1",
    );
    const datos = await respuesta.json();
    console.log(datos);
  } catch (error) {
    console.log(error);
  }
}
obtenerDatos();
```

Con Axios:

```javascript
const axios = require("axios");
async function obtenerDatos() {
  try {
    const respuesta = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/1",
    );
    console.log(respuesta.data);
  } catch (error) {
    console.log(error);
  }
}
obtenerDatos();
```

**Ventajas:**

- Mejora la legibilidad frente a callbacks y promesas encadenadas.
- Simplifica el manejo de errores con `try/catch`.
- Flujo de control más natural (se lee como código síncrono).
- Compatible con las promesas.

**Desventajas:**

- Puede ser algo más lento (mayor uso de memoria/CPU) en algunos casos.
- No compatible con versiones antiguas de JavaScript.
- Puede resultar menos explícito que usar `.then()`/`.catch()` directamente.

### 7.5 Comparativa: callbacks vs. promesas

| Aspecto      | Callback                                 | Promesa                                               |
| ------------ | ---------------------------------------- | ----------------------------------------------------- |
| Idea central | Pasar una función para ejecutar después. | Recibir un objeto que representa un resultado futuro. |
| Éxito        | Se llama al callback.                    | `resolve()` + `.then()`.                              |
| Error        | Se maneja por convención.                | `reject()` + `.catch()`.                              |
| Legibilidad  | Puede complicarse con anidamientos.      | Permite encadenar de forma más clara.                 |

No se trata de elegir una técnica "para siempre", sino de entender cuándo conviene cada una.

## 8. Consumo de APIs con fetch

### 8.1 ¿Qué es una API?

Una **API** (_Application Programming Interface_) es un conjunto de reglas, protocolos y herramientas para que aplicaciones o servicios interactúen entre sí e intercambien información de manera programática.

### 8.2 API del navegador

Conjunto de funciones y métodos disponibles en navegadores modernos para interactuar con el entorno del navegador:

| API                         | Función                                         |
| --------------------------- | ----------------------------------------------- |
| API del DOM                 | Manipular y actualizar HTML/CSS en tiempo real. |
| API de eventos              | Manejar clics, pulsaciones de teclas, etc.      |
| API de almacenamiento local | Guardar datos en el navegador del usuario.      |
| API de geolocalización      | Acceder a la ubicación del usuario.             |
| API de cámara y micrófono   | Acceder a dispositivos multimedia del usuario.  |

### 8.3 Formato JSON

**JSON** (_JavaScript Object Notation_) es un formato de intercambio de datos ligero, similar a un objeto JavaScript, compuesto por pares clave-valor. Es el formato más común para intercambiar datos entre cliente y servidor.

### 8.4 Consumo con `fetch`

`fetch()` realiza peticiones HTTP asíncronas y devuelve una **promesa** que resuelve en un objeto `Response`.

```javascript
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

1. `fetch(url)` inicia la solicitud y devuelve una promesa.
2. `response.json()` convierte la respuesta en un objeto JSON (también devuelve una promesa).
3. `.then()` procesa los datos obtenidos; `.catch()` maneja errores de red o de la solicitud.

> El comportamiento exacto depende de la API consumida: tipo de datos que devuelve y parámetros requeridos por la solicitud.

---

**Relación con otros documentos:** el código de esta guía se inserta en un documento HTML mediante `<script>` (ver `01-html-estructura-y-web-semantica.md`, sección 4.3). No tiene dependencia directa con Bootstrap (`03-bootstrap-diseno-responsive.md`), que opera a nivel de CSS/HTML.
