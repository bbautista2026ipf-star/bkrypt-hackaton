---
doc_id: bootstrap-diseno-responsive
institucion: Instituto Politécnico Formosa
tema: "Diseño Web Responsive con el framework Bootstrap"
fuentes_origen:
  - "Material de Lectura BOOTSTRAP.pdf"
relacion_con_otros_docs: >
  Se apoya sobre la estructura HTML descrita en docs-ia/html/01-html-estructura-y-web-semantica.md
  (Bootstrap se vincula en <head> mediante <link>, ver esa guía sección 4).
nivel: introductorio
---

# Bootstrap — Diseño Web Responsive

## Índice

1. [Introducción a Bootstrap](#1-introducción-a-bootstrap)
2. [Primeros pasos con Bootstrap](#2-primeros-pasos-con-bootstrap)
3. [Sistema de cuadrícula (grid)](#3-sistema-de-cuadrícula-grid)
4. [Componentes de Bootstrap](#4-componentes-de-bootstrap)

---

## 1. Introducción a Bootstrap

### 1.1 ¿Qué es Bootstrap?

**Bootstrap** es un _framework_ de diseño web de código abierto utilizado para crear sitios web y aplicaciones responsivas y adaptadas a dispositivos móviles. Fue creado por **Mark Otto** y **Jacob Thornton** en Twitter como un conjunto de herramientas internas para mejorar la consistencia y eficiencia en el desarrollo de aplicaciones web.

**Historial de versiones:** Bootstrap 2 (agosto de 2011) → Bootstrap 3 (2013) → Bootstrap 4 (2018). Cada versión introdujo nuevas características, mejoras de rendimiento y soporte para tecnologías web modernas. Bootstrap combina **HTML, CSS y JavaScript** para construir interfaces de usuario elegantes y adaptables a distintos dispositivos, tamaños de pantalla y resoluciones.

### 1.2 ¿Por qué usar Bootstrap?

Simplifica el proceso de diseño y desarrollo responsivo: ofrece un conjunto de componentes y plantillas predefinidos para crear diseños rápidos y consistentes sin escribir código desde cero, incluyendo el ajuste automático de imágenes y videos según el tamaño de pantalla.

### 1.3 Ventajas de usar Bootstrap

| Ventaja              | Descripción                                                                           |
| -------------------- | ------------------------------------------------------------------------------------- |
| **Ahorro de tiempo** | No es necesario escribir código de diseño desde cero.                                 |
| **Consistencia**     | Componentes y plantillas predefinidos generan diseños coherentes en todo el sitio.    |
| **Responsividad**    | Diseñado para adaptarse a diferentes tamaños de pantalla y dispositivos.              |
| **Flexibilidad**     | Altamente personalizable: componentes y estilos adaptables a necesidades específicas. |
| **Compatibilidad**   | Funciona bien en la mayoría de navegadores y plataformas.                             |

## 2. Primeros pasos con Bootstrap

### 2.1 Descarga e instalación

Dos formas de incorporar Bootstrap a un proyecto:

1. **Descarga directa** desde el sitio oficial ([getbootstrap.com](https://getbootstrap.com/)): se descargan los archivos CSS y JavaScript y se agregan al proyecto.
2. **CDN** (_Content Delivery Network_): se agregan enlaces a los archivos alojados externamente, sin necesidad de descargarlos.

### 2.2 Integración con HTML

Una vez incorporado Bootstrap (por descarga o CDN), se utilizan sus **clases CSS** en los elementos HTML para aplicar estilos y funcionalidades específicas.

### 2.3 Uso de la CDN

Los enlaces a los archivos CSS y JavaScript de Bootstrap se agregan en la sección `<head>` del documento HTML:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bootstrap</title>

    <!-- CDN BOOTSTRAP -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-SRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
      crossorigin="anonymous"
    />
  </head>
  <body></body>
</html>
```

Una vez vinculada la CDN, se pueden usar las clases de Bootstrap directamente:

```html
<!-- Se aplican las clases de Bootstrap como hacemos normalmente -->
<div class="container">
  <div class="d-flex justify-content-center h-100">
    <h1>Bootstrap Ejemplo</h1>
  </div>
</div>
```

### 2.4 Uso de componentes predefinidos

La [documentación oficial de Bootstrap](https://getbootstrap.com/) provee fragmentos de código listos para copiar y pegar (por ejemplo, una barra de navegación completa):

```html
<!-- Componente copiado desde la documentación oficial -->
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Dropdown
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" aria-disabled="true">Disabled</a>
        </li>
      </ul>
      <form class="d-flex" role="search">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
```

## 3. Sistema de cuadrícula (grid)

### 3.1 ¿Qué es?

La **cuadrícula de Bootstrap** es un sistema de diseño de columnas que permite crear diseños responsivos adaptables a distintos tamaños de pantalla. Se basa en un sistema de **12 columnas** y utiliza clases CSS predefinidas para determinar cómo distribuir los elementos.

### 3.2 ¿Cómo funciona?

La página se divide en **filas** (`row`) y **columnas** (`col-*`); cada fila puede contener hasta 12 columnas.

| Clase       | Significado                                                |
| ----------- | ---------------------------------------------------------- |
| `col-xs-12` | Ocupa las 12 columnas en pantallas muy pequeñas (< 576px). |
| `col-sm-10` | Ocupa 10 columnas en pantallas pequeñas (≥ 576px).         |
| `col-md-6`  | Ocupa 6 columnas en pantallas medianas (≥ 768px).          |
| `col-lg-4`  | Ocupa 4 columnas en pantallas grandes (≥ 992px).           |
| `col-xl-2`  | Ocupa 2 columnas en pantallas muy grandes (≥ 1200px).      |

### 3.3 Ejemplo práctico — diseño de dos columnas

```html
<div class="container">
  <div class="row">
    <div class="col-md-6">
      <p>Contenido de la columna 1</p>
    </div>
    <div class="col-md-6">
      <p>Contenido de la columna 2</p>
    </div>
  </div>
</div>
```

`container` crea un contenedor de ancho fijo; `row` crea una fila; `col-md-6` divide la fila en dos columnas iguales (6+6=12) en pantallas medianas.

### 3.4 Clases de visibilidad responsiva

| Clase              | Efecto                                                                                |
| ------------------ | ------------------------------------------------------------------------------------- |
| `hidden-xs`        | Oculta el elemento en pantallas extra pequeñas (< 576px).                             |
| `visible-lg-block` | Muestra el elemento solo en pantallas grandes (≥ 992px); oculto en pantallas menores. |

## 4. Componentes de Bootstrap

### 4.1 Catálogo de componentes comunes

| Componente              | Uso                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| **Botones**             | Activar acciones: enviar formularios, abrir ventanas emergentes, redirigir a otra página. |
| **Formularios**         | Estilos para crear formularios atractivos y funcionales sin personalización manual.       |
| **Menús de navegación** | Menús fijos, responsivos para móviles, con pestañas o con acordeón.                       |
| **Carruseles**          | Mostrar contenido dinámico: imágenes, texto y otros elementos multimedia.                 |
| **Alertas**             | Mostrar información importante o mensajes de error, personalizables en estilo y color.    |

### 4.2 Ejemplos de código

```html
<!-- Botón -->
<button class="btn btn-primary">Mi botón</button>

<!-- Input de formulario -->
<input type="text" class="form-control" placeholder="Escribe aquí..." />
```

### 4.3 Cómo agregar componentes a una página

1. Incluir los archivos CSS y JavaScript de Bootstrap (descarga o CDN).
2. Aplicar las clases CSS y elementos HTML definidos por Bootstrap a la estructura de la página.

### 4.4 Ejemplo completo — barra de navegación con menú desplegable

```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Mi sitio web</a>
  <button
    class="navbar-toggler"
    type="button"
    data-toggle="collapse"
    data-target="#navbarNav"
    aria-controls="navbarNav"
    aria-expanded="false"
    aria-label="Toggle navigation"
  >
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="#"
          >Inicio <span class="sr-only">(current)</span></a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Acerca de</a>
      </li>
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdownMenuLink"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Productos
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <a class="dropdown-item" href="#">Producto 1</a>
          <a class="dropdown-item" href="#">Producto 2</a>
          <a class="dropdown-item" href="#">Producto 3</a>
        </div>
      </li>
    </ul>
  </div>
</nav>
```

Notas sobre el ejemplo:

- `navbar` crea el menú de navegación; `navbar-expand-lg` lo expande en pantallas grandes; `bg-light` establece un fondo claro.
- `navbar-brand` agrega el logotipo o nombre del sitio.
- El botón con clase `navbar-toggler` activa la animación que muestra el menú en pantallas pequeñas.
- `collapse navbar-collapse` contiene la lista `navbar-nav` con los ítems del menú.
- `dropdown` en un `<li>` junto con `dropdown-menu` crea un menú desplegable.
- `active` indica la página actual; `sr-only` agrega texto accesible solo para lectores de pantalla.

---

**Relación con otros documentos:** los archivos CSS/JS de Bootstrap se vinculan en `<head>` con `<link>`/`<script>` tal como se describe en `docs-ia/html/01-html-estructura-y-web-semantica.md` (sección 4). Los componentes interactivos (dropdowns, navbar toggler) dependen del JavaScript de Bootstrap, sin relación directa con `docs-ia/javascript/01-javascript-fundamentos-y-asincronia.md`.
