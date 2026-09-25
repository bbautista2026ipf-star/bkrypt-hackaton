import PropTypes from "prop-types";

// Aviso general del formulario; los detalles de cada campo se muestran junto al input correspondiente
function FormAlert({ message, variant = "danger" }) {
    if (!message) {
        return null;
    }
    return (
        <div className={`alert alert-${variant}`} role={variant === "danger" ? "alert" : "status"}>
            {message}
        </div>
    );
}

FormAlert.propTypes = {
    message: PropTypes.string,
    variant: PropTypes.oneOf(["danger", "success", "info", "warning"])
};

export default FormAlert;
