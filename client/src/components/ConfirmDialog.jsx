import PropTypes from "prop-types";
import BootstrapModal from "./BootstrapModal.jsx";
import FormAlert from "./FormAlert.jsx";

function ConfirmDialog({ id, title, message, confirmLabel, isOpen, isProcessing = false, error = null, onConfirm, onClose }) {
    const footer = (
        <>
            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" disabled={isProcessing}>
                Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={isProcessing}>
                {isProcessing ? "Procesando..." : confirmLabel}
            </button>
        </>
    );

    return (
        <BootstrapModal id={id} title={title} isOpen={isOpen} onClose={onClose} footer={footer}>
            <FormAlert message={error} />
            <p className="mb-0">{message}</p>
        </BootstrapModal>
    );
}

ConfirmDialog.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    confirmLabel: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isProcessing: PropTypes.bool,
    error: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ConfirmDialog;
