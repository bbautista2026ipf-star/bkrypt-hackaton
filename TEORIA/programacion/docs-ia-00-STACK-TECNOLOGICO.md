---
doc_id: stack-tecnologico-oficial
proposito: >
  Definición oficial y vinculante del stack tecnológico del proyecto. Todo documento nuevo o
  actualización futura sobre gestión y creación de base de datos debe alinearse con esta sección
  (MySQL + Sequelize), y todo documento de frontend/backend debe alinearse con las tecnologías
  aquí listadas.
vigente_desde: "2026-09-24"
---

# Stack Tecnológico Oficial del Proyecto

## Índice

1. [Frontend](#1-frontend)
2. [Backend](#2-backend)
3. [Base de datos y ORM](#3-base-de-datos-y-orm)
4. [Herramientas y validación](#4-herramientas-y-validación)
5. [Mapa stack → documentación](#5-mapa-stack--documentación)

---

## 1. Frontend

| Tecnología           | Rol                                                    |
| -------------------- | ------------------------------------------------------ |
| **HTML5**            | Estructura y semántica de las vistas.                  |
| **CSS3**             | Estilos, maquetación (Flexbox/Grid).                   |
| **JavaScript (ES6)** | Lógica de cliente, interactividad, consumo de API.     |
| **React**            | Librería de componentes para la interfaz de usuario.   |
| **Bootstrap v5.3**   | Sistema de grillas y componentes visuales responsivos. |

## 2. Backend

| Tecnología                       | Rol                                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Node.js**                      | Entorno de ejecución del servidor.                                                                               |
| **Express**                      | Framework de enrutamiento y middlewares HTTP.                                                                    |
| **JavaScript (ES6, ES Modules)** | El backend se escribe con sintaxis `import`/`export` (ES Modules), no con `require`/`module.exports` (CommonJS). |

> **Convención de código obligatoria:** todo archivo `.js` del backend de este proyecto usa **ES Modules** (`import x from "y"`), salvo indicación explícita en contrario.

## 3. Base de datos y ORM

| Tecnología             | Rol                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **MySQL**              | Motor de base de datos relacional.                                                                                            |
| **XAMPP / phpMyAdmin** | Entorno local de gestión y administración visual de MySQL.                                                                    |
| **Sequelize**          | ORM: capa de abstracción entre el código Node.js/Express y las tablas MySQL (modelos, migraciones, relaciones, validaciones). |

## 4. Herramientas y validación

| Herramienta           | Rol                                                         |
| --------------------- | ----------------------------------------------------------- |
| **express-validator** | Validación y saneamiento de datos de entrada en el backend. |
| **Postman**           | Prueba manual de endpoints de la API.                       |
| **Git**               | Control de versiones.                                       |
| **GitHub**            | Alojamiento remoto del repositorio y colaboración.          |

## 5. Mapa stack → documentación

| Tecnología del stack   | Documento(s) de referencia                                                             |
| ---------------------- | -------------------------------------------------------------------------------------- |
| HTML5                  | `html/01-html-estructura-y-web-semantica.md`                                           |
| CSS3 (Flexbox/Grid)    | `css/01-css-selectores-y-propiedades.md`, `css/02-flexbox-y-grid.md`                   |
| JavaScript ES6         | `javascript/01-javascript-fundamentos-y-asincronia.md`                                 |
| Bootstrap v5.3         | `bootstrap/01-bootstrap-diseno-responsive.md`                                          |
| React                  | `react/01-introduccion-y-entorno-vite.md` a `react/06-integracion-backend-api.md`      |
| Node.js / Express      | `backend/00-nodejs-introduccion.md`, `backend/01-ssr-vs-csr.md`                        |
| express-validator      | `backend/04-express-validator.md`                                                      |
| JWT / cookies / bcrypt | `backend/05-autenticacion-jwt-sesiones-cookies.md`                                     |
| MySQL (SQL puro)       | `database/01-sql-mysql-manejo-de-tablas-individuales.md`                               |
| Sequelize (ORM)        | `database/02-persistencia-y-sequelize-intro.md`, `database/03-sequelize-relaciones.md` |

---

**Relación con otros documentos:** ver `INDEX.md` para el mapa completo de carpetas y el orden de lectura recomendado de todo el marco teórico.
