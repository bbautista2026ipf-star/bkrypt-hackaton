import PropTypes from "prop-types";
import { Link } from "react-router";
import useProductForm from "../hooks/useProductForm.js";
import FormField from "./FormField.jsx";
import FormAlert from "./FormAlert.jsx";
import { PATHS, PRODUCT_CATEGORIES } from "../lib/constants.js";

function ProductForm({ product = null, onSave }) {
    const { values, errors, formError, status, isSubmitting, formRef, handleChange, handleSubmit } = useProductForm(product, onSave);

    return (
        <form ref={formRef} className="card card-body" onSubmit={handleSubmit} noValidate aria-label={product ? "Editar producto" : "Publicar producto"}>
            <FormAlert message={status === "error" ? formError : null} />
            <FormField id="product-name" name="name" label="Nombre del producto" required maxLength={100} value={values.name} onChange={handleChange} error={errors.name} />
            <FormField id="product-description" name="description" label="Descripción" as="textarea" rows={3} maxLength={2000} value={values.description} onChange={handleChange} error={errors.description} />
            <div className="row">
                <div className="col-12 col-md-4">
                    <FormField id="product-price" name="price" label="Precio (ARS)" type="number" min="0" step="0.01" inputMode="decimal" required value={values.price} onChange={handleChange} error={errors.price} />
                </div>
                <div className="col-12 col-md-4">
                    <FormField id="product-stock" name="stock" label="Stock disponible" type="number" min="0" step="1" inputMode="numeric" required value={values.stock} onChange={handleChange} error={errors.stock} help="Con stock 0 el producto se muestra como “Sin stock”." />
                </div>
                <div className="col-12 col-md-4">
                    <FormField id="product-category" name="category" label="Categoría" as="select" required value={values.category} onChange={handleChange} error={errors.category}>
                        <option value="">Elegí una categoría</option>
                        {PRODUCT_CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                    </FormField>
                </div>
            </div>
            <FormField id="product-image" name="image_url" label="Enlace a una foto" type="url" placeholder="https://..." value={values.image_url} onChange={handleChange} error={errors.image_url} help="Opcional. Pegá el enlace de una imagen publicada (por ejemplo, desde tu Instagram)." />
            <div className="d-flex flex-wrap gap-2">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : product ? "Guardar cambios" : "Publicar producto"}
                </button>
                <Link className="btn btn-outline-secondary" to={PATHS.myCatalog}>Cancelar</Link>
            </div>
        </form>
    );
}

ProductForm.propTypes = {
    product: PropTypes.object,
    onSave: PropTypes.func.isRequired
};

export default ProductForm;
