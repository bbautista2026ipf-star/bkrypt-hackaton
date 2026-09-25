---
doc_id: sql-mysql-manejo-tablas-individuales
institucion: Instituto Politécnico Formosa
carrera: Tecnicatura Superior en Desarrollo de Software Multiplataforma
materia: "Bases de Datos I"
unidad: "Parte 3 — Unidad Temática 4: Manejo de Tablas Individuales (Consulta, Actualización, Inserción, Eliminación)"
tema: "Sentencias SQL básicas sobre una tabla individual en MySQL / phpMyAdmin"
fuentes_origen:
  - "Parte 3-UT4-Manejo de tablas individuales.pdf"
relacion_con_otros_docs: >
  Es la base conceptual de SQL sobre la que se apoya docs-ia/database/02-persistencia-y-sequelize-intro.md
  (Sequelize traduce internamente estas mismas sentencias SQL). Antecede en la ruta de lectura a
  docs-ia/database/03-sequelize-relaciones.md.
nivel: introductorio
---

# SQL / MySQL — Manejo de Tablas Individuales

## Índice

1. [Importación de datos](#1-importación-de-datos)
2. [Consulta de tablas individuales (SELECT)](#2-consulta-de-tablas-individuales-select)
3. [Operadores en la cláusula WHERE](#3-operadores-en-la-cláusula-where)
4. [Valores nulos en MySQL](#4-valores-nulos-en-mysql)
5. [Operadores IN y BETWEEN](#5-operadores-in-y-between)
6. [Alias en MySQL](#6-alias-en-mysql)
7. [Actualización de datos (UPDATE)](#7-actualización-de-datos-update)
8. [Inserción de datos (INSERT)](#8-inserción-de-datos-insert)
9. [Eliminación de datos (DELETE)](#9-eliminación-de-datos-delete)
10. [Modificar la estructura de una tabla (ALTER TABLE)](#10-modificar-la-estructura-de-una-tabla-alter-table)

---

## 1. Importación de datos

### 1.1 ¿Qué es MySQL?

**MySQL** es un sistema de gestión de bases de datos relacionales con las siguientes características:

- Código abierto y gratuito.
- Ideal tanto para aplicaciones pequeñas como grandes.
- Rápido, confiable, escalable y fácil de usar.
- Multiplataforma.
- Cumple con el estándar ANSI SQL.
- Lanzado por primera vez en 1995; desarrollado, distribuido y respaldado por Oracle Corporation.
- Su nombre proviene de la hija del cofundador Monty Widenius: _My_.

### 1.2 Crear una tabla en MySQL (phpMyAdmin)

Al crear una tabla, además del nombre, los atributos, tipos de datos y longitudes, deben indicarse:

| Parámetro                  | Valor recomendado |
| -------------------------- | ----------------- |
| Motor de almacenamiento    | `InnoDB`          |
| Cotejamiento de caracteres | `utf8_general_ci` |

### 1.3 Importar datos a una tabla

Pasos para importar datos desde un archivo a una tabla existente en phpMyAdmin:

1. Posicionarse en la tabla destino (conviene revisar antes su **estructura**).
2. Ir a la solapa **Importar** y seleccionar el archivo. Se recomienda formato **CSV**.
3. En "Conjunto de caracteres del archivo", elegir **`utf-8`**.
4. En las opciones del formato CSV:
   - Formato: **CSV**.
   - Columnas separadas por: **`;`** (punto y coma).
   - Columnas encerradas entre: dejar en blanco (eliminar el carácter por defecto).
   - Carácter de escape de columnas: dejar en blanco (eliminar el carácter por defecto).
5. Presionar **Continuar** y esperar a que el motor procese la importación.

## 2. Consulta de tablas individuales (SELECT)

La sentencia **`SELECT`** extrae información de una tabla. Sintaxis general:

```sql
SELECT seleccionar_Esto FROM desde_tabla WHERE condiciones;
```

- **`seleccionar_Esto`**: columnas a devolver, o `*` para todas. Corresponde a la operación de **proyección** del álgebra relacional (notación `π_columnas(Tabla)`): reduce la cantidad de información devuelta a los atributos requeridos.
- **`desde_tabla`**: tabla donde están los datos.
- **`condiciones`** (con `WHERE`, opcional): corresponde a la operación de **selección** del álgebra relacional (notación `σ_condición(Tabla)`): filtra filas según una condición específica.

### 2.1 Consulta de todos los datos de una tabla

```sql
SELECT * FROM `establecimientos`;
```

Devuelve todos los registros y todas las columnas de la tabla.

### 2.2 Consulta de un conjunto de campos o atributos

```sql
SELECT titular_nro, apellido_y_nombres, cuit FROM `titulares`;
```

Al seleccionar un subconjunto de atributos se está realizando una **proyección**.

### 2.3 Consulta de registros específicos

```sql
SELECT ESTABLECIMIENTO, SUPERFICIE, CULTIVO_NRO
FROM `estabelcimiento_parcela_cultivo`
WHERE cultivo_nro = 1;
```

El operador `=` también puede usarse sobre campos de texto (`varchar`), pero exige coincidencia **exacta**, incluyendo espacios:

```sql
SELECT * FROM `cultivos` WHERE CULTIVO_NOMBRE = 'MAIZ';   -- coincide
SELECT * FROM `cultivos` WHERE CULTIVO_NOMBRE = ' MAIZ';  -- NO coincide (espacio extra)
```

Por esta razón el operador `=` es poco potente sobre columnas de texto; para búsquedas flexibles se usa `LIKE` (ver sección 3).

### 2.4 Consulta de registros específicos distintos (DISTINCT)

Cuando una consulta devuelve valores repetidos, `DISTINCT` filtra los duplicados:

```sql
SELECT DISTINCT ESTABLECIMIENTO, SUPERFICIE, CULTIVO_NRO
FROM `estabelcimiento_parcela_cultivo`
WHERE cultivo_nro = 1;
```

## 3. Operadores en la cláusula WHERE

| Operador  | Descripción                                  |
| --------- | -------------------------------------------- |
| `=`       | Igual                                        |
| `>`       | Mayor que                                    |
| `<`       | Menor que                                    |
| `>=`      | Mayor o igual que                            |
| `<=`      | Menor o igual que                            |
| `<>`      | Distinto (en algunas variantes de SQL, `!=`) |
| `BETWEEN` | Dentro de un rango                           |
| `LIKE`    | Búsqueda de un patrón                        |
| `IN`      | Especifica múltiples valores posibles        |

### 3.1 Operadores lógicos: AND, OR, NOT

- **`AND`**: el registro se incluye si **todas** las condiciones separadas por `AND` son verdaderas.
- **`OR`**: el registro se incluye si **alguna** de las condiciones separadas por `OR` es verdadera.
- **`NOT`**: el registro se incluye si la condición **no** es verdadera.

```sql
SELECT * FROM `titulares`
WHERE MONOTRIBUTO = 'S' AND catagoria_monotributo = 'B';
```

### 3.2 Comodines y patrones (LIKE)

El operador **`LIKE`** busca un patrón específico en una columna, usando dos comodines:

| Comodín | Significa                     |
| ------- | ----------------------------- |
| `%`     | Cero, uno o varios caracteres |
| `_`     | Exactamente un carácter       |

```sql
-- Cultivos que terminan en "A" y tienen exactamente 4 caracteres
SELECT * FROM `cultivos` WHERE CULTIVO_NOMBRE LIKE '___A';

-- Titulares cuyo apellido empieza con "R"
SELECT * FROM `titulares` WHERE apellido_y_nombres LIKE 'R%';

-- Titulares cuyo apellido contiene "ia" en cualquier posición
SELECT * FROM `titulares` WHERE apellido_y_nombres LIKE '%ia%';
```

## 4. Valores nulos en MySQL

Un campo con valor **`NULL`** es un campo **sin valor** (opcional y no completado). Es distinto de un valor cero o de una cadena de espacios en blanco.

No es posible comparar valores `NULL` con operadores como `=`, `<` o `<>`. Deben usarse **`IS NULL`** e **`IS NOT NULL`**:

```sql
SELECT * FROM establecimientos WHERE domicilio IS NULL;
```

## 5. Operadores IN y BETWEEN

### 5.1 IN

`IN` permite especificar múltiples valores posibles para una columna; es una abreviatura de múltiples condiciones unidas por `OR`.

```sql
SELECT nombre_columna(s) FROM nombre_tabla WHERE nombre_columna IN (valor1, valor2, ...);
-- también puede recibir una subconsulta:
SELECT nombre_columna(s) FROM nombre_tabla WHERE nombre_columna IN (sentencia SELECT);
```

Ejemplo combinando `IN` con `NOT`:

```sql
SELECT * FROM `establecimientos_titulares`
WHERE nro_establecimiento IN (1758, 1822, 2183) AND NOT nro_titular IN (32, 985, 950);
```

### 5.2 BETWEEN

`BETWEEN` selecciona valores dentro de un rango (números, texto o fechas). Es **inclusivo**: incluye los valores inicial y final.

```sql
SELECT nombre_columna(s) FROM nombre_tabla WHERE nombre_columna BETWEEN valor1 AND valor2;

-- Ejemplo:
SELECT * FROM `cultivos` WHERE CULTIVO_NRO BETWEEN 3 AND 7;
```

## 6. Alias en MySQL

- Los alias asignan un nombre temporal a una tabla o a una columna, solo válido mientras dura la consulta.
- Se usan para hacer más legibles los nombres de columnas.
- Se crean con la palabra clave **`AS`**.

```sql
-- Alias de columna
SELECT nombre_columna AS alias_nombre FROM nombre_tabla;

-- Alias de tabla
SELECT nombre_columna(s) FROM nombre_tabla AS alias_nombre;

-- Ejemplo:
SELECT nombre AS 'Nombre del establecimiento', domicilio AS 'Domicilio del establecimiento'
FROM `establecimientos`;
```

## 7. Actualización de datos (UPDATE)

La sentencia **`UPDATE`** actualiza datos existentes en una tabla:

```sql
UPDATE `titulares` SET apellido_y_nombres = 'RUCHINSKY, JULIÁN PEDRO'
WHERE TITULAR_NRO = 58;
```

**Siempre** debe incluirse una cláusula `WHERE` que identifique de forma unívoca el/los registro(s) a modificar; omitirla actualizaría **todas** las filas de la tabla.

## 8. Inserción de datos (INSERT)

La sentencia **`INSERT`** agrega nuevos registros a una tabla:

```sql
INSERT INTO nombre_de_tabla (columna1, columna2, columna3, ...)
VALUES (valor1, valor2, valor3, ...);
```

Flujo de trabajo recomendado antes de insertar (ejemplo: agregar una parcela de 30 ha. de trigo al establecimiento 125):

1. Averiguar el código correspondiente al valor a insertar (ej.: `SELECT * FROM cultivos WHERE cultivo_nombre LIKE '%TRIGO%';` → código de cultivo).
2. Averiguar el siguiente valor correlativo si corresponde (ej.: última parcela cargada para ese establecimiento).
3. Ejecutar el `INSERT` con los valores ya resueltos:

```sql
INSERT INTO `estabelcimiento_parcela_cultivo`
(`ESTABLECIMIENTO`, `PARCELA`, `SUPERFICIE`, `CULTIVO_NRO`)
VALUES (125, 8, 30, 5);
```

## 9. Eliminación de datos (DELETE)

La sentencia **`DELETE`** elimina registros de una tabla:

```sql
DELETE FROM nombre_tabla WHERE condiciones;
```

Ejemplo — depurar titulares duplicados de un establecimiento, conservando solo uno:

```sql
-- 1) Detectar establecimientos con más de un titular
SELECT nro_establecimiento, COUNT(nro_titular) AS cantitulares
FROM establecimientos_titulares
GROUP BY nro_establecimiento
ORDER BY cantitulares DESC;

-- 2) Identificar cuál titular conservar (ej.: el 950 para el establecimiento 2183)
SELECT * FROM `establecimientos_titulares` WHERE nro_establecimiento = 2183;

-- 3) Eliminar el resto, conservando el titular elegido
DELETE FROM `establecimientos_titulares`
WHERE nro_establecimiento = 2183 AND NOT (nro_titular = 950);
```

> **Buena práctica:** en herramientas como phpMyAdmin, conviene **simular la consulta** antes de ejecutar un `DELETE` masivo, para confirmar cuántas y cuáles filas se verán afectadas antes de confirmar la eliminación definitiva.

## 10. Modificar la estructura de una tabla (ALTER TABLE)

La sentencia **`ALTER TABLE`** modifica la estructura de una tabla ya creada (por ejemplo, renombrarla):

```sql
ALTER TABLE localidades RENAME LOCALIDAD;
```

---

**Relación con otros documentos:** estas sentencias SQL (`SELECT`, `WHERE`, `INSERT`, `UPDATE`, `DELETE`) son exactamente las que **Sequelize** traduce y ejecuta internamente al usar sus métodos (`findAll`, `create`, `update`, `destroy`); ver `docs-ia/database/02-persistencia-y-sequelize-intro.md` para la introducción a Sequelize como capa de abstracción sobre estas mismas operaciones, y `docs-ia/database/03-sequelize-relaciones.md` para el modelado de relaciones entre tablas.
