---
doc_id: css-selectores-y-propiedades
institucion: Instituto Politécnico Formosa
carrera: Tecnicatura en Desarrollo de Software Multiplataforma
materia: Taller de Lenguaje de Programación I
unidad: "Unidad 2 — Diseño de Aplicaciones Web"
tema: "CSS — hojas de estilo en cascada, selectores y propiedades básicas"
fuentes_origen:
  - "Material de Lectura CSS-GRID-FLEX.pdf (parte 1: CSS Hojas de Estilo en Cascada)"
relacion_con_otros_docs: >
  Requiere la estructura HTML descrita en docs-ia/html/01-html-estructura-y-web-semantica.md
  (el archivo CSS se vincula mediante <link> en <head>, sección 4). Precede a
  docs-ia/css/02-flexbox-y-grid.md (maquetación moderna) y es la base conceptual sobre la que
  se apoya docs-ia/bootstrap/01-bootstrap-diseno-responsive.md (Bootstrap es CSS ya escrito).
nivel: introductorio
---

# CSS — Hojas de Estilo en Cascada: Selectores y Propiedades

## Índice

1. [Introducción a CSS](#1-introducción-a-css)
2. [Selectores en CSS](#2-selectores-en-css)
3. [Cómo enlazar un archivo CSS a una página HTML](#3-cómo-enlazar-un-archivo-css-a-una-página-html)
4. [Propiedades CSS para aplicar estilo a los elementos](#4-propiedades-css-para-aplicar-estilo-a-los-elementos)

---

## 1. Introducción a CSS

### 1.1 ¿Qué es CSS?

**CSS** (_Cascading Style Sheets_ — Hojas de Estilo en Cascada) es un lenguaje de diseño utilizado en conjunto con HTML para crear páginas web atractivas y visualmente agradables. Permite controlar la presentación de los elementos HTML: color, tamaño, fuente, margen, relleno, etc.

### 1.2 ¿Por qué es importante usar CSS?

- **Separación de contenido y presentación**: en lugar de aplicar estilos directamente en el HTML, se aplican mediante una hoja de estilo externa. Esto permite cambiar el aspecto de todo el sitio modificando un solo archivo, sin tocar el contenido HTML.
- **Reutilización**: un mismo estilo CSS puede aplicarse a múltiples elementos HTML simultáneamente, ahorrando tiempo en la creación y mantenimiento del sitio.
- **Mayor flexibilidad y facilidad de mantenimiento** en el diseño de la página.
- Mejora la **accesibilidad** y la **eficiencia** de la página web.

## 2. Selectores en CSS

### 2.1 ¿Qué es un selector?

Un **selector** es un patrón utilizado para seleccionar uno o más elementos HTML a los que se aplicará un estilo. CSS funciona seleccionando elementos HTML y aplicándoles estilos definidos en reglas; los selectores pueden basarse en el tipo de etiqueta, clases, IDs, atributos, posición en el documento, entre otros criterios.

### 2.2 Tipos de selectores

| #   | Selector            | Sintaxis        | Descripción                                                                                |
| --- | ------------------- | --------------- | ------------------------------------------------------------------------------------------ |
| 1   | **De tipo**         | `p { }`         | Selecciona todos los elementos HTML de un tipo específico (ej. todos los `<p>`).           |
| 2   | **De ID**           | `#mi-id { }`    | Selecciona el único elemento que tiene ese atributo `id`.                                  |
| 3   | **De clase**        | `.mi-clase { }` | Selecciona todos los elementos que comparten esa clase.                                    |
| 4   | **Universal**       | `* { }`         | Selecciona todos los elementos de la página.                                               |
| 5   | **De atributo**     | `a[href] { }`   | Selecciona elementos que tienen un atributo específico.                                    |
| 6   | **De hijo**         | `div > p { }`   | Selecciona un elemento que es **hijo directo** de otro.                                    |
| 7   | **De descendencia** | `ul li { }`     | Selecciona un elemento que es **descendiente** (en cualquier nivel) de otro.               |
| 8   | **De pseudoclase**  | `a:hover { }`   | Selecciona un elemento según un estado específico (`:hover`, `:active`, `:visited`, etc.). |

### 2.3 Ejemplos de código

```css
/* Selector de tipo — todos los párrafos en rojo */
p {
  color: red;
}

/* Selector de ID — el elemento con id="mi-id" en azul */
#mi-id {
  color: blue;
}

/* Selector de clase — tamaño de fuente para la clase "mi-clase" */
.mi-clase {
  font-size: 16px;
}

/* Selector universal — margen y relleno en cero para todo */
* {
  margin: 0;
  padding: 0;
}

/* Selector de atributo — enlaces con atributo href en color morado */
a[href] {
  color: purple;
}

/* Selector de hijo — párrafos hijos directos de un div, en negrita */
div > p {
  font-weight: bold;
}

/* Selector de descendencia — ítems de lista dentro de un ul, viñeta cuadrada */
ul li {
  list-style-type: square;
}

/* Selector de pseudoclase — subrayado al pasar el mouse sobre un enlace */
a:hover {
  text-decoration: underline;
}
```

> Existen muchos más tipos de selectores en CSS, cada uno con su propia sintaxis y reglas. Combinarlos de forma efectiva permite lograr una gran variedad de estilos y diseños.

## 3. Cómo enlazar un archivo CSS a una página HTML

**Paso 1 — Crear un archivo CSS**: crear un archivo (por ejemplo `styles.css`) y escribir dentro las reglas de estilo.

**Paso 2 — Colocar el archivo CSS en el servidor**: subir el archivo al servidor donde se aloja la página HTML, recordando la ruta de acceso.

**Paso 3 — Agregar una etiqueta `<link>` al archivo HTML**: dentro de la sección `<head>`, con los siguientes atributos:

| Atributo | Valor / función                                                                      |
| -------- | ------------------------------------------------------------------------------------ |
| `href`   | Ruta de acceso al archivo CSS en el servidor.                                        |
| `rel`    | Debe ser `"stylesheet"`, para indicar que el archivo enlazado es una hoja de estilo. |
| `type`   | Debe ser `"text/css"`, para indicar que el archivo enlazado es CSS.                  |

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mi página HTML</title>
    <link href="styles.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <!-- Aquí va el contenido de la página -->
  </body>
</html>
```

> En este ejemplo, el archivo `styles.css` está en la misma carpeta que el HTML. Si estuviera en una carpeta distinta, hay que especificar la ruta completa (por ejemplo `css/styles.css`).

## 4. Propiedades CSS para aplicar estilo a los elementos

### 4.1 Estilo en línea

Se aplica directamente a un elemento HTML mediante el atributo `style`, definiendo el estilo entre comillas:

```html
<p style="color: blue;">Este texto es de color azul</p>
```

### 4.2 Propiedades comunes

| Propiedad          | Función                                             | Ejemplo                                 |
| ------------------ | --------------------------------------------------- | --------------------------------------- |
| `background-color` | Color de fondo de un elemento.                      | `div { background-color: red; }`        |
| `font-family`      | Tipografía de un elemento.                          | `p { font-family: Arial, sans-serif; }` |
| `font-size`        | Tamaño de fuente de un elemento.                    | `h1 { font-size: 36px; }`               |
| `margin`           | Margen (espacio exterior) alrededor de un elemento. | `img { margin: 10px; }`                 |
| `padding`          | Relleno (espacio interior) dentro de un elemento.   | `div { padding: 20px; }`                |
| `text-align`       | Alineación del texto dentro de un elemento.         | `p { text-align: center; }`             |

---

**Relación con otros documentos:** el archivo CSS descrito aquí se enlaza en `<head>` tal como se detalla en `docs-ia/html/01-html-estructura-y-web-semantica.md` (sección 4). Para maquetación avanzada en dos dimensiones o en una fila/columna, ver `docs-ia/css/02-flexbox-y-grid.md`. Bootstrap (`docs-ia/bootstrap/01-bootstrap-diseno-responsive.md`) es, en esencia, una hoja de estilos CSS ya escrita y organizada en clases reutilizables.
