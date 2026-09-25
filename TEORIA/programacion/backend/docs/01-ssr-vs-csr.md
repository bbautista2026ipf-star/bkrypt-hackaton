---
doc_id: ssr-vs-csr
institucion: Instituto Politécnico Formosa
carrera: Tecnicatura en Desarrollo de Software Multiplataforma
materia: Taller de Lenguaje de Programación I
unidad: "Unidad 4 — Programación del Lado del Servidor y Persistencia de Datos"
tema: "Server-Side Rendering (SSR) vs. Client-Side Rendering (CSR)"
fuentes_origen:
  - "Contenido de cátedra Unidad 4 (Introducción a SSR y CSR) — Instituto Politécnico Formosa"
relacion_con_otros_docs: >
  Complementa docs-ia/backend/00-nodejs-introduccion.md (el servidor Node/Express es quien puede
  hacer SSR) y se relaciona con docs-ia/react (CSR es el modelo por defecto de una SPA en React;
  frameworks como Next.js —no cubierto aquí— agregan SSR sobre React).
nivel: introductorio
---

# Server-Side Rendering (SSR) vs. Client-Side Rendering (CSR)

## Índice

1. [Objetivos](#1-objetivos)
2. [¿Qué es Server-Side Rendering (SSR)?](#2-qué-es-server-side-rendering-ssr)
3. [¿Qué es Client-Side Rendering (CSR)?](#3-qué-es-client-side-rendering-csr)
4. [Comparativa directa](#4-comparativa-directa)
5. [¿Cuándo elegir cada uno?](#5-cuándo-elegir-cada-uno)
6. [Ventajas y desventajas](#6-ventajas-y-desventajas)

---

## 1. Objetivos

- Conocer cuáles son y cómo funcionan las principales tecnologías y estrategias de presentación de información web actualmente.
- Conocer las diferencias, debilidades y fortalezas de dichas estrategias.
- Saber cómo se aplican estas estrategias en el mundo real.

## 2. ¿Qué es Server-Side Rendering (SSR)?

**SSR** es una técnica de renderizado que implica generar la estructura HTML de una página **en el servidor** antes de enviarla al navegador del usuario. El servidor procesa la solicitud, realiza las operaciones necesarias para generar el contenido y envía el HTML resultante ya listo al navegador.

### 2.1 Contexto de origen

SSR surge como solución en el desarrollo de aplicaciones web modernas que usan JavaScript y frameworks como React, Vue o Angular. Estas aplicaciones se cargan en el navegador del usuario, lo que puede hacer que el inicio sea lento, sobre todo en conexiones lentas o dispositivos poco potentes. Con SSR, la página se genera en el servidor y se envía ya lista, acelerando la carga inicial y mejorando la experiencia del usuario.

## 3. ¿Qué es Client-Side Rendering (CSR)?

**CSR** es una técnica donde el **navegador del usuario** se encarga de generar y mostrar la página usando JavaScript. El servidor solo envía una estructura HTML básica, y luego el navegador completa la página cargando y ejecutando el código JavaScript.

### 3.1 Contexto de origen

CSR aparece en el desarrollo de apps web modernas que usan frameworks como React, Vue o Angular, donde el navegador ejecuta el código JavaScript para generar la página. La ventaja principal es que permite crear apps muy dinámicas y rápidas sin recargar toda la página; la desventaja es que la carga inicial puede ser lenta, porque el navegador necesita descargar y ejecutar todo el código antes de mostrar el contenido.

## 4. Comparativa directa

| Aspecto                     | SSR                                                                                                                    | CSR                                                                                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Dónde se renderiza**      | En el servidor: se genera la estructura HTML completa antes de enviarla al navegador.                                  | En el navegador: JavaScript genera y actualiza la página según las interacciones del usuario; el servidor solo envía archivos básicos (HTML, CSS, JS). |
| **SEO**                     | El contenido es accesible para los motores de búsqueda porque se renderiza completamente antes de llegar al navegador. | Puede ser más difícil de indexar, ya que el contenido generado por JavaScript dificulta el rastreo.                                                    |
| **Tiempo de carga inicial** | Generalmente más rápido: el navegador recibe una página ya renderizada.                                                | Puede ser más lento: el navegador debe descargar y ejecutar el JavaScript antes de mostrar la página.                                                  |
| **Interactividad**          | Puede ser más limitada: la mayoría de las interacciones requieren una nueva solicitud al servidor.                     | Mejor interactividad y fluidez: el contenido se actualiza sin recargar la página completa.                                                             |

## 5. ¿Cuándo elegir cada uno?

### 5.1 Cuándo elegir SSR

- Cuando la aplicación tiene contenido estático o semi-estático (un sitio de noticias, un catálogo de productos).
- Cuando se busca una mejor optimización para motores de búsqueda (SEO), ya que estos tienen dificultades para rastrear contenido generado por JavaScript.
- Cuando se desea una carga rápida en el primer renderizado de la página.

### 5.2 Cuándo elegir CSR

- Cuando la aplicación es altamente interactiva y requiere muchas actualizaciones en tiempo real.
- Cuando hay una gran cantidad de contenido dinámico que depende de la interacción del usuario.
- Cuando no hay muchos requerimientos de SEO y la carga inicial no es crítica.

## 6. Ventajas y desventajas

### 6.1 SSR

| Ventajas                                                                                                                      | Desventajas                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Mejor SEO: el contenido se renderiza completamente en el servidor, facilitando su indexación.                                 | Menor interactividad: las actualizaciones requieren solicitudes al servidor.                                                    |
| Mejor tiempo de carga inicial: el navegador recibe la página ya renderizada.                                                  | Mayor carga en el servidor: debe procesar el renderizado en cada solicitud, con tiempos de respuesta potencialmente más lentos. |
| Mejor accesibilidad: el contenido es accesible incluso para usuarios/dispositivos sin soporte de JavaScript.                  | Menor flexibilidad: el renderizado en servidor limita la personalización según dispositivo o perfil de usuario.                 |
| Mayor seguridad: el código del cliente se ejecuta en un ambiente más controlado, reduciendo la exposición a vulnerabilidades. |                                                                                                                                 |

### 6.2 CSR

| Ventajas                                                                                                                | Desventajas                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Mayor interactividad: el contenido se actualiza dinámicamente sin recargar la página completa.                          | Peor SEO: el contenido puede ser más difícil de indexar por el uso de JavaScript.                                     |
| Menor carga en el servidor: solo se envía un conjunto mínimo de archivos.                                               | Peor tiempo de carga inicial: hay que descargar y ejecutar el JavaScript antes de mostrar la página.                  |
| Mayor flexibilidad: el renderizado en el navegador permite mayor personalización según dispositivo o perfil de usuario. | Menor accesibilidad para usuarios/dispositivos sin soporte de JavaScript.                                             |
|                                                                                                                         | Mayor exposición a vulnerabilidades de seguridad, ya que el código JavaScript se ejecuta en el navegador del usuario. |

---

**Relación con otros documentos:** una aplicación React construida como se describe en `docs-ia/react/` es, por defecto, **CSR** (el `index.html` es una estructura básica y `main.jsx` monta todo con JavaScript en el navegador). Un servidor Express como el de `docs-ia/backend/00-nodejs-introduccion.md` puede implementar SSR generando HTML dinámicamente antes de enviarlo.
