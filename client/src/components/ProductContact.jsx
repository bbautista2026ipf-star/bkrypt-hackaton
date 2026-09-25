import PropTypes from "prop-types";
import { buildMailLink, buildProductInquiry, buildWhatsAppLink } from "../lib/contact.js";

// Contacto directo desde la tarjeta: un producto sin stock no ofrece WhatsApp ni correo
function ProductContact({ product, entrepreneur }) {
    if (!product.is_available) {
        return <p className="text-body-secondary mb-0">Sin stock por ahora: no se puede consultar desde esta tarjeta.</p>;
    }
    const inquiry = buildProductInquiry(product.name, entrepreneur.brand_name);
    if (entrepreneur.whatsapp_number) {
        return (
            <a className="btn btn-primary w-100" href={buildWhatsAppLink(entrepreneur.whatsapp_number, inquiry)} target="_blank" rel="noopener noreferrer">
                Consultar por WhatsApp<span className="visually-hidden"> (se abre en otra pestaña)</span>
            </a>
        );
    }
    if (entrepreneur.contact_email) {
        return <a className="btn btn-outline-primary w-100" href={buildMailLink(entrepreneur.contact_email, inquiry)}>Consultar por correo</a>;
    }
    return null;
}

ProductContact.propTypes = {
    product: PropTypes.shape({
        name: PropTypes.string.isRequired,
        is_available: PropTypes.bool.isRequired
    }).isRequired,
    entrepreneur: PropTypes.shape({
        brand_name: PropTypes.string.isRequired,
        whatsapp_number: PropTypes.string,
        contact_email: PropTypes.string
    }).isRequired
};

export default ProductContact;
