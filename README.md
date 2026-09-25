# Bkrypt - FormoBuy

Plataforma que conecta a los emprendedores de Formosa Capital con los consumidores: catálogo de productos, buscador con filtros, mapa de ferias, agenda de eventos, opiniones y registro con selección de rol.

**Backend:** Express + Sequelize (MySQL/MariaDB) · **Frontend:** React + Vite + Bootstrap 5.3

---

## Estructura del proyecto

```
bkrypt/
├── server/                              Backend (Express + Sequelize, ES Modules)
│   ├── app.js                           Punto de entrada: middlewares globales, rutas y arranque
│   ├── seed.js                          Datos de demostración (node seed.js [--reset])
│   ├── thunder-tests/                   Colección y entorno de pruebas de Thunder Client
│   └── src/
│       ├── config/                      Conexión a la base (database.js) y envío de correos (mailer.js)
│       ├── models/                      Modelos Sequelize y relaciones (relations.js)
│       ├── controllers/                 Lógica de cada recurso (try/catch obligatorio)
│       ├── routes/                      Rutas REST; admin.routes.js se monta en /api/admin
│       ├── middlewares/                 Autenticación, políticas de acceso por rol, propiedad
│       │   └── validations/             Reglas de express-validator por recurso
│       └── helpers/                     JWT, bcrypt, correos, distancia (Haversine), eventos
│
└── client/                              Frontend (React + Vite)
    ├── index.html
    └── src/
        ├── main.jsx / App.jsx           Entrada y rutas
        ├── context/                     Sesión del usuario (AuthContext)
        ├── services/                    Única capa que habla con la API (fetch centralizado)
        ├── hooks/                       Lógica de datos y formularios (una responsabilidad por hook)
        ├── components/                  Un componente por archivo
        ├── pages/                       Vistas
        ├── lib/                         Constantes, formatos, validaciones, formularios
        └── styles/                      theme.css (paleta), base, motion, components, calendar
```

---

## Roles y permisos

| Rol | Quién es | Qué puede hacer |
| :-- | :-- | :-- |
| **Administrador** | El creador de la plataforma. Se define con `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el `.env`; ninguna ruta pública crea ni promueve administradores. | Aprobar o rechazar solicitudes de emprendedor y de presencia, habilitar eventos y ubicaciones de ferias, moderar opiniones reportadas. |
| **Emprendedor** | Cuenta cuya solicitud aprobó el administrador. | Gestionar su catálogo y su perfil, solicitar presencia en eventos habilitados, reportar opiniones de su muro. |
| **Consumidor** | Toda cuenta nueva (también quien pidió ser emprendedor, mientras la solicitud está pendiente). | Ver e interactuar: buscar, contactar, opinar (con correo verificado) y pedir el cambio a emprendedor. No modifica información ajena. |

**Regla transversal:** toda ruta protegida valida el rol en el backend, nunca solo ocultando el botón en el frontend. Cada ruta declara una política de `src/middlewares/access.middleware.js` (`requireAdmin`, `requireEntrepreneur`, `requireConsumer`, `requireMember`) y el enrutador `/api/admin` aplica `requireAdmin` una sola vez para todas sus rutas. El rol se lee de la base en cada petición: una aprobación rige al instante, sin volver a iniciar sesión. En el frontend, las vistas protegidas piden sus datos al backend y, si responde 403, redirigen a `/sin-permisos`.

---

## Decisiones técnicas

| Tema | Decisión |
| :-- | :-- |
| Correo electrónico | **Nodemailer + Gmail SMTP** (`smtp.gmail.com:465`) con una [contraseña de aplicación](https://myaccount.google.com/apppasswords). Si faltan las variables SMTP, los correos se muestran en la consola del servidor (modo desarrollo). El correo es una notificación complementaria: la solicitud de emprendedor siempre se guarda en la tabla `entrepreneur_requests`. |
| Verificación de correo | Enlace con token (24 h). Se exige correo verificado para publicar opiniones y para que el administrador apruebe a un emprendedor. |
| Mapa | Google Maps con `@react-google-maps/api`. Clave en `VITE_GOOGLE_MAPS_API_KEY`. El mapa se memoiza y no se vuelve a crear en cada render. Sin clave, la página sigue funcionando con la lista de eventos. |
| Calendario | FullCalendar 6 (vista mensual en escritorio, vista de lista en móvil, idioma español). |
| Cercanía | Distancia calculada en el backend con la fórmula de Haversine (local, ferias habituales y eventos confirmados de cada emprendedor). |
| Contraseña | Mínimo 8 caracteres con mayúscula, minúscula y número (REGLAS_IA.md no define un valor). |
| Tipografía, espaciado, texto y estados | REGLAS_IA.md solo define la paleta: se usan la tipografía y la escala de espaciado nativas de Bootstrap, su color de texto por defecto y sus colores `danger`/`success`. El celeste no se usa como color de texto de cuerpo porque sobre blanco no alcanza el contraste AA (3.4:1). |

### Cambios en el modelo de datos

- `products.stock` reemplaza a `is_available`, que ahora se calcula (`stock > 0`).
- `users.name` es el nombre visible en las opiniones.
- `entrepreneur_profiles` suma correo de contacto e Instagram/Facebook.
- Nuevas tablas: `entrepreneur_requests`, `events`, `presence_requests` y `opinions`.
- `schedules` se eliminó: la reemplazan `events` y `presence_requests`.

`sequelize.sync()` no altera tablas existentes: si ya tenías la base creada, recreala (`node seed.js --reset` en desarrollo).

---

## Instalación y ejecución

**Requisitos:** Node.js 20 o superior, MySQL 8 o MariaDB 10.4 (XAMPP).

```bash
# Backend
cd server
npm install
cp .env.example .env          # completar las variables (ver tabla)
node seed.js --reset          # opcional: crea las tablas y carga datos de demostración
npm run dev                   # http://localhost:3000 si PORT=3000

