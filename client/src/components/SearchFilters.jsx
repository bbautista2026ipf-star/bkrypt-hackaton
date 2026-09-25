import PropTypes from "prop-types";
import LocationNotice from "./LocationNotice.jsx";
import { PRODUCT_CATEGORIES, SEARCH_RADIUS_OPTIONS } from "../lib/constants.js";

// Filtros del buscador avanzado. Todos se combinan (intersección) y quedan en la URL, compartidos con el mapa.
function SearchFilters({ filters, onChange, onClear, hasActiveFilters, locationStatus, isSortedByDistance, idPrefix }) {
    const handleSubmit = (event) => event.preventDefault();

    return (
        <form role="search" aria-label="Filtrar productos" className="card card-body mb-4" onSubmit={handleSubmit} noValidate>
            <div className="row g-3 align-items-end">
                <div className="col-12 col-md-6 col-lg-4">
                    <label htmlFor={`${idPrefix}-search`} className="form-label fw-semibold">Buscar</label>
                    <input
                        id={`${idPrefix}-search`}
                        type="search"
                        className="form-control"
                        placeholder="Ej.: dulce de leche, mate, jabón"
                        value={filters.search}
                        onChange={(event) => onChange({ search: event.target.value })}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <label htmlFor={`${idPrefix}-category`} className="form-label fw-semibold">Tipo de producto</label>
                    <select
                        id={`${idPrefix}-category`}
                        className="form-select"
                        value={filters.category}
                        onChange={(event) => onChange({ category: event.target.value })}
                    >
                        <option value="">Todos los tipos</option>
                        {PRODUCT_CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-sm-6 col-lg-2">
                    <div className="form-check form-switch mb-2">
                        <input
                            id={`${idPrefix}-available`}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            aria-checked={filters.onlyAvailable}
                            checked={filters.onlyAvailable}
                            onChange={(event) => onChange({ onlyAvailable: event.target.checked })}
                        />
                        <label className="form-check-label" htmlFor={`${idPrefix}-available`}>Solo con stock</label>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="form-check form-switch mb-2">
                        <input
                            id={`${idPrefix}-nearby`}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            aria-checked={filters.nearby}
                            checked={filters.nearby}
                            onChange={(event) => onChange({ nearby: event.target.checked })}
                        />
                        <label className="form-check-label" htmlFor={`${idPrefix}-nearby`}>Cerca de mí</label>
                    </div>
                    <label htmlFor={`${idPrefix}-radius`} className="visually-hidden">Distancia máxima</label>
                    <select
                        id={`${idPrefix}-radius`}
                        className="form-select"
                        value={filters.radius}
                        disabled={!filters.nearby}
                        onChange={(event) => onChange({ radius: Number(event.target.value) })}
                    >
                        {SEARCH_RADIUS_OPTIONS.map((radius) => (
                            <option key={radius} value={radius}>Hasta {radius} km</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="d-flex flex-column gap-2 mt-3">
                <LocationNotice status={locationStatus} onContinueWithout={() => onChange({ nearby: false })} />
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <p className="mb-0 text-body-secondary" aria-live="polite">
                        {isSortedByDistance ? "Resultados ordenados del más cercano al más lejano." : "Los filtros se combinan: cada resultado cumple todos a la vez."}
                    </p>
                    {hasActiveFilters ? (
                        <button type="button" className="btn btn-link px-0" onClick={onClear}>Limpiar filtros</button>
                    ) : null}
                </div>
            </div>
        </form>
    );
}

SearchFilters.propTypes = {
    filters: PropTypes.shape({
        category: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
        onlyAvailable: PropTypes.bool.isRequired,
        nearby: PropTypes.bool.isRequired,
        radius: PropTypes.number.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    hasActiveFilters: PropTypes.bool.isRequired,
    locationStatus: PropTypes.string.isRequired,
    isSortedByDistance: PropTypes.bool.isRequired,
    idPrefix: PropTypes.string.isRequired
};

export default SearchFilters;
