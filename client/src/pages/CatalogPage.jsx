import { Link, useLocation } from "react-router";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import useProductSearch from "../hooks/useProductSearch.js";
import PageBanner from "../components/PageBanner.jsx";
import SearchFilters from "../components/SearchFilters.jsx";
import CatalogResults from "../components/CatalogResults.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { PATHS } from "../lib/constants.js";
import { pluralize } from "../lib/formatters.js";

function CatalogPage() {
    useDocumentTitle("Catálogo");
    const location = useLocation();
    const search = useProductSearch();

    const renderResults = () => {
        if (search.status === "loading" && !search.hasResults) {
            return <LoadingState message="Buscando productos..." />;
        }
        if (search.status === "error") {
            return <ErrorState message={search.error.message} onRetry={search.reload} />;
        }
        if (search.products.length === 0) {
            return (
                <EmptyState title="No encontramos productos con esos filtros" message="Probá con otro tipo de producto, otra palabra o una distancia mayor.">
                    {search.hasActiveFilters ? <button type="button" className="btn btn-outline-primary" onClick={search.clearFilters}>Limpiar filtros</button> : null}
                </EmptyState>
            );
        }
        return <CatalogResults products={search.products} groupByCategory={!search.filters.category && !search.isSortedByDistance} />;
    };

    return (
        <>
            <PageBanner tag="Catálogo" title="Productos de emprendedores locales" lead="Filtrá por tipo, cercanía y disponibilidad. Consultá directo por WhatsApp, sin intermediarios." />
            <div className="container">
                <SearchFilters
                    idPrefix="catalog-filter"
                    filters={search.filters}
                    onChange={search.updateFilters}
                    onClear={search.clearFilters}
                    hasActiveFilters={search.hasActiveFilters}
                    locationStatus={search.location.status}
                    isSortedByDistance={search.isSortedByDistance}
                />
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <p className="mb-0 fw-semibold" aria-live="polite">
                        {search.hasResults ? pluralize(search.products.length, "producto encontrado", "productos encontrados") : ""}
                    </p>
                    <Link to={{ pathname: PATHS.map, search: location.search }}>Ver estos resultados en el mapa</Link>
                </div>
                <div aria-busy={search.status === "loading"}>{renderResults()}</div>
            </div>
        </>
    );
}

export default CatalogPage;
