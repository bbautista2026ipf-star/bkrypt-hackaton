import PropTypes from "prop-types";
import { toAssetUrl } from "../lib/apiConfig.js";

// Foto del producto (servida por el backend en /uploads) o, si no tiene, su inicial sobre la trama de puntos.
// Con "expandable" la foto abre su versión completa en otra pestaña (en la tarjeta no, porque ya es un enlace).
function ProductMedia({ name, imageUrl = null, expandable = false }) {
    const imageSource = toAssetUrl(imageUrl);
    const image = <img src={imageSource} alt={name} loading="lazy" />;
    return (
        <div className="product-card-media dot-pattern">
            {imageSource ? (
                expandable ? (
                    <a href={imageSource} target="_blank" rel="noopener noreferrer" className="product-media-link" title="Ver imagen completa">
                        {image}
                        <span className="visually-hidden">(abre la imagen completa en otra pestaña)</span>
                    </a>
                ) : image
            ) : (
                <span className="product-card-initial" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
            )}
        </div>
    );
}

ProductMedia.propTypes = {
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    expandable: PropTypes.bool
};

export default ProductMedia;
