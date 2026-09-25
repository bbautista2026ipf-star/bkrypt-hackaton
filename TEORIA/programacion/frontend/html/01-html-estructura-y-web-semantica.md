---
doc_id: html-estructura-web-semantica
institucion: Instituto Politécnico Formosa
carrera: Tecnicatura en Desarrollo de Software Multiplataforma
materia: Taller de Lenguaje de Programación I
unidad: "Unidad 2 — Diseño de Aplicaciones Web"
tema: HTML — estructura de documentos, elementos y web semántica
fuentes_origen:
  - "UNIDAD-2-Introduccion_a_HTML.pdf"
  - "Estructura_HTML.pdf"
relacion_con_otros_docs: >
  Complementa a "02-javascript-fundamentos-y-asincronia.md" (HTML aloja el código
  JavaScript mediante <script>) y precede conceptualmente a cualquier material de CSS/Bootstrap.
nivel: introductorio-intermedio
---

# HTML — Estructura de Documentos y Web Semántica

## Índice

1. [¿Qué es HTML?](#1-qué-es-html)
2. [Sintaxis de HTML](#2-sintaxis-de-html)
3. [Estructura básica de un documento HTML](#3-estructura-básica-de-un-documento-html)
4. [La cabecera del documento (`<head>`)](#4-la-cabecera-del-documento-head)
5. [El cuerpo del documento (`<body>`) y elementos estructurales](#5-el-cuerpo-del-documento-body-y-elementos-estructurales)
6. [Ejemplo integrado completo](#6-ejemplo-integrado-completo)
7. [Web semántica](#7-web-semántica)
8. [Entidades de caracteres especiales](#8-entidades-de-caracteres-especiales)

---

## 1. ¿Qué es HTML?

**HTML** (_HyperText Markup Language_, Lenguaje de Marcas de Hipertexto) es el componente más básico de la Web: define el **significado y la estructura** del contenido web. "Hipertexto" hace referencia a los enlaces que conectan páginas web entre sí, dentro de un mismo sitio o entre sitios distintos.

A pesar de las innovaciones introducidas por CSS y JavaScript, la estructura creada por el código HTML sigue siendo la parte fundamental de todo documento web: define el espacio donde se posiciona el contenido estático y dinámico, y es la base sobre la que se construye cualquier sitio o aplicación.

## 2. Sintaxis de HTML

HTML es un lenguaje compuesto por **etiquetas** (_tags_) definidas, cada una con un nombre encerrado entre paréntesis angulares (`< >`). El nombre define el tipo de contenido que representa.

- **Etiquetas de par** (apertura y cierre), por ejemplo:

```html
<p>Contenido...</p>
```

- **Etiquetas individuales** (sin cierre), por ejemplo un salto de línea:

```html
<br />
```

Las etiquetas individuales y las de apertura pueden incluir **atributos**, que ofrecen información adicional:

```html
<html lang="es">
  ...
</html>
```

En este ejemplo: `html` es el **nombre** del elemento, `lang` es el **atributo** y `"es"` es su **valor**.

## 3. Estructura básica de un documento HTML

### 3.1 Declaración de tipo de documento

Debido a que los navegadores procesan distintos tipos de archivos, todo documento HTML debe comenzar con la declaración `<!DOCTYPE>`, que indica al navegador cómo debe interpretar y generar la página. En HTML5, la declaración es:

```html
<!DOCTYPE html>
```

### 3.2 El árbol de elementos estructurales

Los elementos HTML conforman una estructura de tipo **árbol**, con el elemento `<html>` como raíz. Los tres elementos que definen la columna vertebral de todo documento son:

| Elemento | Función                                                                                                                                                                                       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<html>` | Delimita todo el código HTML. Admite el atributo `lang` para declarar el idioma del contenido (`es`, `en`, `fr`, etc.).                                                                       |
| `<head>` | Contiene la información necesaria para configurar la página: título, codificación de caracteres, metadatos y archivos externos. No es visible para el usuario (salvo el título y los íconos). |
| `<body>` | Delimita el contenido visible del documento (la parte que se muestra en pantalla).                                                                                                            |

`<body>` y `<head>` son **hermanos** entre sí y ambos son **hijos** de `<html>`.

Esqueleto mínimo:

```html
<!DOCTYPE html>
<html lang="es">
  <head> </head>
  <body></body>
</html>
```

## 4. La cabecera del documento (`<head>`)

La cabecera incluye toda la información y los recursos necesarios para generar la página. Elementos disponibles:

| Elemento   | Función                                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<title>`  | Define el título de la página (se muestra en la pestaña del navegador y en resultados de buscadores).                                                 |
| `<base>`   | Define la URL base que el navegador usa para resolver URLs relativas. Requiere el atributo `href`.                                                    |
| `<meta>`   | Representa metadatos del documento (descripción, palabras clave, codificación de caracteres, etc.). Atributos comunes: `name`, `content`, `charset`.  |
| `<link>`   | Especifica la relación entre el documento y un recurso externo (típicamente hojas de estilo CSS). Atributos: `href`, `rel`, `media`, `type`, `sizes`. |
| `<style>`  | Declara estilos CSS embebidos en el documento.                                                                                                        |
| `<script>` | Carga o declara código JavaScript.                                                                                                                    |

### 4.1 Ejemplo — título y codificación

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Este texto es el título del documento</title>
    <meta charset="utf-8" />
  </head>
  <body></body>
</html>
```

> **Nota:** `utf-8` es la codificación recomendada porque incluye la mayoría de los caracteres usados en distintos idiomas.

### 4.2 Ejemplo — metadatos adicionales

Se pueden declarar múltiples `<meta>` para describir la página a navegadores y motores de búsqueda:

```html
<meta name="description" content="Este es un documento HTML5" />
<meta name="keywords" content="HTML, CSS, JavaScript" />
```

### 4.3 Ejemplo — ícono y hoja de estilos externa

```html
<link rel="icon" href="imagenes/favicon.png" type="image/png" sizes="16x16" />
<link rel="stylesheet" href="misestilos.css" />
```

## 5. El cuerpo del documento (`<body>`) y elementos estructurales

El código entre las etiquetas `<body>` genera la parte visible de la página.

Históricamente se usaron `<table>` (tablas) y luego `<div>` (divisiones genéricas) para organizar el contenido, pero ninguno de los dos comunica el **propósito** de cada sección. HTML5 introdujo elementos con nombres descriptivos que informan tanto a desarrolladores como al navegador sobre el rol de cada parte del documento.

### 5.1 Elementos estructurales del cuerpo

| Elemento    | Función                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `<div>`     | División genérica. Se usa cuando ningún otro elemento semántico es aplicable.                                                           |
| `<header>`  | Cabecera del cuerpo o de una sección dentro del cuerpo (logo, título, subtítulos, descripción breve). No confundir con `<head>`.        |
| `<nav>`     | Sección con ayuda de navegación: menú principal o listas de enlaces del sitio.                                                          |
| `<main>`    | Contenido principal del documento (el tema central de la página).                                                                       |
| `<section>` | Sección genérica de contenido; se usa para separar contenido temático o generar columnas/bloques.                                       |
| `<aside>`   | Contenido relacionado con el principal pero que no forma parte de él (referencias, enlaces relacionados, barra lateral).                |
| `<article>` | Artículo independiente y autocontenido (una publicación de blog, un comentario, una noticia).                                           |
| `<footer>`  | Pie del cuerpo o de una sección (información del autor/compañía, enlaces legales, mapa del sitio). Equivale a la "barra institucional". |

### 5.2 Patrón de diseño tradicional

```
┌─────────────────────────────┐
│           Cabecera           │
├─────────────────────────────┤
│      Barra de Navegación     │
├──────────────────┬──────────┤
│   Información     │  Barra   │
│   Principal        │ Lateral │
├──────────────────┴──────────┤
│      Barra Institucional     │
└─────────────────────────────┘
```

Correspondencia con etiquetas:

```html
<header></header>
<nav></nav>
<main>
  <section></section>
  <aside></aside>
</main>
<footer></footer>
```

Los elementos se declaran en el mismo orden en que se presentan en pantalla, de arriba hacia abajo y de izquierda a derecha (orden que luego puede modificarse con CSS).

## 6. Ejemplo integrado completo

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Este texto es el título del documento</title>
    <meta charset="utf-8" />
    <meta name="description" content="Este es un documento HTML5" />
    <meta name="keywords" content="HTML, CSS, JavaScript" />
    <link rel="stylesheet" href="misestilos.css" />
  </head>
  <body>
    <header>Este es el título</header>
    <nav>Principal | Fotos | Videos | Contacto</nav>
    <main>
      <section>
        <article>Este es el texto de mi primer artículo</article>
        <article>Este es el texto de mi segundo artículo</article>
      </section>
      <aside>Cita del artículo uno · Cita del artículo dos</aside>
    </main>
    <footer>&copy; Derechos Reservados 2016</footer>
  </body>
</html>
```

## 7. Web semántica

### 7.1 ¿Qué es?

La **semántica** en HTML es el uso adecuado de elementos para estructurar y dar significado al contenido web: usar el elemento apropiado según el propósito y la función de cada parte de la página (por ejemplo, `<nav>` para navegación en lugar de un `<div>` genérico).

La **Web Semántica** es una extensión de la World Wide Web cuyo objetivo es hacer que la información sea más fácilmente **procesable por las máquinas**, permitiendo que las computadoras comprendan el significado y contexto de la información en lugar de tratarla como texto plano.

### 7.2 Importancia para la accesibilidad

- Ayuda a que tecnologías de asistencia (lectores de pantalla) comprendan y naveguen el contenido de forma más efectiva.
- Permite a los desarrolladores proporcionar metadatos y etiquetas más detallados y precisos, facilitando que personas con discapacidad encuentren y accedan a la información relevante.

### 7.3 Impacto en el SEO

El **SEO** (_Search Engine Optimization_) son las técnicas para mejorar el posicionamiento de un sitio en los resultados de los motores de búsqueda. La Web Semántica impacta positivamente en el SEO porque:

- Los motores de búsqueda comprenden mejor el contenido de la página.
- Las etiquetas semánticas aportan información valiosa sobre la estructura y el contenido, lo que produce resultados de búsqueda más precisos.

### 7.4 Beneficios resumidos de usar etiquetas semánticas

1. **Accesibilidad**: mejora la navegación para usuarios con tecnologías de asistencia.
2. **SEO**: mejora la clasificación y visibilidad en buscadores.
3. **Mantenimiento y comprensión del código**: hace el código más legible para desarrolladores y facilita la colaboración en proyectos web.

### 7.5 Etiquetas semánticas principales

`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` (ver tabla completa en la [sección 5.1](#51-elementos-estructurales-del-cuerpo)).

## 8. Entidades de caracteres especiales

Ciertos caracteres no se encuentran en el teclado o tienen un significado especial en HTML (como `<` y `>`, usados para delimitar etiquetas). Para incluirlos como texto, se deben representar mediante **entidades**:

| Carácter               | Entidad   |
| ---------------------- | --------- |
| `<`                    | `&lt;`    |
| `>`                    | `&gt;`    |
| `&`                    | `&amp;`   |
| `"`                    | `&quot;`  |
| `'`                    | `&apos;`  |
| `£`                    | `&pound;` |
| `€`                    | `&euro;`  |
| `©` (copyright)        | `&copy;`  |
| `®` (marca registrada) | `&reg;`   |

---

**Relación con otros documentos:** el elemento `<script>` descrito en la sección 4 es el punto de entrada para el código JavaScript detallado en `02-javascript-fundamentos-y-asincronia.md`; el elemento `<link rel="stylesheet">` es el punto de entrada para hojas CSS y para el framework descrito en `03-bootstrap-diseno-responsive.md`.
