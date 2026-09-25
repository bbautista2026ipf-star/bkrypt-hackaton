import PropTypes from "prop-types";
import { useResendVerification } from "../hooks/useEmailVerification.js";

function EmailVerificationNotice({ reason }) {
    const { status, message, resend } = useResendVerification();

    return (
        <div className="alert alert-warning" role="status">
            <p className="mb-2">{reason} Revisá tu correo y abrí el enlace de verificación que te enviamos al registrarte.</p>
            {message ? <p className="mb-2" role={status === "error" ? "alert" : "status"}>{message}</p> : null}
            <button type="button" className="btn btn-outline-primary" onClick={resend} disabled={status === "sending"}>
                {status === "sending" ? "Enviando..." : "Reenviar el correo de verificación"}
            </button>
        </div>
    );
}

EmailVerificationNotice.propTypes = {
    reason: PropTypes.string.isRequired
};

export default EmailVerificationNotice;
