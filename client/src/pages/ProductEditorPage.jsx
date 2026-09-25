import { Link, useParams } from "react-router";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import useProductEditor from "../hooks/useProductEditor.js";
import ProductForm from "../components/ProductForm.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { PATHS } from "../lib/constants.js";

// Alta y edición de productos. La carga consulta al backend: un consumidor que entra por URL recibe 403 y se lo redirige.
function ProductEditorPage() {
    const { productId } = useParams();
    const { isEditing, product, status, error, saveProduct } = useProductEditor(productId);
    useDocumentTitle(isEditing ? "Editar producto" : "Publicar producto");

    const renderContent = () => {
        if (status === "error" && error.status === 404) {
            return <EmptyState title="No encontramos ese producto" message="Puede que ya lo hayas eliminado."><Link className="btn btn-primary" to={PATHS.myCatalog}>Volver a mi catálogo</Link></EmptyState>;
        }
        if (status === "error" && error.status !== 403) {
            return <ErrorState message={error.message} />;
        }
        if (status !== "success") {
            return <LoadingState message="Preparando el formulario..." />;
        }
        return <ProductForm key={product?.id ?? "new"} product={product} onSave={saveProduct} />;
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <p><Link to={PATHS.myCatalog}>Volver a mi catálogo</Link></p>
                    <h1 className="h2 mb-4">{isEditing ? "Editar producto" : "Publicar un producto"}</h1>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default ProductEditorPage;
