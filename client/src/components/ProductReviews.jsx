import PropTypes from "prop-types";
import ReviewComposer from "./ReviewComposer.jsx";
import ReviewItem from "./ReviewItem.jsx";
import EmptyState from "./EmptyState.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import RatingSummary from "./RatingSummary.jsx";

// Reseñas y calificaciones del producto: la reseña propia aparece apenas se publica y el promedio se recalcula
function ProductReviews({ product, detail }) {
    const { isOwnProduct, canReview, ownReview, canDeleteReview, submitReview, reviewRemoval } = detail;

    return (
        <section className="mt-5" aria-labelledby="reviews-title">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
                <h2 id="reviews-title" className="h3 section-title mb-0">Reseñas</h2>
                <RatingSummary averageRating={product.average_rating} reviewsCount={product.reviews_count} />
            </div>
            <ReviewComposer isOwnProduct={isOwnProduct} canReview={canReview} existingReview={ownReview} onSubmitReview={submitReview} />
            {product.reviews.length === 0 ? (
                <EmptyState title="Todavía no hay reseñas" message="Cuando alguien califique este producto, lo vas a ver acá." />
            ) : (
                <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                    {product.reviews.map((review) => (
                        <li key={review.id}>
                            <ReviewItem review={review} canDelete={canDeleteReview(review)} onDelete={reviewRemoval.open} />
                        </li>
                    ))}
                </ul>
            )}
            <ConfirmDialog
                id="delete-review"
                title="Eliminar reseña"
                message="La reseña se borra del producto y deja de contar en su calificación."
                confirmLabel="Eliminar reseña"
                isOpen={reviewRemoval.isOpen}
                isProcessing={reviewRemoval.isRunning}
                error={reviewRemoval.error}
                onConfirm={reviewRemoval.confirm}
                onClose={reviewRemoval.close}
            />
        </section>
    );
}

ProductReviews.propTypes = {
    product: PropTypes.shape({
        average_rating: PropTypes.number,
        reviews_count: PropTypes.number.isRequired,
        reviews: PropTypes.arrayOf(PropTypes.object).isRequired
    }).isRequired,
    detail: PropTypes.shape({
        isOwnProduct: PropTypes.bool.isRequired,
        canReview: PropTypes.bool.isRequired,
        ownReview: PropTypes.object,
        canDeleteReview: PropTypes.func.isRequired,
        submitReview: PropTypes.func.isRequired,
        reviewRemoval: PropTypes.shape({
            isOpen: PropTypes.bool.isRequired,
            isRunning: PropTypes.bool.isRequired,
            error: PropTypes.string,
            open: PropTypes.func.isRequired,
            close: PropTypes.func.isRequired,
            confirm: PropTypes.func.isRequired
        }).isRequired
    }).isRequired
};

export default ProductReviews;
