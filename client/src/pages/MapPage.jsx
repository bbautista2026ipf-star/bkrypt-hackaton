import { Link, useLocation } from "react-router";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import useActiveFairs from "../hooks/useActiveFairs.js";
import useMapSelection from "../hooks/useMapSelection.js";
import PageBanner from "../components/PageBanner.jsx";
import SearchFilters from "../components/SearchFilters.jsx";
import FairsMap from "../components/FairsMap.jsx";
import FairList from "../components/FairList.jsx";
import FairEntrepreneurs from "../components/FairEntrepreneurs.jsx";
import EntrepreneurCatalogSection from "../components/EntrepreneurCatalogSection.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { PATHS } from "../lib/constants.js";

// Mapa -> emprendedores de la feria -> catálogo del emprendedor, todo en la misma página y con los filtros del catálogo
function MapPage() {
    useDocumentTitle("Mapa");
    const location = useLocation();
    const fairsSearch = useActiveFairs();
    const selection = useMapSelection(fairsSearch.fairs);
    const selectedFairId = selection.selectedFair?.id ?? null;

    const renderMap = () => {
        if (fairsSearch.status === "loading" && !fairsSearch.hasResults) {
            return <LoadingState message="Buscando ferias activas..." />;
        }
        if (fairsSearch.status === "error") {
            return <ErrorState message={fairsSearch.error.message} onRetry={fairsSearch.reload} />;
        }
        if (fairsSearch.fairs.length === 0) {
            return (
                <EmptyState
                    title="No hay ferias activas"
                    message={fairsSearch.hasActiveFilters
                        ? "Ninguna feria próxima tiene emprendedores con productos que coincidan con estos filtros."
                        : "Todavía no hay emprendedores con horarios cargados en las ferias. Revisá la agenda más adelante."}
                >
                    {fairsSearch.hasActiveFilters ? <button type="button" className="btn btn-outline-primary" onClick={fairsSearch.clearFilters}>Limpiar filtros</button> : null}
                    <Link className="btn btn-primary" to={PATHS.agenda}>Ver la agenda</Link>
                </EmptyState>
            );
        }
        return (
            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <FairsMap fairs={fairsSearch.fairs} selectedFairId={selectedFairId} onSelectFair={selection.selectFair} />
                </div>
                <div className="col-12 col-lg-4">
                    <h2 className="h5 fw-bold">Ferias con emprendedores próximamente</h2>
                    <FairList fairs={fairsSearch.fairs} selectedFairId={selectedFairId} onSelectFair={selection.selectFair} />
                </div>
            </div>
        );
    };

    return (
        <>
            <PageBanner tag="Mapa" title="Ferias y emprendedores activos" lead="Tocá una feria para ver quiénes van a estar y, después, el catálogo de cada emprendedor." />
            <div className="container">
                <SearchFilters
                    idPrefix="map-filter"
                    filters={fairsSearch.filters}
                    onChange={fairsSearch.updateFilters}
                    onClear={fairsSearch.clearFilters}
                    hasActiveFilters={fairsSearch.hasActiveFilters}
                    locationStatus={fairsSearch.location.status}
                    isSortedByDistance={false}
                />
                <p className="text-end">
                    <Link to={{ pathname: PATHS.catalog, search: location.search }}>Ver estos resultados como catálogo</Link>
                </p>
                <div aria-busy={fairsSearch.status === "loading"}>{renderMap()}</div>
                {selection.selectedFair ? (
                    <FairEntrepreneurs fair={selection.selectedFair} sectionRef={selection.fairSectionRef} onSelectEntrepreneur={selection.selectEntrepreneur} />
                ) : null}
                {selection.selectedEntrepreneurId ? (
                    <EntrepreneurCatalogSection entrepreneurId={selection.selectedEntrepreneurId} sectionRef={selection.catalogSectionRef} />
                ) : null}
            </div>
        </>
    );
}

export default MapPage;
