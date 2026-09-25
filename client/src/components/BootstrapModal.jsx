import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Modal } from "bootstrap";

// Si la vista se desmonta con el modal abierto (por ejemplo, al navegar), Bootstrap deja el fondo y el bloqueo de scroll
const removeLeftoverBackdrop = () => {
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.remove());
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
};

// Modal nativo de Bootstrap controlado desde React: "isOpen" lo abre o cierra y "onClose" avisa cuando se cerró
function BootstrapModal({ id, title, isOpen, onClose, children, footer = null }) {
    const modalRef = useRef(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const element = modalRef.current;
        const modal = Modal.getOrCreateInstance(element);
        const handleHidden = () => onCloseRef.current();
        element.addEventListener("hidden.bs.modal", handleHidden);
        return () => {
            const wasOpen = element.classList.contains("show");
            element.removeEventListener("hidden.bs.modal", handleHidden);
            modal.dispose();
            if (wasOpen) {
                removeLeftoverBackdrop();
            }
        };
    }, []);

    useEffect(() => {
        const modal = Modal.getOrCreateInstance(modalRef.current);
        if (isOpen) {
            modal.show();
        } else {
            modal.hide();
        }
    }, [isOpen]);

    return (
        <div ref={modalRef} className="modal fade" id={id} tabIndex={-1} aria-labelledby={`${id}-title`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title h5" id={`${id}-title`}>{title}</h2>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div className="modal-body">{children}</div>
                    {footer ? <div className="modal-footer">{footer}</div> : null}
                </div>
            </div>
        </div>
    );
}

BootstrapModal.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
    footer: PropTypes.node
};

export default BootstrapModal;
