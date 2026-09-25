---
doc_id: nodejs-introduccion
institucion: Instituto Politécnico Formosa
carrera: Tecnicatura en Desarrollo de Software Multiplataforma
materia: Taller de Lenguaje de Programación I
unidad: "Unidad 4 — Programación del Lado del Servidor y Persistencia de Datos"
tema: "Introducción a Node.js: qué es, ventajas/desventajas, I/O bloqueante/no bloqueante, ciclo de eventos y módulos"
fuentes_origen:
  - "Contenido de cátedra Unidad 4 (Introducción a Node.js) — Instituto Politécnico Formosa"
enlaces_oficiales:
  - "https://nodejs.org/es"
  - "https://github.com/aguscenturion/material-unidad-4"
  - "https://github.com/aguscenturion/material-unidad-1-2do-cuatrimestre-2026"
relacion_con_otros_docs: >
  Es la base de toda la Unidad 4 (backend). Precede a
  docs-ia/backend/01-ssr-vs-csr.md, docs-ia/backend/02-persistencia-y-sequelize-intro.md,
  docs-ia/backend/04-express-validator.md y docs-ia/backend/05-autenticacion-jwt-sesiones-cookies.md.
  Requiere fundamentos de asincronía de docs-ia/javascript/01-javascript-fundamentos-y-asincronia.md
  (sección 7: callbacks, promesas, async/await).
nivel: introductorio
---

# Node.js — Introducción

## Índice

