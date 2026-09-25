import { transporter, isSmtpConfigured } from "../config/mailer.js";
import { generateToken, TOKEN_PURPOSES } from "./jwt.helper.js";

const APP_NAME = "FormoBuy";
const EMAIL_VERIFICATION_EXPIRATION = "24h";

const clientUrl = () => process.env.CLIENT_URL || "http://localhost:5173";

const sender = () => process.env.MAIL_FROM || `${APP_NAME} <${process.env.SMTP_USER || "no-reply@formobuy.local"}>`;

// El correo es una notificación complementaria: si falla se registra, pero nunca corta la operación que lo disparó
const sendMail = async ({ to, subject, text }) => {
    try {
        await transporter.sendMail({ from: sender(), to, subject, text });
        if (!isSmtpConfigured) {
            console.info(`[Correo no enviado: SMTP sin configurar]\nPara: ${to}\nAsunto: ${subject}\n\n${text}\n`);
        }
    } catch (error) {
        console.error(`No se pudo enviar el correo "${subject}" a ${to}:`, error);
    }
};

const notifyAdmin = (subject, text) => {
    if (!process.env.ADMIN_EMAIL) {
        return Promise.resolve();
    }
    return sendMail({ to: process.env.ADMIN_EMAIL, subject, text });
};

export const sendVerificationEmail = (user) => {
    const token = generateToken({ user_id: user.id, purpose: TOKEN_PURPOSES.emailVerification }, EMAIL_VERIFICATION_EXPIRATION);
    const link = `${clientUrl()}/verificar-email?token=${encodeURIComponent(token)}`;
    return sendMail({
        to: user.email,
        subject: `Confirmá tu correo en ${APP_NAME}`,
        text: `Hola ${user.name}:\n\nPara confirmar tu correo electrónico ingresá a este enlace (vence en 24 horas):\n${link}\n\nSi no creaste una cuenta en ${APP_NAME}, ignorá este mensaje.`
    });
};

export const notifyAdminOfEntrepreneurRequest = (applicant, entrepreneurRequest) => notifyAdmin(
    "Nueva solicitud de emprendedor",
    `${applicant.name} (${applicant.email}) solicitó el rol de emprendedor para "${entrepreneurRequest.brand_name}".\n\nPodés revisarla en ${clientUrl()}/admin`
);

export const notifyAdminOfReportedOpinion = (opinion, brandName) => notifyAdmin(
    "Opinión reportada",
    `El emprendimiento "${brandName}" reportó una opinión.\nMotivo: ${opinion.report_reason}\n\nPodés revisarla en ${clientUrl()}/admin`
);

export const sendEntrepreneurRequestDecision = (applicant, entrepreneurRequest) => {
    if (entrepreneurRequest.status === "approved") {
        return sendMail({
            to: applicant.email,
            subject: "Tu solicitud de emprendedor fue aprobada",
            text: `Hola ${applicant.name}:\n\nTu emprendimiento "${entrepreneurRequest.brand_name}" ya está habilitado. Desde ahora podés publicar tu catálogo en ${clientUrl()}/mi-catalogo`
        });
    }
    const reason = entrepreneurRequest.rejection_reason
        ? `Motivo: ${entrepreneurRequest.rejection_reason}`
        : "La administración no indicó un motivo.";
    return sendMail({
        to: applicant.email,
        subject: "Tu solicitud de emprendedor fue rechazada",
        text: `Hola ${applicant.name}:\n\nTu solicitud para "${entrepreneurRequest.brand_name}" no fue aprobada.\n${reason}\n\nSeguís usando la plataforma como consumidor y podés enviar una nueva solicitud desde tu perfil.`
    });
};
