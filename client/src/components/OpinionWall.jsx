import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth.js";
import useOpinionWall from "../hooks/useOpinionWall.js";
import LoadingState from "./LoadingState.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyState from "./EmptyState.jsx";
import StarRating from "./StarRating.jsx";
import OpinionComposer from "./OpinionComposer.jsx";
import OpinionItem from "./OpinionItem.jsx";
import ReasonDialog from "./ReasonDialog.jsx";
import { formatRating, pluralize } from "../lib/formatters.js";

// Muro de opiniones dentro del perfil público del emprendedor (no tiene sección propia en el menú)
function OpinionWall({ entrepreneurId, isOwnProfile }) {
    const { user } = useAuth();
    const wall = useOpinionWall(entrepreneurId, user?.id);
    const hasOpinions = wall.summary?.opinions_count > 0;

    const renderContent = () => {
        if (!wall.hasLoaded && wall.status === "loading") {
            return <LoadingState message="Cargando opiniones..." />;
        }
        if (wall.status === "error") {
            return <ErrorState message={wall.error.message} onRetry={wall.reload} />;
        }
        return (
            <>
                <OpinionComposer isOwnProfile={isOwnProfile} existingOpinion={wall.ownOpinion} onSubmitOpinion={wall.submitOpinion} />
                {wall.opinions.length === 0 ? (
                    <EmptyState title="Todavía no hay opiniones" message="Cuando alguien comparta su experiencia con este emprendimiento, la vas a ver acá." />
                ) : (
                    <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                        {wall.opinions.map((opinion) => (
                            <li key={opinion.id}>
                                <OpinionItem opinion={opinion} canReport={isOwnProfile} onReport={wall.openReport} />
                            </li>
                        ))}
                    </ul>
                )}
            </>
        );
    };

    return (
        <section className="mt-5" aria-labelledby="opinions-title">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
                <h2 id="opinions-title" className="h3 section-title mb-0">Opiniones</h2>
                {hasOpinions ? (
                    <p className="mb-0 d-flex align-items-center gap-2">
                        <StarRating value={wall.summary.average_rating} />
                        <span>{formatRating(wall.summary.average_rating)} · {pluralize(wall.summary.opinions_count, "opinión", "opiniones")}</span>
                    </p>
                ) : null}
            </div>
            {renderContent()}
            {isOwnProfile ? (
                <ReasonDialog
                    id="report-opinion"
                    title="Reportar opinión"
                    description="La opinión seguirá visible hasta que la administración la revise. Contanos por qué la reportás."
                    label="Motivo del reporte"
                    confirmLabel="Enviar reporte"
                    isOpen={Boolean(wall.reportTarget)}
                    onConfirm={wall.confirmReport}
                    onClose={wall.closeReport}
                />
            ) : null}
        </section>
    );
}

OpinionWall.propTypes = {
    entrepreneurId: PropTypes.string.isRequired,
    isOwnProfile: PropTypes.bool.isRequired
};

export default OpinionWall;
