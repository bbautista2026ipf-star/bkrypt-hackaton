---
doc_id: index-maestro
proposito: >
  Índice maestro y mapa de relaciones entre los documentos Markdown de esta carpeta,
  pensado para que un agente de IA localice rápidamente la sección relevante sin leer
  todo el contenido.
---

# Índice Maestro — Material de Cátedra (Markdown modular)

Carpeta generada a partir de material PDF del Instituto Politécnico Formosa
(Tecnicatura en Desarrollo de Software Multiplataforma), reestructurado en Markdown
limpio y modular por tema.

## Mapa de carpetas

```
docs-ia/
├── 00-STACK-TECNOLOGICO.md
├── html/
│   └── 01-html-estructura-y-web-semantica.md
├── css/
│   ├── 01-css-selectores-y-propiedades.md
│   └── 02-flexbox-y-grid.md
├── javascript/
│   └── 01-javascript-fundamentos-y-asincronia.md
├── bootstrap/
│   └── 01-bootstrap-diseno-responsive.md
├── react/
│   ├── 01-introduccion-y-entorno-vite.md
│   ├── 02-componentes-props-listas.md
│   ├── 03-react-router.md
│   ├── 04-hooks-usestate-useeffect.md
│   ├── 05-custom-hooks-y-context.md
│   └── 06-integracion-backend-api.md
├── backend/
│   ├── 00-nodejs-introduccion.md
│   ├── 01-ssr-vs-csr.md
│   ├── 02-persistencia-y-sequelize-intro.md   ← puntero, ver database/02
│   ├── 03-sequelize-relaciones.md              ← puntero, ver database/03
│   ├── 04-express-validator.md
│   └── 05-autenticacion-jwt-sesiones-cookies.md
└── database/
    ├── 01-sql-mysql-manejo-de-tablas-individuales.md
    ├── 02-persistencia-y-sequelize-intro.md
    └── 03-sequelize-relaciones.md
```

> **Nota de reestructuración (2026-09-24):** los documentos sobre persistencia y Sequelize
> (antes `backend/02` y `backend/03`) se movieron a una carpeta `database/` dedicada, junto con
> el nuevo documento de SQL/MySQL puro. Ver la sección **"Criterio de reestructuración"** más
> abajo para el razonamiento completo.

## Orden de lectura recomendado (dependencias)

1. **`html/01-html-estructura-y-web-semantica.md`** — base: estructura de documentos, `<head>`, `<body>`, elementos semánticos.
2. **`css/`** — estilos: `01-css-selectores-y-propiedades.md` (selectores, propiedades básicas, enlace a HTML) y `02-flexbox-y-grid.md` (maquetación moderna en una y dos dimensiones).
3. **`javascript/01-javascript-fundamentos-y-asincronia.md`** — lenguaje: variables, funciones, objetos, DOM, callbacks/promesas/async-await, `fetch`.
4. **`bootstrap/01-bootstrap-diseno-responsive.md`** — grid de 12 columnas y componentes ya escritos sobre CSS (equivalente empaquetado de `css/02-flexbox-y-grid.md`).
5. **`react/`** (serie secuencial, cada archivo depende del anterior):
   1. `01-introduccion-y-entorno-vite.md` — qué es React, Vite, estructura de proyecto.
   2. `02-componentes-props-listas.md` — componentes, props, listas con `map()`.
   3. `03-react-router.md` — navegación entre páginas.
   4. `04-hooks-usestate-useeffect.md` — estado local y efectos secundarios.
   5. `05-custom-hooks-y-context.md` — reutilización de lógica y estado global.
   6. `06-integracion-backend-api.md` — consumo real de una API con manejo de carga/error.
6. **`database/`** (fundamentos de base de datos y ORM — leer antes que `backend/04` y `backend/05`):
   1. `01-sql-mysql-manejo-de-tablas-individuales.md` — MySQL/phpMyAdmin, SELECT/WHERE/LIKE/IN/BETWEEN, UPDATE/INSERT/DELETE, ALTER TABLE.
   2. `02-persistencia-y-sequelize-intro.md` — persistencia de datos, bases relacionales, qué es Sequelize.
   3. `03-sequelize-relaciones.md` — hasOne/belongsTo/hasMany/belongsToMany, Eager Loading.
7. **`backend/`** (Unidad 4 — servidor: Node/Express, validación y autenticación):
   1. `00-nodejs-introduccion.md` — qué es Node.js, ventajas/desventajas, I/O bloqueante/no bloqueante, event loop, módulos.
   2. `01-ssr-vs-csr.md` — Server-Side Rendering vs. Client-Side Rendering.
   3. `04-express-validator.md` — middlewares, validación y saneamiento de datos con express-validator.
   4. `05-autenticacion-jwt-sesiones-cookies.md` — JWT, cookies, bcrypt, login/logout/rutas protegidas (usa modelos definidos en `database/`).

## Relación entre temas (para búsqueda cruzada)

