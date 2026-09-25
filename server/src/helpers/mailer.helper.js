import nodemailer from "nodemailer";

let transporter = null;

const isSmtpConfigured = () => Boolean(process.env.SMTP_HOST);

const getTransporter = () => {
    if (!transporter) {
        const port = Number(process.env.SMTP_PORT) || 587;
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port,
            secure: port === 465,
            auth: process.env.SMTP_USER
                ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                : undefined
        });
    }
    return transporter;
};

export const buildEmailVerificationLink = (token) =>
    `${process.env.CLIENT_URL}/verificar-email?token=${encodeURIComponent(token)}`;

// Sin SMTP configurado (desarrollo), el link se muestra en la consola del servidor en lugar de enviarse
export const sendVerificationEmail = async ({ email, name, verificationLink }) => {
    if (!isSmtpConfigured()) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("El servidor de correo (SMTP) no está configurado");
        }
        console.log(`[DEV] Link de verificación para ${email}: ${verificationLink}`);
        return;
    }
    await getTransporter().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Verificá tu email",
        text: `Hola ${name}, para activar tu cuenta abrí este link (vence en 24 horas):\n\n${verificationLink}`
    });
};
