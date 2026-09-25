import { Link } from "react-router";
import useAdminProducts from "../hooks/useAdminProducts.js";
import LoadingState from "./LoadingState.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyState from "./EmptyState.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import BootstrapModal from "./BootstrapModal.jsx";
import ProductImageForm from "./ProductImageForm.jsx";
import Pagination from "./Pagination.jsx";
import { PATHS, getCategoryLabel } from "../lib/constants.js";
import { formatPrice } from "../lib/formatters.js";

// Moderación de productos publicados: el administrador puede cambiar su imagen o retirar los que no correspondan
function AdminProducts() {
    const {
        products, pagination, page, setPage, status, error, reload, removal,
        imageEditor, openImageEditor, closeImageEditor, saveProductImage
    } = useAdminProducts();

    if (status === "loading" && products.length === 0) {
        return <LoadingState message="Cargando productos..." />;
    }
    if (status === "error") {
        return <ErrorState message={error.message} onRetry={reload} />;
    }

    return (
        <>
            <p>Las reseñas se moderan desde el detalle de cada producto.</p>
            {products.length === 0 ? (
                <EmptyState title="Todavía no hay productos publicados" />
            ) : (
                <ul className="list-group">
                    {products.map((product) => (
                        <li key={product.id} className="list-group-item d-flex flex-column flex-sm-row justify-content-between gap-2">
                            <div>
                                <Link className="fw-bold" to={PATHS.product(product.id)}>{product.name}</Link>
                                <p className="mb-0 text-body-secondary">
                                    {product.entrepreneur.brand_name} · {getCategoryLabel(product.category)} · {formatPrice(product.price)}
                                </p>
                            </div>
                            <div className="d-flex gap-2 align-self-sm-center">
                                <button type="button" className="btn btn-outline-primary" onClick={() => openImageEditor(product)}>
                                    Cambiar imagen<span className="visually-hidden"> de {product.name}</span>
                                </button>
                                <button type="button" className="btn btn-outline-danger" onClick={() => removal.open(product)}>
                                    Eliminar<span className="visually-hidden"> {product.name}</span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {pagination ? <Pagination page={page} totalPages={pagination.total_pages} onPageChange={setPage} label="Páginas de productos" /> : null}
            <BootstrapModal
                id="admin-product-image"
                title={imageEditor.product ? `Imagen de ${imageEditor.product.name}` : "Imagen del producto"}
                isOpen={imageEditor.isOpen}
                onClose={closeImageEditor}
            >
                {imageEditor.product ? (
                    <ProductImageForm key={imageEditor.version} product={imageEditor.product} onSave={saveProductImage} />
                ) : null}
            </BootstrapModal>
            <ConfirmDialog
                id="admin-delete-product"
                title="Eliminar producto"
                message={`"${removal.target?.name ?? ""}" se retira del catálogo junto con sus reseñas. Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar producto"
                isOpen={removal.isOpen}
                isProcessing={removal.isRunning}
                error={removal.error}
                onConfirm={removal.confirm}
                onClose={removal.close}
            />
        </>
    );
}

export default AdminProducts;
