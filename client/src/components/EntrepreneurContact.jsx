import PropTypes from "prop-types";
import { buildGreeting, buildWhatsAppLink } from "../lib/contact.js";

// Contacto directo con el emprendimiento, sin intermediarios
function EntrepreneurContact({ entrepreneur }) {
    if (!entrepreneur.whatsapp_number) {
        return <p className="mb-0">Este emprendimiento todavía no cargó un número de contacto.</p>;
    }
    return (
        <a
            className="btn btn-primary"
            href={buildWhatsAppLink(entrepreneur.whatsapp_number, buildGreeting(entrepreneur.brand_name))}
            target="_blank"
            rel="noopener noreferrer"
        >
            Escribir por WhatsApp<span className="visually-hidden"> (se abre en otra pestaña)</span>
        </a>
    );
}

EntrepreneurContact.propTypes = {
    entrepreneur: PropTypes.shape({
        brand_name: PropTypes.string.isRequired,
        whatsapp_number: PropTypes.string
    }).isRequired
};

export default EntrepreneurContact;