| Si buscás...                                                                                                        | Mirá en                                                                           |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `<script>`, `<head>`, `<link>`, etiquetas semánticas                                                                | `html/01-html-estructura-y-web-semantica.md`                                      |
| Selectores CSS, `style`, `background-color`, `margin`, `padding`                                                    | `css/01-css-selectores-y-propiedades.md`                                          |
| Flexbox, Grid (CSS nativo), `display: flex`/`grid`                                                                  | `css/02-flexbox-y-grid.md`                                                        |
| Variables, funciones, `this`, DOM, `fetch`, promesas, `async/await`                                                 | `javascript/01-javascript-fundamentos-y-asincronia.md`                            |
| Grid de Bootstrap, `col-*`, componentes visuales (navbar, botones, alertas)                                         | `bootstrap/01-bootstrap-diseno-responsive.md`                                     |
| JSX, componentes, props                                                                                             | `react/01-introduccion-y-entorno-vite.md`, `react/02-componentes-props-listas.md` |
| Rutas, `Link`, `BrowserRouter`                                                                                      | `react/03-react-router.md`                                                        |
| `useState`, `useEffect`, ciclo de vida                                                                              | `react/04-hooks-usestate-useeffect.md`                                            |
| Custom hooks, `useContext`, prop drilling                                                                           | `react/05-custom-hooks-y-context.md`                                              |
| Consumo de API en React, estados de carga/error                                                                     | `react/06-integracion-backend-api.md`                                             |
| Node.js, event loop, I/O bloqueante/no bloqueante, módulos                                                          | `backend/00-nodejs-introduccion.md`                                               |
| SSR vs. CSR                                                                                                         | `backend/01-ssr-vs-csr.md`                                                        |
| SQL puro: `SELECT`, `WHERE`, `LIKE`, `IN`, `BETWEEN`, `UPDATE`, `INSERT`, `DELETE`, `ALTER TABLE`, MySQL/phpMyAdmin | `database/01-sql-mysql-manejo-de-tablas-individuales.md`                          |
| Persistencia de datos, qué es Sequelize                                                                             | `database/02-persistencia-y-sequelize-intro.md`                                   |
| Relaciones Sequelize (`hasOne`, `belongsTo`, `hasMany`, `belongsToMany`), Eager Loading                             | `database/03-sequelize-relaciones.md`                                             |
| Validación de body, middlewares, `express-validator`, `matchedData`                                                 | `backend/04-express-validator.md`                                                 |
| JWT, cookies, `bcrypt`, login/logout, rutas protegidas                                                              | `backend/05-autenticacion-jwt-sesiones-cookies.md`                                |
| Stack tecnológico oficial del proyecto (frontend/backend/DB/herramientas)                                           | `00-STACK-TECNOLOGICO.md`                                                         |

## Criterio de reestructuración: backend/ vs. database/ (2026-09-24)

Se evaluó, con criterio de arquitectura de software, si el contenido de persistencia/Sequelize
debía permanecer en `backend/` o pasar a una carpeta `database/` dedicada. Decisión: **se separa**,
por las siguientes razones:

1. **Separación de responsabilidades (capas de la aplicación).** `backend/` describe la capa de
   _aplicación/servidor_ (Node.js, Express, enrutamiento, middlewares, autenticación). El contenido
   de Sequelize y SQL describe la capa de _persistencia/datos_ (modelado de tablas, relaciones,
   consultas). Son capas distintas incluso dentro de un mismo proceso Node.js, y el proyecto ya usa
   MySQL como motor externo (vía XAMPP/phpMyAdmin) — no es un detalle interno del servidor, sino un
   componente de infraestructura propio.
2. **Mejor densidad de búsqueda para un agente de IA.** Antes de esta separación, un agente que
   buscara "cómo defino una tabla" o "relación uno a muchos" debía revisar `backend/`, mezclado con
   JWT y validación. Con `database/` como carpeta dedicada, la búsqueda por tema es directa.
3. **El nuevo material de SQL puro solo tiene sentido en `database/`.** El documento
   `01-sql-mysql-manejo-de-tablas-individuales.md` (cátedra "Bases de Datos I") no tiene relación
   con Node/Express — es SQL/MySQL puro. Colocarlo en `backend/` habría sido incorrecto; y una vez
   creada la carpeta `database/`, los documentos de Sequelize (que dependen conceptualmente de SQL)
   quedan mejor ubicados junto a él, en el orden de lectura: SQL → Sequelize intro → relaciones.
4. **No se movió `05-autenticacion-jwt-sesiones-cookies.md`.** Aunque usa modelos Sequelize
   (`UserModel`, `PersonModel`), su tema central es autenticación/autorización (JWT, cookies,
   bcrypt, middlewares de Express) — pertenece a la capa de aplicación. Se actualizaron sus
   referencias cruzadas para apuntar a `database/03-sequelize-relaciones.md`.
5. **No destructivo.** Los archivos originales `backend/02-persistencia-y-sequelize-intro.md` y
   `backend/03-sequelize-relaciones.md` se conservan como **punteros de redirección** (no se
   eliminaron), para no romper enlaces o referencias externas ya creadas.

Esto es coherente con el stack oficial confirmado (`00-STACK-TECNOLOGICO.md`): **MySQL
(XAMPP/phpMyAdmin) + Sequelize** como motor y ORM del proyecto, ambos ahora documentados en
`database/`.

## Convenciones aplicadas en todos los documentos

- **Front-matter YAML** al inicio de cada archivo con metadatos (`doc_id`, `tema`, `fuentes_origen`, `relacion_con_otros_docs`, `nivel`).
- **Índice de secciones** con anclas al comienzo del cuerpo.
- **Jerarquía consistente**: `#` título del documento, `##` secciones principales, `###` subsecciones.
- **Tablas** para comparativas y listados de opciones/atributos.
- **Bloques de código** con el lenguaje declarado (`html`, `javascript`, `jsx`, `bash`).
- Sin fragmentos de texto mal formados, encabezados de diapositiva repetidos ni ruido de OCR: todo el contenido fue reescrito a partir de la lectura visual íntegra de cada PDF fuente.
