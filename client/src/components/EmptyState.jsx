import PropTypes from "prop-types";

function EmptyState({ title, message, children }) {
    return (
        <div className="empty-state dot-pattern text-center px-3 py-5">
            <p className="h5 fw-bold">{title}</p>
            {message ? <p className="mb-0 mx-auto col-lg-8">{message}</p> : null}
            {children ? <div className="mt-3 d-flex flex-wrap justify-content-center gap-2">{children}</div> : null}
        </div>
    );
}

EmptyState.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string,
    children: PropTypes.node
};

export default EmptyState;
