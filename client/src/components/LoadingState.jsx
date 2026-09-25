import PropTypes from "prop-types";

function LoadingState({ message = "Cargando..." }) {
    return (
        <div className="d-flex align-items-center justify-content-center gap-3 py-5" role="status" aria-live="polite">
            <span className="spinner-border" aria-hidden="true"></span>
            <span>{message}</span>
        </div>
    );
}

LoadingState.propTypes = {
    message: PropTypes.string
};

export default LoadingState;
