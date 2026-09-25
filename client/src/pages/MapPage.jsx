import { Link, useLocation } from "react-router";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import useProductSearch from "../hooks/useProductSearch.js";
import useMapSelection from "../hooks/useMapSelection.js";
import PageBanner from "../components/PageBanner.jsx";
import SearchFilters from "../components/SearchFilters.jsx";
import EventsMap from "../components/EventsMap.jsx";
import EventList from "../components/EventList.jsx";
import EventEntrepreneurs from "../components/EventEntrepreneurs.jsx";
import EntrepreneurCatalogSection from "../components/EntrepreneurCatalogSection.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { PATHS } from "../lib/constants.js";

// Mapa -> emprendedores del evento -> catálogo del emprendedor, todo en la misma página y con los filtros del catálogo
function MapPage() {
    useDocumentTitle("Mapa");
    const location = useLocation();
    const search = useProductSearch();
    const selection = useMapSelection(search.events);

    const renderMap = () => {
        if (search.status === "loading" && !search.hasResults) {
            return <LoadingState message="Buscando eventos activos..." />;
        }
        if (search.status === "error") {
            return <ErrorState message={search.error.message} onRetry={search.reload} />;
        }
        if (search.events.length === 0) {
            return (
                <EmptyState
                    title="No hay eventos activos"
                    message={search.hasActiveFilters
                        ? "Ningún evento confirmado tiene emprendedores que coincidan con estos filtros."
                        : "Todavía no hay ferias con emprendedores confirmados. Revisá la agenda para ver las próximas fechas."}
                >
                    {search.hasActiveFilters ? <button type="button" className="btn btn-outline-primary" onClick={search.clearFilters}>Limpiar filtros</button> : null}
                    <Link className="btn btn-primary" to={PATHS.agenda}>Ver la agenda</Link>
                </EmptyState>
            );
        }
        return (
            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <EventsMap events={search.events} selectedEventId={selection.selectedEvent?.id ?? null} onSelectEvent={selection.selectEvent} />
                </div>
                <div className="col-12 col-lg-4">
                    <h2 className="h5 fw-bold">Eventos activos y próximos</h2>
                    <EventList events={search.events} selectedEventId={selection.selectedEvent?.id ?? null} onSelectEvent={selection.selectEvent} />
                </div>
            </div>
        );
    };

    return (
        <>
            <PageBanner tag="Mapa" title="Ferias y emprendedores activos" lead="Tocá un evento para ver quiénes participan y, después, el catálogo de cada emprendedor." />
            <div className="container">
                <SearchFilters
                    idPrefix="map-filter"
                    filters={search.filters}
                    onChange={search.updateFilters}
                    onClear={search.clearFilters}
                    hasActiveFilters={search.hasActiveFilters}
                    locationStatus={search.location.status}
                    isSortedByDistance={search.isSortedByDistance}
                />
                <p className="text-end">
                    <Link to={{ pathname: PATHS.catalog, search: location.search }}>Ver estos resultados como catálogo</Link>
                </p>
                <div aria-busy={search.status === "loading"}>{renderMap()}</div>
                {selection.selectedEvent ? (
                    <EventEntrepreneurs event={selection.selectedEvent} sectionRef={selection.eventSectionRef} onSelectEntrepreneur={selection.selectEntrepreneur} />
                ) : null}
                {selection.selectedEntrepreneurId ? (
                    <EntrepreneurCatalogSection entrepreneurId={selection.selectedEntrepreneurId} sectionRef={selection.catalogSectionRef} />
                ) : null}
            </div>
        </>
    );
}

export default MapPage;
