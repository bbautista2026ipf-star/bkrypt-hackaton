---
doc_id: persistencia-y-sequelize-intro
institucion: Instituto Politécnico Formosa
carrera: Tecnicatura en Desarrollo de Software Multiplataforma
materia: Taller de Lenguaje de Programación I
unidad: "Unidad 4 — Programación del Lado del Servidor y Persistencia de Datos"
tema: "Persistencia de datos, bases de datos relacionales y Sequelize (introducción)"
fuentes_origen:
  - "Contenido de cátedra Unidad 4 (Conexión a Base de Datos SQL usando Sequelize) — Instituto Politécnico Formosa"
relacion_con_otros_docs: >
  Se apoya en docs-ia/database/01-sql-mysql-manejo-de-tablas-individuales.md (SQL puro sobre el
  que trabaja Sequelize) y en docs-ia/backend/00-nodejs-introduccion.md (Sequelize corre sobre
  Node.js). Precede a docs-ia/database/03-sequelize-relaciones.md (que profundiza en asociaciones
  entre modelos).
nivel: introductorio
reubicacion: >
  Documento reubicado desde docs-ia/backend/ a docs-ia/database/ (2026-09-24): su contenido
  describe el modelado y la gestión de la base de datos (capa de persistencia), no la lógica
  propia del servidor Express/Node.
---

# Persistencia de Datos y Sequelize — Introducción

## Índice

1. [Objetivos](#1-objetivos)
2. [¿Qué es la persistencia de datos?](#2-qué-es-la-persistencia-de-datos)
3. [Bases de datos y bases de datos relacionales](#3-bases-de-datos-y-bases-de-datos-relacionales)
4. [¿Qué es Sequelize?](#4-qué-es-sequelize)
5. [Funciones principales de Sequelize](#5-funciones-principales-de-sequelize)
6. [Ventajas y desventajas de Sequelize](#6-ventajas-y-desventajas-de-sequelize)
7. [Operaciones básicas sobre una base de datos SQL](#7-operaciones-básicas-sobre-una-base-de-datos-sql)

---

## 1. Objetivos

- Aprender a manipular una base de datos desde Node.js.
- Entender la importancia de la persistencia de los datos.

## 2. ¿Qué es la persistencia de datos?

La **persistencia de datos** es la capacidad de una aplicación o sistema informático para almacenar datos de manera duradera y accesible, incluso después de que el sistema se apague o se reinicie. Es decir, la capacidad de los datos para sobrevivir más allá de la sesión actual de la aplicación.

Es un requisito importante para la mayoría de las aplicaciones: sin persistencia, cualquier información almacenada se perdería cada vez que la aplicación se cierre o se reinicie, provocando la pérdida de información crítica.

## 3. Bases de datos y bases de datos relacionales

### 3.1 Bases de datos

Las **bases de datos** son colecciones organizadas de información almacenadas en un sistema informático, utilizadas para almacenar, organizar, recuperar y administrar datos de manera eficiente y confiable. Son una opción popular para la persistencia porque ofrecen una forma estructurada y escalable de almacenar grandes cantidades de información.

### 3.2 Bases de datos relacionales

Las **bases de datos relacionales** almacenan datos en **tablas** que se relacionan entre sí. Cada tabla representa una entidad, y cada fila representa una instancia o registro de esa entidad.

Utilizan el lenguaje **SQL** (_Structured Query Language_) para realizar consultas y operaciones sobre los datos: `SELECT` (consultar), `UPDATE` (actualizar), `DELETE` (eliminar) e `INSERT` (insertar nuevos registros).

## 4. ¿Qué es Sequelize?

**Sequelize** es una librería de JavaScript de código abierto que permite interactuar con bases de datos SQL de manera más fácil y eficiente. Está diseñada para trabajar con bases de datos relacionales como **MySQL, PostgreSQL, SQLite y Microsoft SQL Server**, y se utiliza con Node.js y otras aplicaciones basadas en JavaScript.

## 5. Funciones principales de Sequelize

| Función                 | Descripción                                                                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Modelos**             | Permite definir modelos que representan tablas de la base de datos, simplificando la escritura de consultas y manteniendo una estructura coherente. |
| **Consultas**           | Provee una API para realizar consultas (búsqueda, creación, actualización, eliminación de registros), incluso complejas.                            |
| **Migraciones**         | Permiten realizar cambios en la estructura de la base de datos de forma controlada y reversible.                                                    |
| **Validación de datos** | Permite validar los datos antes de insertarlos en la base, con reglas de validación personalizadas.                                                 |

## 6. Ventajas y desventajas de Sequelize

### 6.1 Ventajas

- **Simplifica la interacción con la base de datos**: API sencilla para operaciones CRUD, permitiendo enfocarse en la lógica de la aplicación.
- **Se integra bien con Node.js**: aprovecha el modelo de programación asíncrona y no bloqueante de Node.
- **Permite la definición de modelos** que representan tablas, facilitando consultas y manteniendo coherencia.
- **Soporte para diferentes bases de datos** (MySQL, PostgreSQL, SQLite, SQL Server) con la misma API.
- **Migraciones y validación de datos** controladas y reversibles.

### 6.2 Desventajas

- **Curva de aprendizaje**: aunque simplifica la interacción, sigue habiendo conceptos de bases de datos que aprender.
- **Rendimiento**: puede ser algo más lento que interactuar directamente con SQL, dependiendo del uso y la complejidad de las consultas.
- **Requiere mantenimiento**: como cualquier librería, necesita actualizaciones periódicas.

## 7. Operaciones básicas sobre una base de datos SQL

| Operación  | Descripción                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Insert** | Agrega nuevos datos a una tabla, especificando los valores para cada columna de la fila insertada.                                |
| **Select** | Recupera datos de una tabla, especificando las columnas deseadas y los criterios de selección para limitar los resultados.        |
| **Update** | Modifica datos existentes, especificando los nuevos valores y los criterios de selección para identificar las filas a actualizar. |
| **Delete** | Elimina datos existentes, especificando los criterios de selección para identificar las filas a eliminar.                         |

---

**Relación con otros documentos:** para las sentencias SQL puras (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) que Sequelize traduce internamente, ver `docs-ia/database/01-sql-mysql-manejo-de-tablas-individuales.md`. Para el detalle de cómo modelar relaciones entre tablas (uno a uno, uno a muchos, muchos a muchos) con Sequelize, ver `docs-ia/database/03-sequelize-relaciones.md`. Para validar los datos que llegan al servidor antes de guardarlos, ver `docs-ia/backend/04-express-validator.md`.
