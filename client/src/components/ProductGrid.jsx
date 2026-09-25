import PropTypes from "prop-types";
import ProductCard from "./ProductCard.jsx";

// Una columna en móvil, dos en tablet, tres o cuatro en escritorio
function ProductGrid({ products, entrepreneur = null, variant = "public", onDelete = null }) {
    return (
        <ul className="row g-3 g-lg-4 list-unstyled mb-0">
            {products.map((product) => (
                <li className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product.id}>
                    <ProductCard product={product} entrepreneur={entrepreneur} variant={variant} onDelete={onDelete} />
                </li>
            ))}
        </ul>
    );
}

ProductGrid.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
    entrepreneur: PropTypes.object,
    variant: PropTypes.oneOf(["public", "owner"]),
    onDelete: PropTypes.func
};

export default ProductGrid;
