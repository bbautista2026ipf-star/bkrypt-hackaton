# Bkrypt - Proyecto Fullstack

Aplicación fullstack profesional con **Backend (Express + Node.js)** y **Frontend (React + Vite)**, siguiendo convenciones de código limpio, modularidad y escalabilidad.

---

## Estructura del Proyecto

```
c:/bkrypt/
│
├── server/                          # Backend (Express + Node.js + Sequelize)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # Configuración de conexión a MySQL con Sequelize
│   │   ├── models/
│   │   │   └── index.js            # Definición de modelos Sequelize
│   │   ├── routes/
│   │   │   └── index.js            # Definición de rutas API
│   │   ├── controllers/            # Controladores (lógica de negocio)
│   │   │   └── .gitkeep
│   │   ├── middlewares/            # Middlewares (autenticación, validación)
│   │   │   └── .gitkeep
│   │   └── helpers/
│   │       ├── jwt.js              # Funciones para manejo de JWT
│   │       └── bcrypt.js           # Funciones para encriptación de contraseñas
│   │
│   ├── app.js                       # Configuración principal de Express
│   ├── package.json                 # Dependencias del backend
│   ├── .env.example                 # Ejemplo de variables de entorno
│   └── .gitignore
│
├── client/                          # Frontend (React + Vite + Bootstrap)
│   ├── public/                      # Archivos estáticos
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── components/              # Componentes reutilizables React
│   │   │   └── .gitkeep
│   │   ├── pages/                   # Componentes de página (vistas)
│   │   │   └── .gitkeep
│   │   ├── hooks/                   # Custom Hooks personalizados
│   │   │   └── .gitkeep
│   │   ├── styles/                  # Estilos CSS/SCSS
│   │   │   └── .gitkeep
│   │   ├── lib/                     # Utilidades y librerías compartidas
│   │   │   └── .gitkeep
│   │   ├── main.jsx                 # Punto de entrada de React
│   │   └── App.jsx                  # Componente raíz de la aplicación
│   │
│   ├── index.html                   # Archivo HTML principal
│   ├── vite.config.js               # Configuración de Vite
│   ├── package.json                 # Dependencias del frontend
│   ├── .gitignore
│   └── .env.example
│
├── .gitignore                       # Archivo global de git
├── .env.example                     # Ejemplo de variables de entorno globales
└── README.md                        # Este archivo

```

---

## Stack Tecnológico

### **Backend**

- **Node.js** - Entorno de ejecución JavaScript
- **Express** - Framework web minimalista
- **Sequelize** - ORM para MySQL
- **MySQL** - Base de datos relacional (XAMPP/phpMyAdmin)
- **Express-validator** - Validación de datos en rutas
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Manejo de JWT para autenticación
- **dotenv** - Gestión de variables de entorno
- **CORS** - Habilitación de solicitudes cruzadas

### **Frontend**

- **React 19.2** - Biblioteca de UI
- **Vite** - Build tool moderno y rápido
- **React Router 8** - Enrutamiento de la aplicación
- **Bootstrap 5.3** - Framework CSS para diseño responsivo
- **Oxlint** - Linter rápido y eficiente

### **Herramientas**

- **Git & GitHub** - Control de versiones
- **Postman** - Testing de APIs
- **npm** - Gestor de paquetes

---

## Convenciones de Código

### Presentación del Código

- Código limpio, ordenado y bien indentado
- Uso obligatorio de try-catch en controladores para manejo adecuado de errores
- Estructura correcta del proyecto en carpetas temáticas

### Backend (Node.js + Express)

- `src/config/` → Configuración (conexión a BD)
- `src/models/` → Definición de modelos Sequelize
- `src/routes/` → Definición de rutas
- `src/controllers/` → Controladores (lógica de negocio)
- `src/middlewares/` → Middlewares (autenticación, validación)
- `src/helpers/` → Utilidades (JWT, bcrypt)

### Frontend (React)

- Uso exclusivo de **ES Modules** (import/export)
- Componentes funcionales con Hooks
- Props desestructuradas en parámetros
- Custom Hooks para lógica reutilizable
- Carpetas por funcionalidad (components, pages, hooks, styles, lib)

### Buenas Prácticas

- Validación con express-validator en backend
- Contraseñas encriptadas con bcrypt
- Autenticación con JWT
- Reutilización de componentes
- Modularidad y escalabilidad
- Código funcional, modularizado y sin errores de ejecución

---

## Instrucciones de Instalación

### **Requisitos Previos**

- Node.js (v16 o superior)
- npm (v8 o superior)
- MySQL con XAMPP/phpMyAdmin
- Git

### **Instalación del Backend**

```bash
cd c:/bkrypt/server
npm install
cp .env.example .env
# Editar .env con tus variables de entorno
```

### **Instalación del Frontend**

```bash
cd c:/bkrypt/client
npm install
```

### **Ejecución**

**Backend:**

```bash
cd server
npm run dev
```

**Frontend:**

```bash
cd client
npm run dev
```

La aplicación estará disponible en `http://localhost:3000` (Frontend) y `http://localhost:5000` (Backend).

---

## Módulos Implementados (React)

**Módulo 1-6:** Introducción, Vite, Estructura, Componentes, Props, Renderizado de Listas, React Router

**Módulos 7-12:** Por implementar (Hooks avanzados, Context, Backend Integration)

---

## Información del Proyecto

- **Autor:** Bautista Berenfeld
- **Email:** bbautista2026ipf@gmail.com
- **Institución:** Instituto Politécnico Formosa
- **Última actualización:** 2026-09-24

---

## Licencia

ISC
