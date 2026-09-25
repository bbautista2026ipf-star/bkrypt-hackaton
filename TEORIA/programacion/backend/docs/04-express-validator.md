---
doc_id: express-validator
institucion: Instituto Politécnico Formosa
carrera: Tecnicatura en Desarrollo de Software Multiplataforma
materia: Taller de Lenguaje de Programación I
unidad: "Unidad 4 — Programación del Lado del Servidor y Persistencia de Datos"
tema: "Validación y saneamiento de datos en Express con express-validator"
fuentes_origen:
  - "Express Validator.pdf"
relacion_con_otros_docs: >
  Se apoya en el concepto de middleware descrito aquí mismo y en Node/Express
  (docs-ia/backend/00-nodejs-introduccion.md). El patrón de validación se puede combinar con
  docs-ia/backend/05-autenticacion-jwt-sesiones-cookies.md (validar body antes de login/registro)
  y con docs-ia/database/03-sequelize-relaciones.md (validar antes de crear registros relacionados).
nivel: intermedio
---

# Express Validator

## Índice

1. [Datos del lado del servidor](#1-datos-del-lado-del-servidor)
2. [Middlewares](#2-middlewares)
3. [express-validator y sus ventajas](#3-express-validator-y-sus-ventajas)
4. [Uso básico con `body()`](#4-uso-básico-con-body)
5. [Validando errores con `validationResult()`](#5-validando-errores-con-validationresult)
6. [Middleware personalizado para validaciones](#6-middleware-personalizado-para-validaciones)
7. [Validaciones múltiples y concatenadas](#7-validaciones-múltiples-y-concatenadas)
8. [Organizando validaciones en arrays y con `checkSchema`](#8-organizando-validaciones-en-arrays-y-con-checkschema)
9. [Método `matchedData()`](#9-método-matcheddata)
10. [Método `.custom()`](#10-método-custom)
11. [Manejo avanzado de errores](#11-manejo-avanzado-de-errores)

---

## 1. Datos del lado del servidor

A la hora de trabajar con datos por parte del servidor, es importante tener ciertas consideraciones para que el tratamiento de dichos datos sea el más adecuado, ya que estas consideraciones solo son aplicables al lado del servidor. Los datos que se proveen al servidor en la mayoría de los casos forman parte de la información que se guardará en la base de datos, por lo que es fundamental tener presentes los siguientes conceptos:

### 1.1 Integridad de los datos

Se refiere a la **precisión, coherencia y confiabilidad** de la información almacenada en una aplicación. Es esencial porque los datos incorrectos o maliciosamente manipulados pueden tener consecuencias graves: pérdida de confianza de los usuarios, toma de decisiones erróneas y daños a la reputación de la empresa. Garantizar la integridad implica **validar y sanear** las entradas de los usuarios para asegurarse de que cumplan con ciertos criterios y restricciones antes de ser almacenadas o procesadas.

### 1.2 Mantenimiento simplificado

El mantenimiento de una aplicación es crítico para su éxito a largo plazo. Un código limpio y organizado facilita agregar nuevas características, corregir errores y realizar actualizaciones. Si la validación y el saneamiento de datos se manejan de manera fragmentada en distintas partes de la aplicación, el mantenimiento puede volverse complicado y propenso a errores. Un enfoque estructurado, como `express-validator`, ayuda a mantener un código más claro y coherente, simplificando el mantenimiento y mejorando la escalabilidad.

## 2. Middlewares

Un **middleware** es una función que se ejecuta durante el recorrido de una petición HTTP, antes de que dicha petición llegue al controlador o función que genera la respuesta final. Se utilizan para tareas intermedias como:

- Validar datos.
- Verificar autenticación.
- Comprobar permisos.
- Registrar peticiones.
- Manejar errores.

Generalmente reciben los parámetros **`req`, `res` y `next`**:

```javascript
const middleware = (req, res, next) => {
  // Lógica del middleware

  next();
};
```

La función `next()` permite continuar con la lógica del siguiente middleware o controlador. **Express Validator** utiliza justamente este mecanismo, permitiendo ejecutar validaciones como middlewares antes de que los datos lleguen al controlador.

## 3. express-validator y sus ventajas

`express-validator` es una biblioteca de validación y saneamiento de datos diseñada específicamente para aplicaciones web basadas en Express.

| Ventaja                        | Descripción                                                                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Seguridad mejorada**         | Permite validar los datos de entrada y prevenir ataques maliciosos (inyecciones SQL, XSS), asegurando que los datos cumplan los requisitos antes de ser procesados. |
| **Integridad de los datos**    | La validación precisa ayuda a mantener la calidad y confiabilidad de los datos almacenados.                                                                         |
| **Experiencia del usuario**    | Mensajes claros de error guían al usuario a corregir sus entradas, reduciendo la frustración.                                                                       |
| **Mantenimiento simplificado** | Permite centralizar y estandarizar la lógica de validación, facilitando el mantenimiento y la expansión futura.                                                     |
| **Facilidad de uso**           | Sintaxis simple y expresiva para definir reglas de validación e integrarlas en rutas y controladores existentes.                                                    |
| **Prevención de errores**      | Garantiza que los datos cumplan los requisitos antes de ser procesados, previniendo errores y excepciones inesperadas.                                              |

### 3.1 Instalación

```bash
npm install express-validator
```

## 4. Uso básico con `body()`

Una de las formas más fáciles de usar `express-validator` es aplicar la funcionalidad **`body`**, que sirve para validar los datos que provienen de `request.body` (`req.body`), es decir, los datos de entrada del cuerpo de la petición.

Se utiliza directamente como un middleware y es una función que recibe como parámetro el nombre del campo a validar:

```javascript
import { body } from "express-validator";

app.post("/users", body("email"), controller);
```

Se pueden concatenar validaciones, como que el campo no esté vacío con `.notEmpty()`:

```javascript
app.post("/users", body("email").notEmpty(), controller);
```

Y agregar un mensaje personalizado de error con `.withMessage()`:

```javascript
app.post(
  "/users",
  body("email").notEmpty().withMessage("Email is required"),
  controller,
);
```

## 5. Validando errores con `validationResult()`

Para comprobar si existen errores en el `body`, se utiliza la función **`validationResult`**, que recibe la `request` de la petición. Se puede usar en el mismo controlador para controlar la respuesta del servidor cuando existan errores, con el método **`isEmpty()`**:

```javascript
import { validationResult } from "express-validator";

const controller = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  res.status(200).send("User created successfully");
};
```

En caso de error, la respuesta tendría esta forma:

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

## 6. Middleware personalizado para validaciones

Dado que la lógica de comprobar errores se repetiría en demasiados controladores, conviene extraerla a un middleware personalizado:

```javascript
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next();
};
```

Y así se utiliza en las rutas necesarias, sin repetir el código dentro del controlador:

```javascript
app.post(
  "/users",
  body("email").notEmpty().withMessage("Email is required"),
  validate,
  controller,
);
```

## 7. Validaciones múltiples y concatenadas

Se pueden concatenar varias reglas sobre un mismo campo (por ejemplo, que no esté vacío **y** que sea un email válido):

```javascript
app.post(
  "/users",
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  validate,
  controller,
);
```

Y agregar validaciones para múltiples campos:

```javascript
app.post(
  "/users",
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),
  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 8 })
    .withMessage("Phone must be at least 8 characters"),
  validate,
  controller,
);
```

## 8. Organizando validaciones en arrays y con `checkSchema`

Escribir todas las validaciones dentro de la ruta puede ensuciarla. Hay dos formas de extraerlas.

### 8.1 Primera forma: array de validaciones

Se definen las validaciones dentro de un array y se pasa ese array a la ruta como si fuese un middleware:

```javascript
const validations = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),
  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 8 })
    .withMessage("Phone must be at least 8 characters"),
];
```

```javascript
app.post("/users", validations, validate, controller);
```

### 8.2 Segunda forma: `checkSchema`

`express-validator` provee un método especial llamado **`checkSchema`**:

```javascript
import { checkSchema } from "express-validator";

const validations2 = checkSchema({
  email: {
    notEmpty: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Email must be valid" },
  },
  password: {
    notEmpty: { errorMessage: "Password is required" },
    isLength: {
      errorMessage: "Password must be at least 8 characters",
      options: { min: 8 },
    },
  },
  // rest of validations
});
```

```javascript
app.post("/users", validations2, validate, controller);
```

Con este método las rutas quedan mucho más limpias y ordenadas, ya que el middleware de verificación de errores, el controlador y las validaciones se pueden crear en otros archivos e importar donde sea necesario.

> Ambas formas son igualmente funcionales, pero la ventaja de la **primera** (array de validaciones encadenadas) es que el autocompletado funciona mejor con Visual Studio Code. Por eso se recomienda emplear el primer método.

## 9. Método `matchedData()`

`matchedData()` es una utilidad muy importante de `express-validator` que permite obtener **únicamente los datos que pasaron la validación**, filtrando automáticamente cualquier campo adicional que no haya sido validado.

### 9.1 ¿Por qué usar `matchedData()`?

Cuando los usuarios envían datos al servidor, pueden incluir campos adicionales que no esperamos o no queremos procesar. `matchedData()` ayuda a:

- **Seguridad**: previene que datos no validados lleguen a la lógica de negocio.
- **Limpieza**: asegura que solo se trabaje con los datos validados explícitamente.
- **Consistencia**: garantiza que la estructura de datos sea predecible.

### 9.2 Uso básico

```javascript
import { body, validationResult, matchedData } from "express-validator";

const controller = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  // Obtener solo los datos que pasaron la validación
  const validatedData = matchedData(req);
  console.log(validatedData); // Solo campos validados

  // Usar validatedData en lugar de req.body
  // createUser(validatedData);

  res.status(200).json({ message: "User created", data: validatedData });
};
```

### 9.3 Ejemplo práctico

Con estas validaciones:

```javascript
const userValidations = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("firstName").notEmpty().withMessage("First name is required"),
];
```

Y el usuario envía este JSON:

```json
{
  "email": "user@example.com",
  "password": "mypassword123",
  "firstName": "John",
  "maliciousField": "hack attempt",
  "anotherField": "unwanted data"
}
```

Con `matchedData(req)` obtendremos solo:

```json
{
  "email": "user@example.com",
  "password": "mypassword123",
  "firstName": "John"
}
```

Los campos `maliciousField` y `anotherField` serán automáticamente filtrados.

## 10. Método `.custom()`

El método `.custom()` permite crear validaciones personalizadas cuando las validaciones predefinidas de `express-validator` no son suficientes para necesidades específicas.

### 10.1 Sintaxis básica

```javascript
body("fieldName").custom((value, { req }) => {
  // Lógica de validación personalizada
  // Retorna true si es válido
  // Lanza una excepción o retorna Promise.reject() si no es válido
});
```

### 10.2 Ejemplo — validar que un email no esté ya registrado

```javascript
body("email")
  .isEmail()
  .withMessage("Email must be valid")
  .custom(async (email) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already in use");
    }
    return true;
  });
```

### 10.3 Validaciones custom asíncronas

Para validaciones que requieren consultas a base de datos o APIs externas, se puede usar `async`/`await`:

```javascript
body("username")
  .isLength({ min: 3 })
  .withMessage("Username must be at least 3 characters")
  .custom(async (username) => {
    try {
      const user = await User.findOne({ username });
      if (user) {
        return Promise.reject("Username already taken");
      }
    } catch (error) {
      return Promise.reject("Error checking username availability");
    }
  });
```

## 11. Manejo avanzado de errores

`express-validator` provee varios métodos para manejar y formatear los errores:

```javascript
import { validationResult } from "express-validator";

const controller = (req, res) => {
  const result = validationResult(req);

  // 1. Errores como array
  console.log(result.array());

  // 2. Errores mapeados por campo
  console.log(result.mapped());

  // 3. Errores formateados personalizados
  const custom = result.formatWith((err) => {
    return `${err.param}: ${err.msg}`;
  });
  console.log(custom.array());

  // 4. También podrías hacer result.throw()
  // res.status(400).json({ errors: result.array() });
};
```

`result.mapped()` produciría una respuesta como:

```json
{
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

---

**Relación con otros documentos:** el patrón `validations → validate → controller` descrito aquí es el que debería anteceder a los controladores de `login`/`register` de `docs-ia/backend/05-autenticacion-jwt-sesiones-cookies.md`, validando `username`/`email`/`password` antes de consultar la base de datos con Sequelize (`docs-ia/database/03-sequelize-relaciones.md`).
