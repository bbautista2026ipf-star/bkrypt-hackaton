import PropTypes from "prop-types";
import { Link } from "react-router";
import { PATHS } from "../lib/constants.js";
import { buildProductInquiry, buildWhatsAppLink } from "../lib/contact.js";

// Contacto desde la tarjeta: un producto sin stock no ofrece WhatsApp. Si el listado no trae el número
// (el catálogo general no lo incluye), se lleva al detalle del producto, donde sí está.
function ProductContact({ product, entrepreneur }) {
    if (!product.is_available) {
        return <p className="text-body-secondary mb-0">Sin stock por ahora: no se puede consultar desde esta tarjeta.</p>;
    }
    if (entrepreneur.whatsapp_number) {
        return (
            <a
                className="btn btn-primary w-100"
                href={buildWhatsAppLink(entrepreneur.whatsapp_number, buildProductInquiry(product.name, entrepreneur.brand_name))}
                target="_blank"
                rel="noopener noreferrer"
            >
                Consultar por WhatsApp<span className="visually-hidden"> (se abre en otra pestaña)</span>
            </a>
        );
    }
    return (
        <Link className="btn btn-outline-primary w-100" to={PATHS.product(product.id)}>
            Ver producto y contacto<span className="visually-hidden"> de {product.name}</span>
        </Link>
    );
}

ProductContact.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        is_available: PropTypes.bool.isRequired
    }).isRequired,
    entrepreneur: PropTypes.shape({
        brand_name: PropTypes.string.isRequired,
        whatsapp_number: PropTypes.string
    }).isRequired
};

export default ProductContact;
