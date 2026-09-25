import PropTypes from "prop-types";
import { Link } from "react-router";
import ProductMedia from "./ProductMedia.jsx";
import ProductContact from "./ProductContact.jsx";
import ProductOwnerActions from "./ProductOwnerActions.jsx";
import RatingSummary from "./RatingSummary.jsx";
import { PATHS, getCategoryLabel } from "../lib/constants.js";
import { formatDistance, formatPrice } from "../lib/formatters.js";

// Tarjeta única de producto: variante "public" (catálogo, mapa, perfil) u "owner" (Mi catálogo, con editar y eliminar)
function ProductCard({ product, entrepreneur = null, variant = "public", onDelete = null }) {
    const seller = entrepreneur ?? product.entrepreneur ?? null;
    const distance = formatDistance(product.distance_km);
    const isOwnerView = variant === "owner";

    return (
        <article className={`card h-100 product-card card-lift${product.is_available ? "" : " is-out-of-stock"}`}>
            <ProductMedia name={product.name} imageUrl={product.image_url} />
            <div className="card-body d-flex flex-column">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                    <span className="badge badge-brand-teal">{getCategoryLabel(product.category)}</span>
                    {product.is_available
                        ? <span className="badge text-bg-light border">Disponible</span>
                        : <span className="badge text-bg-secondary">Sin stock</span>}
                </div>
                <h3 className="h5 card-title mb-1">
                    <Link className="link-body-emphasis text-decoration-none" to={PATHS.product(product.id)}>{product.name}</Link>
                </h3>
                <p className="product-price mb-2">{formatPrice(product.price)}</p>
                <div className="mb-2">
                    <RatingSummary averageRating={product.average_rating} reviewsCount={product.reviews_count ?? 0} />
                </div>
                {product.description ? <p className="product-description text-body-secondary">{product.description}</p> : null}
                {!isOwnerView && seller ? (
                    <p className="mb-3">
                        De <Link to={PATHS.entrepreneur(seller.id)}>{seller.brand_name}</Link>
                        {distance ? <span className="text-body-secondary"> · {distance}</span> : null}
                    </p>
                ) : null}
                <div className="mt-auto">
                    {isOwnerView ? <ProductOwnerActions product={product} onDelete={onDelete} /> : null}
                    {!isOwnerView && seller ? <ProductContact product={product} entrepreneur={seller} /> : null}
                </div>
            </div>
        </article>
    );
}

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        is_available: PropTypes.bool.isRequired,
        category: PropTypes.string.isRequired,
        image_url: PropTypes.string,
        average_rating: PropTypes.number,
        reviews_count: PropTypes.number,
        distance_km: PropTypes.number,
        entrepreneur: PropTypes.shape({
            id: PropTypes.string.isRequired,
            brand_name: PropTypes.string.isRequired
        })
    }).isRequired,
    entrepreneur: PropTypes.shape({
        id: PropTypes.string.isRequired,
        brand_name: PropTypes.string.isRequired,
        whatsapp_number: PropTypes.string
    }),
    variant: PropTypes.oneOf(["public", "owner"]),
    onDelete: PropTypes.func
};

export default ProductCard;
