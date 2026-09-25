import PropTypes from "prop-types";

const DENIED_MESSAGE = "El filtro de cercanía necesita acceso a tu ubicación y el navegador no lo permitió. Podés habilitarlo en la configuración del navegador o seguir buscando sin ese filtro.";
const UNAVAILABLE_MESSAGE = "No pudimos obtener tu ubicación. Podés intentarlo más tarde o seguir buscando sin el filtro de cercanía.";

// Estado de la geolocalización del filtro "Cerca de mí": si no hay permiso, explica por qué y ofrece seguir sin él
function LocationNotice({ status, onContinueWithout }) {
    if (status === "locating") {
        return <p className="mb-0" role="status">Buscando tu ubicación...</p>;
    }
    if (status !== "denied" && status !== "unavailable") {
        return null;
    }
    return (
        <div className="alert alert-warning mb-0 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2" role="alert">
            <p className="mb-0">{status === "denied" ? DENIED_MESSAGE : UNAVAILABLE_MESSAGE}</p>
            <button type="button" className="btn btn-outline-primary flex-shrink-0" onClick={onContinueWithout}>
                Continuar sin ubicación
            </button>
        </div>
    );
}

LocationNotice.propTypes = {
    status: PropTypes.string.isRequired,
    onContinueWithout: PropTypes.func.isRequired
};

export default LocationNotice;
