import PropTypes from "prop-types";
import { Link, useLocation } from "react-router";
import useAuth from "../hooks/useAuth.js";
import ReviewForm from "./ReviewForm.jsx";
import { PATHS, ROLES } from "../lib/constants.js";

// Decide qué ve cada visitante antes de calificar. Es solo una guía: el backend vuelve a validar sesión y rol.
function ReviewComposer({ isOwnProduct, canReview, existingReview = null, onSubmitReview }) {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <div className="alert alert-info d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-4">
                <p className="mb-0">Para calificar este producto necesitás iniciar sesión.</p>
                <Link className="btn btn-primary flex-shrink-0" to={`${PATHS.login}?volver=${encodeURIComponent(location.pathname)}`}>Iniciar sesión</Link>
            </div>
        );
    }
    if (isOwnProduct) {
        return <p className="alert alert-light border mb-4">Este producto es tuyo: no podés calificarlo.</p>;
    }
    if (role === ROLES.admin) {
        return <p className="alert alert-light border mb-4">Las cuentas de administración moderan las reseñas, pero no las publican.</p>;
    }
    return canReview ? <ReviewForm existingReview={existingReview} onSubmitReview={onSubmitReview} /> : null;
}

ReviewComposer.propTypes = {
    isOwnProduct: PropTypes.bool.isRequired,
    canReview: PropTypes.bool.isRequired,
    existingReview: PropTypes.shape({
        stars: PropTypes.number.isRequired,
        comment: PropTypes.string
    }),
    onSubmitReview: PropTypes.func.isRequired
};

export default ReviewComposer;
