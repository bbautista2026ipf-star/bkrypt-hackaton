import nodemailer from "nodemailer";

// Proveedor definido para el proyecto: Gmail por SMTP (smtp.gmail.com:465) con una contraseña de aplicación
export const isSmtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const createTransporter = () => {
    // Sin credenciales SMTP (desarrollo local) Nodemailer arma el mensaje sin enviarlo y el helper lo muestra en consola
    if (!isSmtpConfigured) {
        return nodemailer.createTransport({ jsonTransport: true });
    }
    const port = Number(process.env.SMTP_PORT) || 465;
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

export const transporter = createTransporter();
