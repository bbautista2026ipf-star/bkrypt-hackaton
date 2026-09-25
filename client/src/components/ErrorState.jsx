import PropTypes from "prop-types";

function ErrorState({ message, onRetry }) {
    return (
        <div className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3" role="alert">
            <p className="mb-0">{message}</p>
            {onRetry ? (
                <button type="button" className="btn btn-outline-danger flex-shrink-0" onClick={onRetry}>
                    Reintentar
                </button>
            ) : null}
        </div>
    );
}

ErrorState.propTypes = {
    message: PropTypes.string.isRequired,
    onRetry: PropTypes.func
};

export default ErrorState;
