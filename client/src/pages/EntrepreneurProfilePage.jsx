import { useMemo } from "react";
import { Link, useParams } from "react-router";
import useAuth from "../hooks/useAuth.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import useEntrepreneurProfile from "../hooks/useEntrepreneurProfile.js";
import PageBanner from "../components/PageBanner.jsx";
import EntrepreneurContact from "../components/EntrepreneurContact.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import RatingSummary from "../components/RatingSummary.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { PATHS } from "../lib/constants.js";
import { formatEventSchedule } from "../lib/formatters.js";
import { summarizeProductRatings } from "../lib/ratings.js";

function EntrepreneurProfilePage() {
    const { entrepreneurId } = useParams();
    const { entrepreneurProfile } = useAuth();
    const { entrepreneur, status, error, reload } = useEntrepreneurProfile(entrepreneurId);
    const rating = useMemo(() => summarizeProductRatings(entrepreneur?.products ?? []), [entrepreneur]);
    useDocumentTitle(entrepreneur?.brand_name ?? "Emprendedor");
    const isOwnProfile = entrepreneurProfile?.id === entrepreneurId;

    if (status === "error") {
        return (
            <div className="container py-5">
                {error.status === 404 || error.status === 400
                    ? <EmptyState title="No encontramos este emprendimiento" message="Puede que el enlace esté incompleto o que el perfil ya no exista."><Link className="btn btn-primary" to={PATHS.catalog}>Ir al catálogo</Link></EmptyState>
                    : <ErrorState message={error.message} onRetry={reload} />}
            </div>
        );
    }
    // Al pasar de un perfil a otro no se muestran los datos del anterior mientras carga el nuevo
    if (entrepreneur?.id !== entrepreneurId) {
        return <div className="container py-5"><LoadingState message="Cargando el perfil..." /></div>;
    }

    return (
        <>
            <PageBanner tag="Emprendimiento local" title={entrepreneur.brand_name} lead={entrepreneur.biography ?? undefined}>
                {isOwnProfile ? <Link className="btn btn-brand-light" to={PATHS.myCatalog}>Gestionar mi catálogo</Link> : null}
            </PageBanner>
            <div className="container">
                <div className="row g-4 mb-5">
                    <section className="col-12 col-lg-6" aria-labelledby="contact-title">
                        <h2 id="contact-title" className="h4 section-title mb-3">Contacto y opiniones</h2>
                        <div className="mb-3">
                            <EntrepreneurContact entrepreneur={entrepreneur} />
                        </div>
                        <RatingSummary averageRating={rating.averageRating} reviewsCount={rating.reviewsCount} />
                        <p className="text-body-secondary mt-1 mb-0">Calificación promedio de sus productos. Las reseñas se leen en el detalle de cada producto.</p>
                    </section>
                    <section className="col-12 col-lg-6" aria-labelledby="where-title">
                        <h2 id="where-title" className="h4 section-title mb-3">Dónde encontrarlo</h2>
                        {entrepreneur.has_store ? <p className="mb-2"><span className="fw-semibold">Local:</span> {entrepreneur.store_address}</p> : null}
                        {entrepreneur.fairs.length > 0 ? (
                            <p className="mb-2"><span className="fw-semibold">Ferias habituales:</span> {entrepreneur.fairs.map((fair) => fair.name).join(", ")}</p>
                        ) : null}
                        {entrepreneur.schedules.length > 0 ? (
                            <>
                                <p className="fw-semibold mb-1">Próximos horarios en ferias:</p>
                                <ul className="mb-0">
                                    {entrepreneur.schedules.map((schedule) => (
                                        <li key={schedule.id}>{schedule.location.name}: {formatEventSchedule(schedule.start_time, schedule.end_time)}</li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p className="mb-0">No tiene horarios cargados en ferias próximamente.</p>
                        )}
                    </section>
                </div>

                <section aria-labelledby="catalog-title">
                    <h2 id="catalog-title" className="h3 section-title mb-3">Catálogo</h2>
                    {entrepreneur.products.length > 0
                        ? <ProductGrid products={entrepreneur.products} entrepreneur={entrepreneur} />
                        : <EmptyState title="Todavía no publicó productos" message="Podés escribirle para consultar qué tiene disponible." />}
                </section>
            </div>
        </>
    );
}

export default EntrepreneurProfilePage;
