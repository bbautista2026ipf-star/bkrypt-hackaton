import PropTypes from "prop-types";
import BootstrapModal from "./BootstrapModal.jsx";
import FormField from "./FormField.jsx";
import FormAlert from "./FormAlert.jsx";
import useReasonForm from "../hooks/useReasonForm.js";

// Diálogo con un motivo escrito: lo usan el reporte de opiniones y el rechazo de solicitudes
function ReasonDialog({ id, title, description, label, confirmLabel, isOpen, isRequired = true, maxLength = 255, onConfirm, onClose }) {
    const { values, errors, formError, status, isSubmitting, formRef, handleChange, handleSubmit } =
        useReasonForm({ isOpen, isRequired, maxLength, onConfirm });

    return (
        <BootstrapModal id={id} title={title} isOpen={isOpen} onClose={onClose}>
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <p>{description}</p>
                <FormAlert message={status === "error" ? formError : null} />
                <FormField
                    id={`${id}-reason`}
                    name="reason"
                    label={label}
                    as="textarea"
                    rows={3}
                    maxLength={maxLength}
                    required={isRequired}
                    value={values.reason}
                    onChange={handleChange}
                    error={errors.reason}
                />
                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" disabled={isSubmitting}>Cancelar</button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? "Enviando..." : confirmLabel}
                    </button>
                </div>
            </form>
        </BootstrapModal>
    );
}

ReasonDialog.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    confirmLabel: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isRequired: PropTypes.bool,
    maxLength: PropTypes.number,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ReasonDialog;
