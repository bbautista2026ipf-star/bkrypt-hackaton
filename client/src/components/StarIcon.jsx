import PropTypes from "prop-types";

const STAR_PATH = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

// Estrella amarilla con borde oscuro: el contorno garantiza el contraste sobre fondo blanco
function StarIcon({ isFilled }) {
    return (
        <svg className={`star-icon ${isFilled ? "is-filled" : "is-empty"}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d={STAR_PATH} />
        </svg>
    );
}

StarIcon.propTypes = {
    isFilled: PropTypes.bool.isRequired
};

export default StarIcon;
