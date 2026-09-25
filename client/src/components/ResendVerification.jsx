import PropTypes from "prop-types";
import { useResendVerification } from "../hooks/useEmailVerification.js";

// Reenvía el enlace de verificación al email indicado (el backend responde igual exista o no la cuenta)
function ResendVerification({ email }) {
    const { status, message, resend } = useResendVerification();

    return (
        <div className="d-flex flex-column gap-2">
            {message ? <p className="mb-0" role={status === "error" ? "alert" : "status"}>{message}</p> : null}
            <div>
                <button type="button" className="btn btn-outline-primary" onClick={() => resend(email)} disabled={status === "sending"}>
                    {status === "sending" ? "Enviando..." : "Reenviar el correo de verificación"}
                </button>
            </div>
        </div>
    );
}

ResendVerification.propTypes = {
    email: PropTypes.string.isRequired
};

export default ResendVerification;
