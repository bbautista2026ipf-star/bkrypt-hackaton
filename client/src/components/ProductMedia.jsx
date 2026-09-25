import PropTypes from "prop-types";
import { toAssetUrl } from "../lib/apiConfig.js";

// Foto del producto (servida por el backend en /uploads) o, si no tiene, su inicial sobre la trama de puntos
function ProductMedia({ name, imageUrl = null }) {
    const imageSource = toAssetUrl(imageUrl);
    return (
        <div className="product-card-media dot-pattern">
            {imageSource ? (
                <img src={imageSource} alt={name} loading="lazy" />
            ) : (
                <span className="product-card-initial" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
            )}
        </div>
    );
}

ProductMedia.propTypes = {
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string
};

export default ProductMedia;