# Frontend
cd client
npm install
cp .env.example .env
npm run dev                   # http://localhost:5173
```

### Variables de entorno del servidor (`server/.env`)

| Variable | Ejemplo | Uso |
| :-- | :-- | :-- |
| `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_DIALECT` | `bkrypt_db`, `root`, ``, `localhost`, `mysql` | Conexión a la base |
| `DB_PORT` | `3306` | Opcional |
| `JWT_SECRET` | cadena larga y aleatoria | Firma de sesiones y enlaces de verificación |
| `PORT` | `3000` | Puerto del servidor |
| `CLIENT_URL` | `http://localhost:5173` | CORS y enlaces de los correos |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | | Cuenta del administrador, se crea al arrancar si no existe |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | `smtp.gmail.com`, `465`, cuenta Gmail, contraseña de aplicación | Envío de correos |

### Variables del frontend (`client/.env`)

| Variable | Uso |
| :-- | :-- |
| `VITE_API_URL` | URL base de la API (por defecto `http://localhost:3000/api`) |
| `VITE_GOOGLE_MAPS_API_KEY` | Clave de Google Maps JavaScript API (no se sube al repositorio) |

### Cuentas de demostración (`node seed.js`)

Contraseña de todas: `Demo1234`. `consumidora.demo@formobuy.local` (consumidora), `emprendedora.demo@formobuy.local` y `emprendedor.demo@formobuy.local` (emprendedores), `solicitante.demo@formobuy.local` (consumidora con solicitud pendiente). Las ubicaciones de ferias son aproximadas.

---

## API

Todas las rutas empiezan con `/api`. La sesión viaja en la cookie `sessionToken` (httpOnly); para pruebas también se acepta `Authorization: Bearer <token>`. Los errores de validación responden `400` con `{ message, errors: [{ field, message }] }`.

