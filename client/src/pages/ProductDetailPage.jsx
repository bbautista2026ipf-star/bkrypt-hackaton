import { Link, useParams } from "react-router";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import useProductDetail from "../hooks/useProductDetail.js";
import ProductMedia from "../components/ProductMedia.jsx";
import ProductContact from "../components/ProductContact.jsx";
import ProductReviews from "../components/ProductReviews.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { PATHS, getCategoryLabel } from "../lib/constants.js";
import { formatPrice } from "../lib/formatters.js";

// Detalle del producto: contacto directo con el emprendedor y reseñas de otros compradores
function ProductDetailPage() {
    const { productId } = useParams();
    const detail = useProductDetail(productId);
    const { product, status, error, reload, canDeleteProduct, productRemoval } = detail;
    useDocumentTitle(product?.name ?? "Producto");

    if (status === "error") {
        return (
            <div className="container py-5">
                {error.status === 404 || error.status === 400
                    ? <EmptyState title="No encontramos este producto" message="Puede que ya no esté publicado."><Link className="btn btn-primary" to={PATHS.catalog}>Ir al catálogo</Link></EmptyState>
                    : <ErrorState message={error.message} onRetry={reload} />}
            </div>
        );
    }
    if (product?.id !== productId) {
        return <div className="container py-5"><LoadingState message="Cargando el producto..." /></div>;
    }

    return (
        <div className="container py-5">
            <p><Link to={PATHS.catalog}>Volver al catálogo</Link></p>
            <article className="row g-4">
                <div className="col-12 col-md-5">
                    <div className="product-detail-media">
                        <ProductMedia name={product.name} imageUrl={product.image_url} />
                    </div>
                </div>
                <div className="col-12 col-md-7 d-flex flex-column gap-2">
                    <div className="d-flex flex-wrap gap-2">
                        <span className="badge badge-brand-teal">{getCategoryLabel(product.category)}</span>
                        {product.is_available
                            ? <span className="badge text-bg-light border">Disponible</span>
                            : <span className="badge text-bg-secondary">Sin stock</span>}
                    </div>
                    <h1 className="h2 mb-0">{product.name}</h1>
                    <p className="product-price fs-3 mb-0">{formatPrice(product.price)}</p>
                    <p className="mb-0">De <Link to={PATHS.entrepreneur(product.entrepreneur.id)}>{product.entrepreneur.brand_name}</Link></p>
                    {product.description ? <p className="mb-0">{product.description}</p> : null}
                    <div className="mt-2 col-lg-8">
                        <ProductContact product={product} entrepreneur={product.entrepreneur} />
                    </div>
                    {canDeleteProduct ? (
                        <div>
                            <button type="button" className="btn btn-outline-danger mt-2" onClick={() => productRemoval.open(product)}>
                                Eliminar producto
                            </button>
                        </div>
                    ) : null}
                </div>
            </article>
            <ProductReviews product={product} detail={detail} />
            <ConfirmDialog
                id="delete-product-detail"
                title="Eliminar producto"
                message={`"${product.name}" se retira del catálogo junto con sus reseñas. Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar producto"
                isOpen={productRemoval.isOpen}
                isProcessing={productRemoval.isRunning}
                error={productRemoval.error}
                onConfirm={productRemoval.confirm}
                onClose={productRemoval.close}
            />
        </div>
    );
}

export default ProductDetailPage;
