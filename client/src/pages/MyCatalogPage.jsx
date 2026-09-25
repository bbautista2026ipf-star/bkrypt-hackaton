import { Link } from "react-router";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import useOwnCatalog from "../hooks/useOwnCatalog.js";
import useConfirmation from "../hooks/useConfirmation.js";
import useFlashMessage from "../hooks/useFlashMessage.js";
import PageBanner from "../components/PageBanner.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import FormAlert from "../components/FormAlert.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { PATHS } from "../lib/constants.js";

// Solo los productos propios, con crear, editar y eliminar visibles. La ruta exige rol emprendedor y el backend valida cada cambio.
function MyCatalogPage() {
    useDocumentTitle("Mi catálogo");
    const flashMessage = useFlashMessage();
    const { entrepreneur, products, status, error, reload, removeProduct } = useOwnCatalog();
    const removal = useConfirmation(removeProduct);

    if (status === "error") {
        return <div className="container py-5"><ErrorState message={error.message} onRetry={reload} /></div>;
    }
    if (!entrepreneur) {
        return <div className="container py-5"><LoadingState message="Cargando tu catálogo..." /></div>;
    }

    return (
        <>
            <PageBanner tag="Mi catálogo" title={entrepreneur.brand_name} lead="Mantené actualizados precios y disponibilidad: es lo que ven los consumidores.">
                <Link className="btn btn-brand-light" to={PATHS.newProduct}>Publicar un producto</Link>
                <Link className="btn btn-brand-outline-light" to={PATHS.entrepreneur(entrepreneur.id)}>Ver mi perfil público</Link>
            </PageBanner>
            <div className="container">
                <FormAlert message={flashMessage} variant="success" />
                {products.length > 0 ? (
                    <ProductGrid products={products} variant="owner" onDelete={removal.open} />
                ) : (
                    <EmptyState title="Todavía no publicaste productos" message="Publicá el primero para que aparezca en el catálogo general.">
                        <Link className="btn btn-primary" to={PATHS.newProduct}>Publicar un producto</Link>
                    </EmptyState>
                )}
            </div>
            <ConfirmDialog
                id="delete-product"
                title="Eliminar producto"
                message={`"${removal.target?.name ?? ""}" deja de aparecer en el catálogo. Esta acción no se puede deshacer.`}
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

export default MyCatalogPage;
