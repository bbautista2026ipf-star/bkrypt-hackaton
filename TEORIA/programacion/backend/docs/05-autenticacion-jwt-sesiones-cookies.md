---
doc_id: autenticacion-jwt-sesiones-cookies
institucion: Instituto Politécnico Formosa
carrera: Tecnicatura en Desarrollo de Software Multiplataforma
materia: Taller de Lenguaje de Programación I
unidad: "Unidad 4 — Programación del Lado del Servidor y Persistencia de Datos"
tema: "Autenticación y autorización de usuarios con JWT, sesiones y cookies"
fuentes_origen:
  - "Autenticación y autorización de usuarios con JWT, sesiones y cookies.pdf"
relacion_con_otros_docs: >
  Usa modelos y Eager Loading de docs-ia/database/03-sequelize-relaciones.md (UserModel + PersonModel).
  Las rutas y controladores deberían validarse primero con
  docs-ia/backend/04-express-validator.md. El frontend con fetch se conecta con un cliente
  React como el de docs-ia/react/06-integracion-backend-api.md (agregando `credentials: "include"`
  para que las cookies viajen).
nivel: intermedio-avanzado
---

# Autenticación y Autorización de Usuarios con JWT, Sesiones y Cookies

## Índice

1. [Conceptos fundamentales](#1-conceptos-fundamentales)
2. [JWT (JSON Web Token)](#2-jwt-json-web-token)
3. [Instalaciones necesarias](#3-instalaciones-necesarias)
4. [Utilidades JWT (generar y verificar token)](#4-utilidades-jwt-generar-y-verificar-token)
5. [Configuración del servidor Express](#5-configuración-del-servidor-express)
6. [Flujo completo de autenticación con cookies](#6-flujo-completo-de-autenticación-con-cookies)
7. [Frontend: consumir la API con JWT en cookies](#7-frontend-consumir-la-api-con-jwt-en-cookies)
8. [Seguridad de contraseñas con bcrypt](#8-seguridad-de-contraseñas-con-bcrypt)
9. [Implementación completa con bcrypt](#9-implementación-completa-con-bcrypt)

---

## 1. Conceptos fundamentales

### 1.1 Autenticación

**Definición:** proceso mediante el cual un sistema verifica la identidad de un usuario, confirmando que es quien afirma ser.

**Proceso:** el usuario presenta credenciales (usuario y contraseña) y el sistema las valida contra información almacenada previamente.

**Métodos comunes:** credenciales de usuario/contraseña, tokens de autenticación, certificados digitales, biometría, autenticación de dos factores (2FA).

### 1.2 Autorización

**Definición:** proceso que determina qué recursos o acciones puede realizar un usuario **ya autenticado** dentro del sistema.

**Diferencia clave:** la autenticación responde "¿quién eres?"; la autorización responde "¿qué puedes hacer?".

### 1.3 Cookies

**Definición:** pequeños archivos de texto que el servidor envía al navegador y que este almacena y reenvía automáticamente en requests posteriores.

**Atributos importantes de las cookies de sesión:**

| Atributo             | Función                                                      |
| -------------------- | ------------------------------------------------------------ |
| `HttpOnly`           | Previene el acceso desde JavaScript (protección contra XSS). |
| `Secure`             | Solo se envía por conexiones HTTPS.                          |
| `SameSite`           | Controla cuándo se envía la cookie (protección contra CSRF). |
| `MaxAge` / `Expires` | Define cuándo expira la cookie.                              |

## 2. JWT (JSON Web Token)

### 2.1 Definición

**JWT** es un estándar abierto (**RFC 7519**) que define una forma compacta y segura de transmitir información entre partes como un objeto JSON. La información se puede verificar y confiar porque está firmada digitalmente.

### 2.2 Estructura de un JWT

Un JWT consiste en **tres partes** codificadas en Base64 y separadas por puntos:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o
```

| #   | Parte         | Contenido                                                                                                              |
| --- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | **Header**    | `{ "alg": "HS256", "typ": "JWT" }` — algoritmo de firma y tipo de token.                                               |
| 2   | **Payload**   | `{ "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }` — los datos (_claims_) que se transmiten.             |
| 3   | **Signature** | `HMACSHA256(BASE64URL(header) + "." + BASE64URL(payload), secret)` — firma que garantiza que el token no fue alterado. |

## 3. Instalaciones necesarias

```bash
# Para manejar JSON Web Tokens
npm install jsonwebtoken

# Para leer cookies del navegador
npm install cookie-parser

# Para hashear contraseñas de forma segura
npm install bcryptjs
```

**Variables de entorno (`.env`):**

```
# Clave secreta para firmar JWT
JWT_SECRET=mi_clave_jwt_super_secreta_2024
```

## 4. Utilidades JWT (generar y verificar token)

```javascript
// helpers/jwt.helper.js
import jwt from "jsonwebtoken";

// Generar token
export const generateToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token válido por 1 hora
      // expiresIn: process.env.JWT_EXPIRES, // Alternativa desde .env
    });
  } catch (error) {
    throw new Error("Error generando el token: " + error.message);
  }
};

// Verificar token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Error verificando el token: " + error.message);
  }
};
```

**Explicación de las funciones:**

- **`generateToken()`**: crea un JWT firmado con la información del usuario.
- **`verifyToken()`**: verifica la firma del token y devuelve el payload decodificado.
- Ambas funciones incluyen manejo de errores con `try-catch`.
- Usan la clave secreta desde variables de entorno (`process.env.JWT_SECRET`).

## 5. Configuración del servidor Express

```javascript
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // CRUCIAL: permitir cookies
  }),
);
app.use(cookieParser()); // NECESARIO: para leer req.cookies
```

## 6. Flujo completo de autenticación con cookies

### 6.1 Controlador de login (versión básica)

```javascript
export const login = async (req, res) => {
  const { username, password } = req.body;

  // Buscar usuario en base de datos
  const user = await UserModel.findOne({
    where: { username, password },
    include: {
      model: PersonModel,
      attributes: ["name", "lastname"],
      as: "person",
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Generar JWT
  const token = generateToken({
    id: user.id,
    name: user.person.name,
    lastname: user.person.lastname,
  });

  // Enviar token como cookie
  res.cookie("token", token, {
    httpOnly: true, // No accesible desde JavaScript
    maxAge: 1000 * 60 * 60, // 1 hora
  });

  return res.json({ message: "Login exitoso" });
};
```

> Esta versión básica compara la contraseña en texto plano contra la base de datos. En la sección 9 se muestra la versión correcta, verificando el hash con **bcrypt**.

### 6.2 Opciones de `res.cookie()`

```javascript
res.cookie("token", token, {
  httpOnly: true, // No accesible desde JavaScript (previene XSS)
  secure: false, // true en producción con HTTPS
  sameSite: "strict", // Control cross-site: "strict", "lax", "none"
  maxAge: 3600000, // Tiempo de vida en milisegundos
  path: "/", // Ruta donde es válida la cookie
  domain: ".mi-app.com", // Dominio donde es válida
});
```

### 6.3 Middleware de autenticación

```javascript
export const authMiddleware = (req, res, next) => {
  try {
    // Obtener token de la cookie
    const token = req.cookies["token"];

    if (!token) {
      return res.status(401).json({ message: "No autenticado" });
    }

    // Verificar y decodificar token
    const decoded = verifyToken(token);

    // Almacenar datos del usuario
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
```

### 6.4 Rutas protegidas

```javascript
import { Router } from "express";
import { login, profile } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRoutes = Router();

// Ruta pública
authRoutes.post("/login", login);

// Ruta protegida - requiere token válido
authRoutes.get("/profile", authMiddleware, profile);
```

### 6.5 Controlador de perfil

```javascript
export const profile = (req, res) => {
  return res.json({
    user: {
      id: req.user.id, // Datos extraídos del token
      name: req.user.name,
      lastname: req.user.lastname,
    },
  });
};
```

### 6.6 Logout

```javascript
export const logout = (req, res) => {
  res.clearCookie("token"); // Eliminar cookie del navegador
  return res.json({ message: "Logout exitoso" });
};
```

## 7. Frontend: consumir la API con JWT en cookies

### 7.1 Función de login

```javascript
export async function login(username, password) {
  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // CRUCIAL: para recibir cookies
    body: JSON.stringify({ username, password }),
  });

  return await response.json();
}
```

### 7.2 Acceder a rutas protegidas

```javascript
export async function getProfile() {
  const response = await fetch("http://localhost:3000/api/profile", {
    credentials: "include", // CRUCIAL: enviar cookie automáticamente
  });

  return await response.json();
}
```

## 8. Seguridad de contraseñas con bcrypt

### 8.1 ¿Por qué necesitamos hashear contraseñas?

**Nunca** se debe almacenar contraseñas en texto plano en la base de datos. Si alguien accede a la base de datos, tendría todas las contraseñas de los usuarios. El **hasheo** convierte la contraseña en una cadena irreversible.

### 8.2 Diferencia entre hasheo, encriptación y codificación

| Técnica           | Dirección                                                   | Requiere clave                             | Uso típico                                           | Ejemplos                            |
| ----------------- | ----------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------- | ----------------------------------- |
| **Hasheo (hash)** | Unidireccional (no se puede obtener el original)            | No requiere clave para verificar           | Contraseñas                                          | bcrypt, SHA-256, Argon2             |
| **Encriptación**  | Bidireccional (se puede desencriptar con la clave correcta) | Requiere clave secreta                     | Proteger datos que se necesitan recuperar después    | AES, RSA                            |
| **Codificación**  | Bidireccional (se puede decodificar fácilmente)             | No requiere clave, solo conocer el formato | Transformar datos a un formato estándar transmisible | Base64, Base32, URL encoding, UTF-8 |

Nota: el hasheo siempre produce el mismo resultado para el mismo input.

### 8.3 ¿Qué es bcrypt?

**bcrypt** es un algoritmo de hasheo diseñado específicamente para contraseñas que:

- Incluye **salt** automáticamente (evita ataques de _rainbow table_).
- Es **lento por diseño** (dificulta ataques de fuerza bruta).
- Permite ajustar el **costo computacional** (`saltRounds`).

### 8.4 `bcrypt` vs. `bcryptjs`

|                | `bcrypt` (C/C++)                  | `bcryptjs` (JavaScript puro)                    |
| -------------- | --------------------------------- | ----------------------------------------------- |
| Implementación | Original, en C/C++                | Reimplementación completa en JavaScript         |
| Rendimiento    | Más rápido                        | Ligeramente más lento, pero más portable        |
| Instalación    | Puede requerir compilación nativa | Más fácil de instalar (no requiere compilación) |
| Compatibilidad | —                                 | Misma funcionalidad y compatibilidad            |

## 9. Implementación completa con bcrypt

### 9.1 Utilitarios para bcrypt

```javascript
// helpers/bcrypt.helper.js
import bcrypt from "bcrypt";

// Hashear contraseña
export const hashPassword = async (password) => {
  const saltRounds = 10; // Entre 10-12 es recomendado
  return await bcrypt.hash(password, saltRounds);
};

// Verificar contraseña
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
```

### 9.2 Registro con bcrypt

```javascript
import { hashPassword } from "../helpers/bcrypt.helper.js";

export const register = async (req, res) => {
  try {
    const { name, lastname, username, email, password } = req.body;

    // 1. Hashear la contraseña ANTES de guardar
    const hashedPassword = await hashPassword(password);

    // 2. Crear persona
    const persona = await PersonModel.create({
      name,
      lastname,
    });

    // 3. Crear usuario con contraseña hasheada
    await UserModel.create({
      username,
      email,
      password: hashedPassword, // ← Guardamos el hash, NO la contraseña original
      person_id: persona.dataValues.id,
    });

    return res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al registrar usuario", error });
  }
};
```

### 9.3 Login con verificación bcrypt (versión correcta)

```javascript
import { comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  // 1. Buscar usuario en la base de datos
  const user = await UserModel.findOne({
    where: { username }, // Solo buscamos por username
    include: {
      model: PersonModel,
      attributes: ["name", "lastname"],
      as: "person",
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // 2. Comparar contraseña ingresada con hash almacenado
  const validPassword = await comparePassword(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // 3. Si la contraseña es correcta, generar JWT
  const token = generateToken({
    id: user.id,
    name: user.person.name,
    lastname: user.person.lastname,
  });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hora
  });

  return res.json({ message: "Login exitoso" });
};
```

### 9.4 Factor de costo (`saltRounds`)

El **`saltRounds`** determina qué tan costoso computacionalmente es el hasheo:

```javascript
// Diferentes niveles de seguridad
const saltRounds = 8; // Rápido, menos seguro
const saltRounds = 10; // Balanceado (recomendado)
const saltRounds = 12; // Muy seguro, más lento
const saltRounds = 15; // Extremadamente seguro, muy lento
```

**Recomendación:** usar entre 10 y 12 para un balance entre seguridad y rendimiento.

---

**Relación con otros documentos:** las validaciones de `username`/`password`/`email` en `register`/`login` deberían implementarse con los middlewares de `docs-ia/backend/04-express-validator.md` antes de llegar a la lógica descrita aquí. El `include: { model: PersonModel, as: "person" }` usado en `login` es una aplicación directa del Eager Loading explicado en `docs-ia/database/03-sequelize-relaciones.md`, sección 3.3.
