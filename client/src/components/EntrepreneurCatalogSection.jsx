import PropTypes from "prop-types";
import { Link } from "react-router";
import useEntrepreneurProfile from "../hooks/useEntrepreneurProfile.js";
import LoadingState from "./LoadingState.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyState from "./EmptyState.jsx";
import ProductGrid from "./ProductGrid.jsx";
import { PATHS } from "../lib/constants.js";

// Catálogo del emprendedor elegido en el mapa, en la misma página: recibe el scroll desde el listado del evento
function EntrepreneurCatalogSection({ entrepreneurId, sectionRef }) {
    const { entrepreneur, status, error, reload } = useEntrepreneurProfile(entrepreneurId);

    const renderContent = () => {
        if (status === "error") {
            return <ErrorState message={error.message} onRetry={reload} />;
        }
        if (!entrepreneur || entrepreneur.id !== entrepreneurId) {
            return <LoadingState message="Cargando el catálogo..." />;
        }
        return (
            <div className="fade-in-up">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
                    <h2 id="entrepreneur-catalog-title" className="h3 section-title mb-0">Catálogo de {entrepreneur.brand_name}</h2>
                    <Link className="btn btn-outline-primary" to={PATHS.entrepreneur(entrepreneur.id)}>Ver perfil y opiniones</Link>
                </div>
                {entrepreneur.biography ? <p>{entrepreneur.biography}</p> : null}
                {entrepreneur.products.length > 0
                    ? <ProductGrid products={entrepreneur.products} entrepreneur={entrepreneur} />
                    : <EmptyState title="Todavía no publicó productos" message="Podés contactarlo desde su perfil o visitarlo en la feria." />}
            </div>
        );
    };

    return (
        <section ref={sectionRef} tabIndex={-1} className="scroll-target mt-5" aria-labelledby="entrepreneur-catalog-title" aria-busy={status === "loading"}>
            {renderContent()}
        </section>
    );
}

EntrepreneurCatalogSection.propTypes = {
    entrepreneurId: PropTypes.string.isRequired,
    sectionRef: PropTypes.shape({ current: PropTypes.any }).isRequired
};

export default EntrepreneurCatalogSection;
