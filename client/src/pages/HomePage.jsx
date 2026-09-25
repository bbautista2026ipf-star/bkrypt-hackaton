import { Link } from "react-router";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import useUpcomingEvents from "../hooks/useUpcomingEvents.js";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { PATHS } from "../lib/constants.js";
import { formatEventSchedule, pluralize } from "../lib/formatters.js";

const FEATURES = [
    { title: "Catálogo local", text: "Productos de emprendedores de Formosa Capital, organizados por tipo y con contacto directo por WhatsApp.", to: PATHS.catalog, action: "Ver el catálogo" },
    { title: "Mapa de ferias", text: "Encontrá dónde están hoy y qué emprendedores participan en cada feria.", to: PATHS.map, action: "Abrir el mapa" },
    { title: "Agenda de ferias", text: "Todas las fechas confirmadas para que planifiques tu visita con tiempo.", to: PATHS.agenda, action: "Ver la agenda" }
];

function HomePage() {
    useDocumentTitle(null);
    const { events, status, error, reload } = useUpcomingEvents();

    const renderUpcomingEvents = () => {
        if (status === "loading") {
            return <LoadingState message="Buscando las próximas ferias..." />;
        }
        if (status === "error") {
            return <ErrorState message={error.message} onRetry={reload} />;
        }
        if (events.length === 0) {
            return <EmptyState title="Todavía no hay ferias confirmadas" message="Cuando la administración confirme emprendedores en un evento, lo vas a ver acá." />;
        }
        return (
            <ul className="row g-3 list-unstyled mb-0">
                {events.map((event) => (
                    <li className="col-12 col-md-4" key={event.id}>
                        <article className="card h-100 card-lift">
                            <div className="card-body">
                                {event.is_active_now ? <span className="badge badge-brand-yellow mb-2">En curso</span> : null}
                                <h3 className="h5">{event.title}</h3>
                                <p className="mb-1">{formatEventSchedule(event.starts_at, event.ends_at)}</p>
                                <p className="mb-0 text-body-secondary">
                                    {event.location.name} · {pluralize(event.participants_count, "emprendedor", "emprendedores")}
                                </p>
                            </div>
                        </article>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            <section className="page-banner py-5 mb-5">
                <div className="container py-lg-4 fade-in-up">
                    <p className="banner-tag mb-3">Formosa Capital, todo el año</p>
                    <h1 className="display-5 mb-3">Descubrí la oferta local y sumate a ella, todo en un lugar.</h1>
                    <p className="lead mb-4">Conocé a los emprendedores de tu ciudad, qué venden y en qué ferias los encontrás esta semana.</p>
                    <div className="d-flex flex-wrap gap-2">
                        <Link className="btn btn-brand-light btn-lg" to={PATHS.catalog}>Ver el catálogo</Link>
                        <Link className="btn btn-brand-outline-light btn-lg" to={PATHS.map}>Ver el mapa de ferias</Link>
                    </div>
                </div>
            </section>

            <div className="container">
                <section aria-labelledby="features-title" className="mb-5">
                    <h2 id="features-title" className="h3 section-title mb-4">¿Qué podés hacer?</h2>
                    <ul className="row g-3 list-unstyled mb-0">
                        {FEATURES.map((feature) => (
                            <li className="col-12 col-md-4" key={feature.title}>
                                <article className="card h-100 card-lift dot-pattern">
                                    <div className="card-body d-flex flex-column">
                                        <h3 className="h5">{feature.title}</h3>
                                        <p>{feature.text}</p>
                                        <Link className="btn btn-outline-primary mt-auto align-self-start" to={feature.to}>{feature.action}</Link>
                                    </div>
                                </article>
                            </li>
                        ))}
                    </ul>
                </section>

                <section aria-labelledby="upcoming-title" className="mb-5">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                        <h2 id="upcoming-title" className="h3 section-title mb-0">Próximas ferias</h2>
                        <Link to={PATHS.agenda}>Ver la agenda completa</Link>
                    </div>
                    {renderUpcomingEvents()}
                </section>

                <section className="card card-body text-center py-5" aria-labelledby="join-title">
                    <h2 id="join-title" className="h3">¿Tenés un emprendimiento?</h2>
                    <p className="mx-auto col-lg-8">Publicá tu catálogo, contá en qué ferias vas a estar y recibí consultas directas de tus clientes.</p>
                    <div>
                        <Link className="btn btn-primary btn-lg" to={PATHS.register}>Sumá tu emprendimiento</Link>
                    </div>
                </section>
            </div>
        </>
    );
}

export default HomePage;