| Método y ruta | Acceso | Validaciones principales (express-validator) |
| :-- | :-- | :-- |
| `POST /auth/register` | Público | Nombre 2-60; email con formato válido y no registrado (mensaje que no revela el rol); contraseña de 8 o más con mayúscula, minúscula y número; rol `consumer` o `entrepreneur`. Si es emprendedor, formulario extendido. |
| `POST /auth/login` · `POST /auth/logout` | Público | Email con formato válido, contraseña obligatoria |
| `POST /auth/verify-email` | Público | Token obligatorio, emitido para verificación |
| `GET /auth/me` · `POST /auth/resend-verification` | Sesión | |
| `POST /auth/entrepreneur-request` | Consumidor | Formulario extendido: nombre del emprendimiento 2-100; al menos WhatsApp (8-15 dígitos) o correo; URLs de redes con http(s); si tiene local, dirección y coordenadas; si no, al menos una feria existente |
| `GET /products` · `GET /products/:id` | Público | Categoría del ENUM, disponibilidad booleana, id UUID |
| `GET /products/search` | Público | `category`, `search`, `available`, `lat` (-90 a 90) y `lng` (-180 a 180) juntos, `radius` (0-100 km, requiere ubicación) |
| `POST /products` · `PUT /products/:id` · `DELETE /products/:id` | Emprendedor dueño | Precio mayor a 0; stock entero mayor o igual a 0; categoría válida; imagen con URL http(s) |
| `GET /entrepreneurs/me` · `PUT /entrepreneurs/me` | Emprendedor | Formulario extendido |
| `GET /entrepreneurs/:id` · `GET /entrepreneurs/:id/opinions` | Público | id UUID |
| `POST /entrepreneurs/:id/opinions` | Consumidor o emprendedor con correo verificado (no sobre sí mismo) | Puntaje entero 1-5; comentario 3-500 caracteres |
| `POST /opinions/:id/report` | Emprendedor dueño del muro | Motivo 5-255 caracteres |
| `GET /events` · `GET /events/:id` | Público (lo visible depende del rol) | id UUID |
| `POST /events` · `DELETE /events/:id` | Administrador | Nombre 3-100; ubicación existente; inicio futuro; fin posterior al inicio |
| `POST /events/:id/presence-requests` | Emprendedor | Evento existente y no finalizado; una solicitud por evento |
| `GET /event-locations` | Público | |
| `POST /event-locations` · `PUT` · `DELETE /event-locations/:id` | Administrador | Nombre 2-100; latitud y longitud en rango |
| `GET /admin/entrepreneur-requests` · `PATCH /admin/entrepreneur-requests/:id` | Administrador | Estado `approved` o `rejected`; motivo opcional de hasta 500 caracteres |
| `GET /admin/presence-requests` · `PATCH /admin/presence-requests/:id` | Administrador | Estado `approved` o `rejected` |
| `GET /admin/opinions/reported` · `PATCH /admin/opinions/:id/dismiss-report` · `DELETE /admin/opinions/:id` | Administrador | id UUID |

---

## Pruebas con Thunder Client

La colección `server/thunder-tests/thunder-collection_formobuy-api.json` contiene 177 peticiones con 348 aserciones en 8 carpetas. Cubren cada endpoint y sus estados: éxito, validación por campo (400), sin sesión (401), rol incorrecto (403), inexistente (404) y conflicto (409). Los endpoints críticos (login, cambio de rol y creación de producto) tienen cada uno varios casos.

1. Levantar el servidor y cargar los datos: `node seed.js --reset`. Algunas pruebas usan el estado inicial del seed, así que conviene resetear antes de cada corrida completa.
2. En Thunder Client: **Collections → menú → Import** y elegir el archivo de la colección. En **Env → Import**, elegir `thunder-environment_formobuy-local.json`.
3. Activar el entorno **FormoBuy Local** y completar `adminEmail` y `adminPassword` con los valores del `.env`.
4. Ejecutar la colección completa con **Run All**, en orden. La carpeta `00` inicia sesión con cada rol y guarda los tokens que usan las demás.

---

## Convenciones

- Código en inglés; textos de la interfaz y mensajes en español; ES Modules en todo el proyecto.
- Commits con prefijo (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `style:`) y verbo impersonal (ver `REGLAS_IA.md`).
- Estilos solo con los colores de `REGLAS_IA.md` (definidos una vez en `client/src/styles/theme.css`), sin `!important` ni estilos embebidos. Las animaciones duran entre 150 y 400 ms, animan `transform` y `opacity`, y se desactivan con "reducir movimiento".

---

## Información del proyecto

- **Autor:** Bautista Berenfeld
- **Email:** bbautista2026ipf@gmail.com
- **Institución:** Instituto Politécnico Formosa

## Licencia

ISC
