import { authentication } from "./auth.middleware.js";
import { authorizeRoles } from "./authorization.middleware.js";
import { attachEntrepreneurProfile } from "./ownership.middleware.js";

// Políticas de acceso: toda ruta protegida declara una de estas listas. El rol se valida siempre acá, en el backend;
// ocultar un botón en el frontend es solo una ayuda visual y nunca reemplaza esta validación.

// Administrador: el creador de la plataforma (se configura con ADMIN_EMAIL y ADMIN_PASSWORD)
export const requireAdmin = [authentication, authorizeRoles("admin")];

// Emprendedor con perfil aprobado: gestiona su propio catálogo y solicita presencia en eventos
export const requireEntrepreneur = [authentication, authorizeRoles("entrepreneur"), attachEntrepreneurProfile];

// Consumidor: interactúa con la plataforma (opina, solicita ser emprendedor) pero no modifica información ajena
export const requireConsumer = [authentication, authorizeRoles("consumer")];

// Cualquier cuenta de la comunidad (consumidor o emprendedor), sin incluir al administrador
export const requireMember = [authentication, authorizeRoles("consumer", "entrepreneur")];
