import PropTypes from "prop-types";

// Paginación simple del catálogo (el backend devuelve page, total y total_pages)
function Pagination({ page, totalPages, onPageChange, label }) {
    if (totalPages <= 1) {
        return null;
    }
    return (
        <nav className="d-flex flex-wrap justify-content-center align-items-center gap-3 mt-4" aria-label={label}>
            <button type="button" className="btn btn-outline-primary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
                Anterior
            </button>
            <p className="mb-0" aria-live="polite">Página {page} de {totalPages}</p>
            <button type="button" className="btn btn-outline-primary" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
                Siguiente
            </button>
        </nav>
    );
}

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
};

export default Pagination;
