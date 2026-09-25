import PropTypes from "prop-types";
import { buildMailLink, buildWhatsAppLink } from "../lib/contact.js";

// Canales de contacto directo, sin intermediarios
function EntrepreneurContact({ entrepreneur }) {
    const greeting = `Hola ${entrepreneur.brand_name}, te encontré en FormoBuy.`;
    const socialLinks = [
        { href: entrepreneur.instagram_url, label: "Instagram" },
        { href: entrepreneur.facebook_url, label: "Facebook" }
    ].filter((link) => link.href);

    return (
        <div className="d-flex flex-wrap gap-2">
            {entrepreneur.whatsapp_number ? (
                <a className="btn btn-primary" href={buildWhatsAppLink(entrepreneur.whatsapp_number, greeting)} target="_blank" rel="noopener noreferrer">
                    Escribir por WhatsApp<span className="visually-hidden"> (se abre en otra pestaña)</span>
                </a>
            ) : null}
            {entrepreneur.contact_email ? (
                <a className="btn btn-outline-primary" href={buildMailLink(entrepreneur.contact_email, greeting)}>Enviar un correo</a>
            ) : null}
            {socialLinks.map((link) => (
                <a key={link.label} className="btn btn-outline-secondary" href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}<span className="visually-hidden"> (se abre en otra pestaña)</span>
                </a>
            ))}
        </div>
    );
}

EntrepreneurContact.propTypes = {
    entrepreneur: PropTypes.shape({
        brand_name: PropTypes.string.isRequired,
        whatsapp_number: PropTypes.string,
        contact_email: PropTypes.string,
        instagram_url: PropTypes.string,
        facebook_url: PropTypes.string
    }).isRequired
};

export default EntrepreneurContact;