1. [Origen y propósito](#1-origen-y-propósito)
2. [¿Qué es Node.js?](#2-qué-es-nodejs)
3. [Aplicaciones reales construidas con Node.js](#3-aplicaciones-reales-construidas-con-nodejs)
4. [Ventajas y desventajas](#4-ventajas-y-desventajas)
5. [I/O bloqueante vs. no bloqueante](#5-io-bloqueante-vs-no-bloqueante)
6. [Asincronía: síncrono vs. asíncrono](#6-asincronía-síncrono-vs-asíncrono)
7. [Por qué importa el rendimiento web](#7-por-qué-importa-el-rendimiento-web)
8. [El ciclo de eventos (Event Loop)](#8-el-ciclo-de-eventos-event-loop)
9. [Ciclo de vida de un proceso en Node](#9-ciclo-de-vida-de-un-proceso-en-node)
10. [Módulos en Node.js](#10-módulos-en-nodejs)
11. [¿Qué es un servidor?](#11-qué-es-un-servidor)

---

## 1. Origen y propósito

**Node.js** fue creado en **2009 por Ryan Dahl** con el objetivo de construir aplicaciones web rápidas y escalables usando JavaScript en el servidor. Se basa en un modelo de entrada/salida **no bloqueante**, lo que lo hace más eficiente que los métodos tradicionales. Dahl buscó facilitar el uso de JavaScript tanto en el cliente como en el servidor, simplificando el desarrollo web. Hoy Node.js es ampliamente usado para crear aplicaciones modernas de alto rendimiento.

> Documentación y descargas oficiales: [nodejs.org/es](https://nodejs.org/es)

## 2. ¿Qué es Node.js?

Node.js es un **entorno de ejecución de JavaScript** que se basa en el motor **V8** de Google Chrome, el cual proporciona alto rendimiento y ejecución rápida de JavaScript fuera de un navegador web. En otras palabras, Node.js permite escribir aplicaciones del lado del servidor utilizando JavaScript.

Además, cuenta con una gran cantidad de módulos de terceros disponibles en su gestor de paquetes, **npm**, que permiten a los desarrolladores usar funcionalidades preconstruidas para desarrollar aplicaciones más rápido.

## 3. Aplicaciones reales construidas con Node.js

| Empresa      | Uso de Node.js                                                                               |
| ------------ | -------------------------------------------------------------------------------------------- |
| **LinkedIn** | Sistema de mensajería en tiempo real y sistema de notificaciones.                            |
| **Netflix**  | Gran parte de la infraestructura de back-end para el streaming de video.                     |
| **PayPal**   | Aplicaciones web escalables que manejan grandes volúmenes de transacciones de pago en línea. |
| **Uber**     | La app de conductor y los servicios de back-end que manejan solicitudes de viajes y pagos.   |

## 4. Ventajas y desventajas

### 4.1 Ventajas

| Ventaja                     | Descripción                                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| JavaScript en ambos lados   | Permite usar el mismo lenguaje en cliente y servidor, simplificando el desarrollo.                          |
| Modelo no bloqueante        | Modelo asincrónico basado en eventos, ideal para manejar muchas conexiones simultáneas con alta eficiencia. |
| Ecosistema de módulos (npm) | Miles de paquetes que agilizan el desarrollo de aplicaciones modernas.                                      |
| Multiplataforma             | Funciona en Windows, macOS y Linux sin modificar el código.                                                 |
| Gran rendimiento            | Opera con el motor V8 de Chrome, de alta velocidad de ejecución.                                            |

### 4.2 Desventajas

| Desventaja                                  | Descripción                                                                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No ideal para operaciones intensivas de E/S | Su modelo asincrónico no bloqueante no rinde tan bien en aplicaciones con muchas operaciones de lectura/escritura en disco (cálculo intensivo de CPU). |
| Riesgo con módulos de terceros              | Los paquetes de npm pueden ser de baja calidad o inseguros; es clave evaluar bien qué módulos usar.                                                    |
| Curva de aprendizaje                        | Puede ser difícil para quienes no están familiarizados con la programación asincrónica y el manejo de eventos.                                         |

## 5. I/O bloqueante vs. no bloqueante

### 5.1 Peticiones bloqueantes

Las peticiones bloqueantes (_I/O bloqueante_) detienen la ejecución del programa hasta que se completa la operación de entrada/salida. El hilo de ejecución que realiza la operación se detiene hasta que esta termina, lo que es problemático en aplicaciones que necesitan manejar múltiples solicitudes simultáneamente: una operación bloqueante puede detener todo el hilo de ejecución y hacer que la aplicación se congele.

### 5.2 Peticiones no bloqueantes

Las peticiones no bloqueantes (_I/O no bloqueante_) permiten que el programa continúe ejecutándose mientras se realiza la operación de entrada/salida. El hilo de ejecución no se detiene y puede seguir procesando otras tareas.

En Node.js, las operaciones de E/S no bloqueantes se realizan de forma **asincrónica**: se ejecutan en segundo plano sin detener el hilo principal. Node.js delega estas operaciones a un **thread pool** dedicado que las maneja en segundo plano; cuando una operación termina, se envía una señal al hilo principal para procesar la respuesta.

### 5.3 Impacto en el rendimiento

El uso de I/O no bloqueante es clave para la **escalabilidad**: si las operaciones bloquean el hilo de ejecución, se limita la capacidad de la aplicación para atender múltiples solicitudes a la vez. Con operaciones no bloqueantes, el hilo sigue procesando otras tareas, permitiendo manejar un mayor número de solicitudes simultáneas.

## 6. Asincronía: síncrono vs. asíncrono

La diferencia se refiere a **cuándo tendrá lugar la respuesta**:

- **Síncrono**: la respuesta sucede en el presente; la operación espera el resultado.
- **Asíncrono**: la respuesta sucede a futuro; la operación no espera el resultado.

En JavaScript, en consecuencia, se puede escribir código **síncrono y bloqueante**, o código **asíncrono y no bloqueante** (ver `docs-ia/javascript/01-javascript-fundamentos-y-asincronia.md`, sección 7, para callbacks/promesas/async-await).

## 7. Por qué importa el rendimiento web

| Motivo                      | Impacto                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Experiencia del usuario** | Los usuarios esperan respuestas rápidas; una app lenta genera abandono y mala reputación.                |
| **Conversión de ventas**    | Un rendimiento deficiente en e-commerce hace que los usuarios abandonen la compra.                       |
| **SEO**                     | Los buscadores priorizan sitios rápidos; un sitio lento puede ser penalizado en los resultados.          |
| **Costo**                   | Un rendimiento deficiente puede requerir más recursos de servidor, aumentando los costos de alojamiento. |

## 8. El ciclo de eventos (Event Loop)

### 8.1 ¿Qué es?

El **ciclo de eventos** (_event loop_) es un bucle de eventos asíncronos que se ejecuta continuamente mientras la aplicación Node.js está en ejecución. Está diseñado para manejar operaciones de E/S no bloqueantes, permitiendo que las aplicaciones sean muy escalables y eficientes en el consumo de recursos.

### 8.2 Componentes principales

| Componente                             | Función                                                                                                                                                                                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bucle de eventos (event loop)**      | Recibe y procesa los eventos, y llama a las devoluciones de llamada (_callbacks_) correspondientes, garantizando que las operaciones asíncronas se completen de forma correcta y eficiente.                                                                         |
| **Fases del proceso (process phases)** | Estados por los que pasa el proceso mientras espera eventos: fase de temporizadores (_timers_), fase de E/S (_I/O_), fase de comprobación (_check_), fase de cierre (_close_), entre otras. Cada fase tiene asociado un conjunto específico de eventos y callbacks. |
| **Cola de eventos (event queue)**      | Almacena los eventos aún no procesados por el bucle de eventos; se procesan en el orden en que se agregaron, garantizando un manejo ordenado y eficiente.                                                                                                           |

### 8.3 ¿Cómo funciona?

1. Node espera la llegada de solicitudes y eventos.
2. Cuando llega una solicitud, Node agrega la tarea correspondiente a la cola de eventos.
3. El event loop toma la siguiente tarea de la cola y la procesa de forma asíncrona y no bloqueante.
4. Si la tarea requiere una operación de E/S (lectura de archivo, consulta a una base de datos), Node la envía al sistema operativo para que la maneje.
5. Mientras espera que la operación de E/S se complete, el event loop sigue procesando otras tareas de la cola.
6. Cuando la operación de E/S termina, el sistema operativo envía una señal a Node; Node toma la tarea correspondiente y continúa su procesamiento.
7. Si hay tareas programadas a futuro (por ejemplo, mediante `setTimeout`), Node las agrega a la cola de eventos.
8. El ciclo continúa hasta que no hay más tareas en la cola o se detiene la ejecución del programa.

## 9. Ciclo de vida de un proceso en Node

| Etapa                        | Descripción                                                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Inicio del proceso**       | Se inicia al ejecutar el comando `node` sobre un archivo de script; se inicializan módulos y variables globales. |
| **Ejecución del proceso**    | Se realizan las operaciones necesarias para completar la tarea del proceso.                                      |
| **Finalización del proceso** | Una vez completada la tarea, se liberan los recursos utilizados y se cierran las conexiones de red abiertas.     |

## 10. Módulos en Node.js

### 10.1 ¿Qué son y para qué sirven?

Los **módulos** son bloques de código reutilizable que se pueden incluir en una aplicación Node.js para agregar funcionalidad específica. Permiten separar la funcionalidad de la aplicación en distintos archivos y carpetas, mejorando la organización y el mantenimiento del código, lo que se traduce en una mejor calidad de software.

### 10.2 Administradores de paquetes

Los administradores de paquetes de Node (como **npm**) permiten gestionar la descarga, instalación, eliminación y otras tareas relacionadas con las dependencias del proyecto.

### 10.3 Ventajas de usar módulos

| Ventaja                         | Descripción                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------- |
| Reutilización de código         | Permiten reutilizar código en diferentes partes de la aplicación.               |
| Separación de responsabilidades | Facilitan entender y mantener el código al separarlo en archivos y carpetas.    |
| Mayor seguridad                 | Cada módulo se ejecuta en su propio ámbito; el código de uno no afecta a otros. |
| Mayor rendimiento               | Node.js carga solo el código necesario en cada momento.                         |

### 10.4 Tipos de módulos

| Tipo                                 | Descripción                                                                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Integrados** (_Core Modules_)      | Vienen incluidos en la instalación de Node.js, sin instalación adicional. Ejemplos: `http`, `fs`, `path`, `crypto`, `events`.                                 |
| **Locales** (_Local Modules_)        | Creados por el desarrollador de la aplicación, en un archivo `.js` separado. Se cargan con `require()` y exportan su funcionalidad mediante `module.exports`. |
| **Externos** (_Third-party Modules_) | Creados por otros desarrolladores y disponibles en el registro de npm. Se instalan con `npm install` y se cargan con `require()`.                             |

## 11. ¿Qué es un servidor?

Un **servidor** es un software o hardware que proporciona servicios a otros programas o dispositivos (clientes). En desarrollo web, un servidor sirve contenido web a los clientes (navegadores) que solicitan páginas y otros recursos por Internet. También puede manejar sesiones de usuario, autenticar usuarios y procesar pagos en línea.

### 11.1 Usos comunes de un servidor web

1. **Servir páginas web y recursos**: recibir solicitudes y devolver páginas, imágenes, audio y otros recursos.
2. **Procesar solicitudes y respuestas HTTP**: comunicarse con los navegadores mediante protocolos como HTTP.
3. **Gestión de sesiones de usuario**: registrar la actividad del usuario y almacenar información de sesión para acceder a recursos protegidos.
4. **Autenticación de usuarios**: verificar credenciales y garantizar que solo usuarios autorizados accedan a recursos protegidos (ver `docs-ia/backend/05-autenticacion-jwt-sesiones-cookies.md`).
5. **Procesamiento de pagos en línea**: integración con servicios de pago para transacciones seguras.

---

**Relación con otros documentos:** para el flujo completo de un servidor Express real, ver `docs-ia/backend/04-express-validator.md` (middlewares de validación) y `docs-ia/backend/05-autenticacion-jwt-sesiones-cookies.md` (autenticación). Para persistencia de datos sobre una base SQL desde Node, ver `docs-ia/backend/02-persistencia-y-sequelize-intro.md`. Material de referencia del curso: [material-unidad-4](https://github.com/aguscenturion/material-unidad-4) y [material-unidad-1-2do-cuatrimestre-2026](https://github.com/aguscenturion/material-unidad-1-2do-cuatrimestre-2026).
