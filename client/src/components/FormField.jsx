import PropTypes from "prop-types";

// Campo con label asociado (htmlFor/id) y mensaje de error propio, enlazado con aria-describedby
function FormField({ id, label, error, help, as = "input", required = false, children, className = "mb-3", ...controlProps }) {
    const helpId = help ? `${id}-help` : null;
    const errorId = error ? `${id}-error` : null;
    const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;
    const controlClassName = `${as === "select" ? "form-select" : "form-control"}${error ? " is-invalid" : ""}`;
    const sharedProps = {
        id,
        className: controlClassName,
        "aria-invalid": error ? "true" : "false",
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
        ...controlProps
    };

    const renderControl = () => {
        if (as === "textarea") {
            return <textarea {...sharedProps} />;
        }
        if (as === "select") {
            return <select {...sharedProps}>{children}</select>;
        }
        return <input {...sharedProps} />;
    };

    return (
        <div className={className}>
            <label htmlFor={id} className="form-label fw-semibold">
                {label}
                {required ? <span className="text-body-secondary fw-normal"> (obligatorio)</span> : null}
            </label>
            {renderControl()}
            {help ? <div id={helpId} className="form-text">{help}</div> : null}
            {error ? <div id={errorId} className="invalid-feedback">{error}</div> : null}
        </div>
    );
}

FormField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    help: PropTypes.string,
    as: PropTypes.oneOf(["input", "textarea", "select"]),
    required: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string
};

export default FormField;
