# Resumen general del proyecto

Plataforma web para descubrir la oferta de emprendedores y productores de **Formosa Capital**: catálogo de productos, calificaciones de la comunidad, ubicación de locales y ferias, y agenda de horarios en ferias.

> Documento redactado el 25/09/2026, al cierre de la integración del MVP. Resume cómo se trabajó, qué decisiones se tomaron, qué quedó construido y qué falta.

## Índice

1. [Problemática y propuesta](#1-problemática-y-propuesta)
2. [Equipo y forma de trabajo](#2-equipo-y-forma-de-trabajo)
3. [Cronología del desarrollo](#3-cronología-del-desarrollo)
4. [Pedidos a la IA que marcaron el rumbo](#4-pedidos-a-la-ia-que-marcaron-el-rumbo)
5. [Alcance final del MVP](#5-alcance-final-del-mvp)
6. [Stack y dependencias instaladas](#6-stack-y-dependencias-instaladas)
7. [Arquitectura del backend](#7-arquitectura-del-backend)
8. [Modelo de datos](#8-modelo-de-datos)
9. [API REST](#9-api-rest)
10. [Frontend](#10-frontend)
11. [Seguridad y reglas de negocio](#11-seguridad-y-reglas-de-negocio)
12. [Cómo levantar el proyecto](#12-cómo-levantar-el-proyecto)
13. [Datos de demostración y usuario administrador](#13-datos-de-demostración-y-usuario-administrador)
14. [Problemas encontrados y cómo se resolvieron](#14-problemas-encontrados-y-cómo-se-resolvieron)
15. [Pendientes y próximos pasos](#15-pendientes-y-próximos-pasos)

---

## 1. Problemática y propuesta

**Problemática** (ver `PROBLEMATICA/Hackaton - Produccion y Ambiente.md`): los emprendedores y productores locales tienen dificultades para comunicar su actividad, y los consumidores no tienen una forma sencilla de conocer de antemano qué se vende en su ciudad ni en qué ferias (por ejemplo, eventos como "A Toda Costa" o las ferias de PAIPPA).

**Aspectos que se buscaron resolver:**

- Desconocimiento del consumidor sobre los productos locales.
- Desconexión entre oferta y demanda.
- Falta de un catálogo centralizado con la oferta local y las ferias próximas.
- Falta de identidad digital de cada emprendedor más allá de las ferias puntuales.

**Propuesta de valor:** *"Descubrí la oferta local y sumate a ella, todo en un lugar."* Información integrada sobre emprendimientos, contacto directo por WhatsApp sin intermediarios y descubrimiento de productos por cercanía.

---

## 2. Equipo y forma de trabajo

| Integrante | Aporte principal (según el historial de git) |
|---|---|
| Bautista Berenfeld | Marco teórico (`TEORIA/`), reglas para la IA, problemática, paleta de colores y todo el frontend |
| Santiago Berger | Backend (modelos, autenticación, catálogo, consolidación) e integración final |
| Mateo (mateo-db) | Configuración inicial de la base de datos, el servidor y las variables de entorno |

### Vibecoding con reglas explícitas

El desarrollo se hizo con asistencia de IA ("vibecoding"), guiado por dos fuentes que la IA debía respetar en cada tarea:

- **`REGLAS_IA.md`**: rol, stack obligatorio, reglas de código, manejo de errores, seguridad, formato de respuesta, convenciones de commits y paleta de colores.
- **`TEORIA/`**: el material de la cátedra reestructurado en Markdown (HTML, CSS, JS, Bootstrap, React, Node/Express, express-validator, JWT, SQL y Sequelize), que se usó como referencia de estilo y de buenas prácticas.

Como guía de estructura de carpetas y de código del backend se tomó el repositorio [`mateo-db/trabajo-practico-integrador-1`](https://github.com/mateo-db/trabajo-practico-integrador-1).

### Convenciones acordadas durante el proyecto

- **Nombres del código** (variables, funciones, tablas) en **inglés**. **Comentarios en español**. `REGLAS_IA.md` todavía dice que los comentarios van en inglés: el equipo decidió lo contrario y conviene actualizar esa línea.
- **Archivos de modelos** con el formato `nombre.model.js` (por ejemplo, `user.model.js`).
- **Un commit por cada parte lógica** terminada (helpers, validaciones, middlewares, controladores, rutas), con prefijo (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `style:`) y un verbo impersonal en pasado: *"feat: se creó middleware de autenticación"*.
- **Sin marcas de agua** en los commits (nada de `Co-Authored-By`). Una vez se agregaron por error y se reescribieron los commits para quitarlas.
- **Un commit abarcativo al cerrar cada módulo**, en forma de merge a `develop` (por ejemplo, *"feat: se realizó la integración completa del módulo de catálogo de productos"*).
- **Ramas**: `main` ← `develop` ← ramas `feature/...` por funcionalidad.

---

## 3. Cronología del desarrollo

| Etapa | Rama | Qué se hizo |
|---|---|---|
| 1. Documentación base | `main`, `feature/reglas-ia` | Marco teórico, reglas para la IA, problemática, paleta de colores |
| 2. Configuración | `db-server-config` | Conexión con Sequelize, `app.js`, variables de entorno, dependencias iniciales |
| 3. Modelos | `modelos-y-relaciones` | Modelos Sequelize y relaciones (usuario, perfil de emprendedor, producto, feria, horario, reseña) |
| 4. Registro y login | `feature/registro-y-login` | Hash de contraseñas, JWT en cookie, validaciones, autenticación y autorización por rol |
| 5. Refactor de alcance y catálogo | `feature/catalogo-productos` | Calificación por producto, perfil con local o ferias, catálogo, perfiles, locales y ferias |
| 6. Consolidación del backend | `feature/consolidacion-backend` | Imágenes, edición de perfil, agenda, paginación, cercanía, moderación, manejo de errores y seed |
| 7. Integración con el frontend | `feature/integracion-mvp` | Frontend en React conectado al backend consolidado, sin verificación de email y con mapas de Leaflet |

---

## 4. Pedidos a la IA que marcaron el rumbo

Resumen de los pedidos más relevantes y de lo que se decidió en cada uno.

1. **"Leé `REGLAS_IA.md` y usá `TEORIA` como guía; todo el código debe seguir estas reglas."** Definió el stack obligatorio y las convenciones de todo el proyecto.
2. **"Definí los modelos y las relaciones siguiendo este código y la nomenclatura `user.model.js`, guiándote por el repositorio de referencia."** Las relaciones se centralizaron en `models/relations.js` (`setupRelations()`), con alias en cada asociación.
3. **"Los comentarios del código tienen que estar en español."** Esta decisión reemplaza a la regla original de `REGLAS_IA.md`.
4. **"Implementá el registro y el login funcionales, con contraseñas hasheadas."** Se usaron bcrypt, JWT en cookie `httpOnly` y express-validator.
5. **"Hacé un commit por cada parte lógica, en pasado."** Desde ahí, todo el historial sigue esa convención.
6. **"Arreglá los commits: quitá las marcas de agua."** Se reescribieron los commits sin perder contenido.
7. **"Terminá la autorización por rol."** Se creó el middleware `authorizeRoles(...)`. Además, la IA agregó por su cuenta un endpoint de registro de administradores; **el equipo pidió sacarlo** porque no estaba en el alcance.
8. **Refactor de alcance** (el más importante): las reseñas pasan a ser **calificaciones de producto** (1 a 5 estrellas y comentario opcional) y se muestra el promedio en el catálogo. El catálogo incluye **todos los productos**, cada uno enlazado al perfil de su emprendedor. **Se descartó el sello de verificado.** El mapa **deja de ser en tiempo real**: el emprendedor marca su local o, si no tiene, elige las ferias a las que asiste. Se agregó un listado de emprendedores con local.
9. **"Implementá todo lo imprescindible para consolidar el backend."** Imágenes subidas desde la computadora, edición del perfil, agenda de horarios, paginación, filtro por cercanía, moderación del admin, manejo de errores y datos de ejemplo.
10. **"Sacá la verificación por email: que solo se registre y que el login pida las credenciales."** Se eliminaron `nodemailer`, las variables SMTP, las rutas de verificación y la pantalla del frontend.
11. **"Cargá datos de prueba con el contexto de Formosa Capital."** Ferias, emprendedores, productos regionales, calificaciones y horarios inventados.
12. **"Usá Leaflet, no Google Maps."** Mapas de OpenStreetMap sin clave de API, más un selector de ubicación con clic en el mapa.

### Decisiones de alcance respecto del documento original

| Funcionalidad del documento | Estado final |
|---|---|
| Catálogo por categorías | ✅ Implementado, con filtros de texto, categoría, disponibilidad y cercanía |
| Buscador con filtros por tipo, cercanía y disponibilidad | ✅ Implementado |
| Agenda de ferias por semana | ✅ Implementada (horarios por emprendedor y feria) |
| Sello de "Emprendedor verificado" | ❌ Descartado: la confianza depende de las calificaciones |
| Mapa de emprendedores activos en tiempo real | 🔄 Reemplazado por ubicación fija del local o de las ferias, con indicación de horarios "en curso" |
| Sección de opiniones con fotos | 🔄 Reemplazada por calificaciones de producto (estrellas y comentario, sin fotos) |
| Registro con verificación de email | 🔄 Se implementó y luego se quitó a pedido del equipo |
| Constancia del emprendimiento en el registro | ❌ Descartada junto con el sello |

---

## 5. Alcance final del MVP

**Consumidor**
- Se registra con nombre, email y contraseña, e inicia sesión con sus credenciales.
- Recorre el catálogo de todos los emprendedores con paginación, búsqueda por texto, categoría, disponibilidad y cercanía, y ve el promedio de estrellas de cada producto.
- Entra a un producto, ve quién lo vende y los comentarios, y lo califica (1 a 5 estrellas y comentario opcional). Puede cambiar o borrar su calificación.
- Visita el perfil de un emprendedor, con solo sus productos, su local o ferias y sus próximos horarios.
- Consulta el mapa de ferias, la agenda y el listado de emprendedores con local.

**Emprendedor**
- Al registrarse indica si tiene local (lo marca en el mapa) o, si no, en qué ferias está (al menos una).
- Edita su perfil, local y ferias.
- Publica, edita y borra productos, con imagen subida desde la computadora.
- Carga sus horarios en las ferias de su perfil.
- Puede calificar productos de otros, nunca los propios.

**Administrador**
- Crea, edita y borra ferias. Una feria no se puede borrar si un emprendedor sin local quedaría sin ninguna.
- Modera: borra productos y calificaciones inapropiadas.

---

## 6. Stack y dependencias instaladas

### Stack oficial (según `REGLAS_IA.md`)

Frontend con HTML5, CSS3, JavaScript ES6, React y Bootstrap 5.3. Backend con Node.js y Express, usando ES Modules. Base de datos MySQL (XAMPP/phpMyAdmin) con Sequelize. Validación con express-validator. Git y GitHub.

### Backend (`server/package.json`)

| Paquete | Versión | Para qué se usa |
|---|---|---|
| `express` | ^5.2.1 | Servidor HTTP y enrutamiento |
| `sequelize` | ^6.37.8 | ORM: modelos, relaciones y consultas |
| `mysql2` | ^3.24.4 | Conector de MySQL para Sequelize |
| `express-validator` | ^7.3.2 | Validación y saneamiento de datos de entrada |
| `jsonwebtoken` | ^9.0.3 | Token de sesión (JWT) |
| `bcryptjs` | ^3.0.3 | Hash de contraseñas |
| `cookie-parser` | ^1.4.7 | Lectura de la cookie de sesión |
| `cors` | ^2.8.6 | Permitir pedidos del frontend con cookies |
| `dotenv` | ^18.0.3 | Variables de entorno |
| `multer` | ^2.4.0 | Subida de imágenes de productos (agregado en la consolidación) |

`nodemailer` llegó a instalarse para la verificación de email y después se **desinstaló**. Se eligió la versión 10 en lugar de la 7 porque esta tenía vulnerabilidades conocidas.

**Scripts:** `npm run dev` (servidor con recarga automática), `npm start`, `npm run db:reset` (recrea la base y carga los datos de demo).

### Frontend (`client/package.json`)

| Paquete | Versión | Para qué se usa |
|---|---|---|
| `react`, `react-dom` | ^19.3.0 | Interfaz de usuario |
| `react-router` | ^8.4.0 | Navegación entre páginas |
| `bootstrap` | ^5.3.8 | Grilla y componentes visuales |
| `@popperjs/core` | ^2.11.8 | Menús y tooltips de Bootstrap |
| `leaflet` | ^1.9.4 | Mapas (OpenStreetMap), sin clave de API |
| `react-leaflet` | ^5.0.0 | Componentes de React para Leaflet |
| `@fullcalendar/core`, `/react`, `/daygrid`, `/list`, `/interaction` | ^6.1.21 | Calendario de la agenda de ferias |
| `prop-types` | ^15.8.1 | Validación de props de los componentes |
| `vite` (dev) | ^8.3.1 | Servidor de desarrollo y compilación |
| `@vitejs/plugin-react` (dev) | ^6.1.1 | Soporte de React en Vite |
| `oxlint` (dev) | ^1.85.0 | Linter (`npm run lint`) |

`@react-google-maps/api` se usó al principio y se **reemplazó por Leaflet**, porque Google Maps exige una clave con tarjeta de crédito asociada.

---

## 7. Arquitectura del backend

```
server/
├── app.js                      # Arranque: CORS, JSON, cookies, relaciones, rutas, /uploads y manejadores finales
├── uploads/products/           # Imágenes subidas (fuera de git)
└── src/
    ├── config/database.js      # Instancia de Sequelize y conexión (rundb)
    ├── models/                 # *.model.js + relations.js (setupRelations)
    ├── helpers/                # bcrypt, jwt, archivos, promedio de calificaciones, distancia (Haversine)
    ├── middlewares/            # autenticación, autorización por rol, propiedad, subida, errores, resultado de validaciones
    │   └── validations/        # Validaciones de express-validator por entidad
    ├── controllers/            # auth, product, review, entrepreneur, event_location, schedule
    ├── routes/                 # Un router por entidad, todos montados bajo /api
    └── seeders/seed.js         # npm run db:reset
```

**Flujo de una petición:**
1. `authentication` lee el JWT de la cookie.
2. `authorizeRoles(...)` verifica el rol.
3. Las validaciones de express-validator revisan los datos y `checkValidationsResult` corta la petición si hay errores.
4. Cuando hace falta, el middleware de propiedad verifica que el recurso sea del usuario y lo deja en `req.resource`.
5. El controlador hace el trabajo.
6. Cualquier error no controlado termina en el manejador global, que siempre responde en JSON.

**Técnicas destacadas:**
- **Promedio de estrellas:** se calcula con una subconsulta por producto, no con `GROUP BY`, porque MySQL 8 rechaza agrupar cuando la consulta incluye otros modelos (`ONLY_FULL_GROUP_BY`).
- **Filtro por cercanía:** usa la fórmula de Haversine en SQL. La distancia de un producto es la menor entre el local de su emprendedor y cada una de sus ferias.
- **Imágenes:** solo JPG, PNG o WEBP, hasta 5 MB. El nombre del archivo es aleatorio y el archivo se borra al reemplazar la imagen, al quitarla, al borrar el producto o si la validación falla.

---

## 8. Modelo de datos

| Tabla | Campos principales | Relaciones |
|---|---|---|
| `users` | id (UUID), name, email (único), password_hash, role (`consumer` / `entrepreneur` / `admin`) | 1:1 con perfil de emprendedor, 1:N con reseñas |
| `entrepreneur_profiles` | brand_name, biography, whatsapp_number, has_store, store_address, store_latitude, store_longitude | 1:N con productos y horarios, N:M con ferias |
| `event_locations` (ferias) | name, description, latitude, longitude | N:M con emprendedores, 1:N con horarios |
| `entrepreneur_event_locations` | entrepreneur_profile_id, event_location_id (par único) | Tabla intermedia N:M |
| `products` | name, description, price, category, image_url, is_available | Pertenece a un emprendedor, 1:N con reseñas |
| `reviews` | stars (1 a 5), comment, user_id, product_id (par único) | Pertenece a usuario y producto |
| `schedules` (horarios) | start_time, end_time, is_active_now (virtual, se calcula) | Pertenece a emprendedor y feria |

**Categorías de producto:** `alimentos`, `artesanias`, `indumentaria`, `cosmetica` y `otros`.

`sequelize.sync()` crea las tablas que faltan, pero **no modifica las existentes**. Cuando cambian los modelos, cada integrante tiene que correr `npm run db:reset`.

---

## 9. API REST

Todas las rutas empiezan con `/api`. 🔓 = pública, 🔐 = requiere sesión.

| Método y ruta | Acceso | Descripción |
|---|---|---|
| `POST /auth/register` | 🔓 | Registro de consumidor o emprendedor (con local o ferias) |
| `POST /auth/login` | 🔓 | Inicio de sesión: guarda el JWT en la cookie `sessionToken` |
| `POST /auth/logout` | 🔓 | Cierra la sesión |
| `GET /auth/me` | 🔐 | Usuario actual y su perfil de emprendedor |
| `GET /products` | 🔓 | Catálogo: `category`, `available`, `search`, `page`, `limit`, `lat`, `lng`, `radius_km` |
| `GET /products/:id` | 🔓 | Detalle con emprendedor, promedio y comentarios (con el nombre del autor) |
| `POST /products` | 🔐 emprendedor | Publicar (multipart con el campo `image` opcional) |
| `PUT /products/:id` | 🔐 dueño | Editar, reemplazar la imagen o quitarla con `remove_image` |
| `DELETE /products/:id` | 🔐 dueño o admin | Eliminar |
| `POST /products/:id/reviews` | 🔐 consumidor o emprendedor | Calificar (si ya había calificado, se actualiza) |
| `DELETE /reviews/:id` | 🔐 autor o admin | Borrar una calificación |
| `GET /entrepreneurs/:id` | 🔓 | Perfil con sus productos, ferias y próximos horarios |
| `GET /entrepreneurs/stores` | 🔓 | Emprendedores con local y su ubicación |
| `PUT /entrepreneurs/me` | 🔐 emprendedor | Editar el perfil, el local y las ferias |
| `GET /event-locations` y `GET /event-locations/:id` | 🔓 | Ferias y el detalle de cada una |
| `POST`, `PUT`, `DELETE /event-locations` | 🔐 admin | Administrar ferias |
| `GET /schedules` | 🔓 | Agenda (por defecto, lo que todavía no terminó). Filtros: feria, emprendedor, fechas |
| `POST`, `PUT`, `DELETE /schedules` | 🔐 emprendedor dueño | Cargar sus horarios, solo en ferias de su perfil |

Las imágenes se sirven en `/uploads/products/<archivo>` (fuera de `/api`).

---

## 10. Frontend

Hecho con React, Vite y Bootstrap, con la paleta oficial: fucsia `#E3007B`, amarillo `#FFD500`, celeste `#0099A8` y blanco. Incluye foco visible y animaciones que respetan la preferencia de reducir movimiento.

**Páginas:**

| Página | Contenido |
|---|---|
| Inicio | Presentación de la plataforma |
| Catálogo | Filtros, paginación y promedio de estrellas |
| Detalle de producto | Datos del producto, emprendedor y calificaciones |
| Perfil de emprendedor | Sus productos, local o ferias y próximos horarios |
| Mapa | Ferias con horarios próximos y cuáles están en curso |
| Agenda | Calendario de FullCalendar |
| Ingresar y Registro | Acceso y alta de cuenta |
| Mi perfil | Datos de la cuenta y edición del emprendimiento |
| Mi catálogo y editor de producto | Gestión de los productos propios |
| Administración | Ferias y moderación de productos |
| Sin permisos y No encontrado | Páginas de error |

**Organización:**
- **`services/`:** conexión centralizada con la API.
- **`context/AuthContext`:** sesión del usuario.
- **`hooks/`:** estado de las peticiones y los formularios.
- **`lib/`:** constantes, validaciones, formatos y configuración de Leaflet.
- **`components/`:** componentes reutilizables.
- **Carga bajo demanda:** el mapa, la agenda, la administración y el selector de ubicación se descargan recién cuando se usan.

**Mapas:** Leaflet con OpenStreetMap. El selector de ubicación (`LocationPicker`) completa la latitud y la longitud con un clic, en el registro o la edición del emprendimiento y en el alta de ferias.

---

## 11. Seguridad y reglas de negocio

**Contraseñas y sesión**
- Contraseñas con hash de bcrypt: nunca se guardan ni se devuelven en texto plano. Se exigen mínimo 8 caracteres, con mayúscula, minúscula y número.
- El JWT dura 1 hora y viaja en una cookie `httpOnly`, `sameSite=strict` y `secure` en producción.
- El login responde "Credenciales incorrectas" tanto si el email no existe como si la contraseña falla, para no revelar qué cuentas existen.
- El rol viaja dentro del token: si se cambia un rol, se aplica recién con un nuevo inicio de sesión.

**Datos y validaciones**
- No hay credenciales escritas en el código: todo sale de `.env`, que está excluido de git.
- Todo lo que llega del usuario se valida con express-validator, y las validaciones lanzan `throw new Error` y terminan con `return true`, como pide `REGLAS_IA.md`.
- Los errores se registran con `console.error`, y el usuario recibe un mensaje genérico y amigable.
- Las coordenadas que se usan en SQL se validan como números antes de usarse.

**Reglas de la plataforma**
- El registro público solo permite los roles `consumer` y `entrepreneur`. El admin se crea a mano o con el seed.
- Nadie califica sus propios productos, y cada usuario deja una sola calificación por producto.
- Un emprendedor siempre tiene un local o al menos una feria. Solo carga horarios en sus ferias, y el horario tiene que terminar después de empezar y en el futuro.
- El borrado de archivos subidos no puede salirse de la carpeta `uploads/`.

---

## 12. Cómo levantar el proyecto

**Requisitos:** Node.js 20 o más, XAMPP con MySQL encendido y una base de datos creada en phpMyAdmin.

### Backend

```bash
cd server
npm install
# copiar .env.example a .env y completarlo
npm run db:reset   # crea las tablas y carga los datos de demo (BORRA lo que haya)
npm run dev
```

Variables de `server/.env`:

| Variable | Ejemplo o descripción |
|---|---|
| `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST` | Datos de la base en XAMPP (por defecto `root` y contraseña vacía) |
| `DB_DIALECT` | `mysql` |
| `JWT_SECRET` | Una cadena larga y aleatoria |
| `PORT` | `3000` |
| `NODE_ENV` | `development` |
| `CLIENT_URL` | `http://localhost:5173` (origen permitido por CORS) |
| `SEED_PASSWORD` | Contraseña de los usuarios de demo (por ejemplo, `Demo1234`) |

### Frontend

```bash
cd client
npm install
# copiar .env.example a .env
npm run dev        # http://localhost:5173
```

Variable de `client/.env`: `VITE_API_URL=http://localhost:3000/api`.

Después de cambiar un `.env` hay que reiniciar el servidor correspondiente, porque se lee solo al arrancar. `npm run db:reset` hace falta solo cuando cambian los modelos.

---

## 13. Datos de demostración y usuario administrador

`npm run db:reset` carga datos **inventados** con contexto formoseño. Todas las cuentas usan la contraseña `SEED_PASSWORD`.

| Rol | Cuentas |
|---|---|
| Admin | `admin@example.com` |
| Consumidores | `lucia@`, `martin@`, `sofia@`, `nicolas@`, `valentina@example.com` |
| Emprendedores | `mieles@`, `cesteria@`, `chaguar@`, `cosmetica@`, `chipa@`, `dulces@`, `textil@`, `huerta@`, `madera@example.com` |

**Contenido cargado:**
- **Ferias:** Paseo Ferroviario, Costanera Vuelta Fermoza, Plaza San Martín, Feria PAIPPA de Pequeños Productores y Feria Franca Barrio San Miguel. Las coordenadas son **aproximadas**.
- **Emprendimientos:** 9 (miel de monte, cestería qom, tejido wichí en chaguar, cosmética natural, chipá, dulces regionales, ñandutí, huerta de Colonia Pastoril y palo santo). 4 tienen local propio.
- **Productos y calificaciones:** 33 productos, algunos sin stock, y 32 calificaciones.
- **Horarios:** 20. Dos están "en curso" en el momento de correr el seed. Conviene volver a correrlo el día de la demo.

### Convertir una cuenta propia en administrador

1. Registrate desde la app. La contraseña queda guardada como hash, por eso no sirve insertar la fila a mano.
2. En phpMyAdmin (http://localhost/phpmyadmin), en la pestaña **SQL** de tu base, ejecutá:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'tu_email@ejemplo.com';
   ```
3. Cerrá sesión y volvé a entrar.

---

## 14. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| Marcas de agua (`Co-Authored-By`) en commits | Se reescribieron los commits locales sin cambiar el código |
| Un índice único autogenerado superaba los 64 caracteres de MySQL | Se le puso un nombre corto (`uniqueKey`) a la relación N:M |
| MySQL 8 rechazaba `GROUP BY` al calcular promedios | Se calculan con subconsultas por producto |
| `.bail()` no cortaba la validación cuando iba combinado con `.if()` en express-validator | Se dejó un solo validador por campo, con un mensaje combinado |
| En Windows, `path.isAbsolute("/uploads/...")` da `true` y no se borraban las imágenes viejas | Se detecta primero el prefijo público `/uploads/` |
| `nodemailer` 7 tenía vulnerabilidades | Se usó la versión 10 (y después se eliminó junto con la verificación) |
| `sequelize.sync()` no actualiza tablas que ya existen | Script `npm run db:reset` para recrear el esquema |
| `vite` "no se reconoce como comando" | Faltaba `npm install` en `client` (`node_modules` no se sube al repo) |
| El mapa no aparecía | Faltaba la clave de Google Maps, y además la clase CSS del contenedor no coincidía. Se migró a Leaflet y se corrigió la clase |
| Los `git rm` ya preparados se colaban en el commit siguiente | Se rehicieron esos commits locales separando bien los archivos |

---

## 15. Pendientes y próximos pasos

**Antes de la demo o entrega**
- [ ] Subir las ramas a GitHub (`develop`, `feature/integracion-mvp`) e integrar a `develop` y luego a `main`.
- [ ] Cada integrante: `npm install` en `server` y `client`, completar los `.env` y correr `npm run db:reset`.
- [ ] Revisar y reemplazar las **coordenadas aproximadas** de las ferias del seed por las reales.
- [ ] Correr `npm run db:reset` el día de la demo, así los horarios "en curso" coinciden con la fecha.
- [ ] Borrar la rama local `backup/registro-y-login-antes-de-limpiar`, que ya no hace falta.

**Documentación**
- [ ] Actualizar `REGLAS_IA.md` (línea "Idioma del código"): los comentarios internos van en español.
- [ ] Actualizar el `README.md`, porque su estructura de carpetas es la del inicio del proyecto y ya no coincide.

**Mejoras posibles**
- Fotos en las calificaciones y varias imágenes por producto.
- Pestaña de favoritos, notificaciones y alertas por cercanía (estaban en la lluvia de ideas y quedaron fuera del sprint).
- Proveedor de mapas propio si la plataforma crece: los mapas públicos de OpenStreetMap son para uso moderado.
- Límite de intentos de login y verificación de email opcional, si en el futuro se necesita.
- Aviso de npm: `npm audit` marca un aviso moderado en `uuid`, que viene de Sequelize y no afecta el uso actual.
