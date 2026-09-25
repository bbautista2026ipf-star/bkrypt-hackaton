import PropTypes from "prop-types";
import { Link } from "react-router";
import { PATHS } from "../lib/constants.js";

// Acciones de gestión que solo aparecen en "Mi catálogo"; el backend igual verifica que el producto sea propio
function ProductOwnerActions({ product, onDelete }) {
    return (
        <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary flex-fill" to={PATHS.editProduct(product.id)}>
                Editar<span className="visually-hidden"> {product.name}</span>
            </Link>
            <button type="button" className="btn btn-outline-danger flex-fill" onClick={() => onDelete(product)}>
                Eliminar<span className="visually-hidden"> {product.name}</span>
            </button>
        </div>
    );
}

ProductOwnerActions.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ProductOwnerActions;
