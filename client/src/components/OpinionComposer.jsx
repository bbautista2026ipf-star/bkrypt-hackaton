import PropTypes from "prop-types";
import { Link, useLocation } from "react-router";
import useAuth from "../hooks/useAuth.js";
import OpinionForm from "./OpinionForm.jsx";
import EmailVerificationNotice from "./EmailVerificationNotice.jsx";
import { PATHS, ROLES } from "../lib/constants.js";

// Decide qué ve cada visitante antes de opinar. Es solo una guía: el backend vuelve a validar sesión, rol y correo.
function OpinionComposer({ isOwnProfile, existingOpinion = null, onSubmitOpinion }) {
    const { isAuthenticated, role, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        const returnTo = encodeURIComponent(location.pathname);
        return (
            <div className="alert alert-info d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-4">
                <p className="mb-0">Para dejar tu opinión necesitás iniciar sesión.</p>
                <Link className="btn btn-primary flex-shrink-0" to={`${PATHS.login}?volver=${returnTo}`}>Iniciar sesión</Link>
            </div>
        );
    }
    if (isOwnProfile) {
        return <p className="alert alert-light border mb-4">Este es tu muro: no podés opinar sobre tu emprendimiento, pero podés reportar opiniones ante la administración.</p>;
    }
    if (role === ROLES.admin) {
        return <p className="alert alert-light border mb-4">Las cuentas de administración moderan las opiniones, pero no las publican.</p>;
    }
    if (!user.is_email_verified) {
        return <EmailVerificationNotice reason="Para publicar opiniones necesitás verificar tu correo electrónico." />;
    }
    return <OpinionForm existingOpinion={existingOpinion} onSubmitOpinion={onSubmitOpinion} />;
}

OpinionComposer.propTypes = {
    isOwnProfile: PropTypes.bool.isRequired,
    existingOpinion: PropTypes.shape({
        stars: PropTypes.number.isRequired,
        comment: PropTypes.string.isRequired
    }),
    onSubmitOpinion: PropTypes.func.isRequired
};

export default OpinionComposer;
