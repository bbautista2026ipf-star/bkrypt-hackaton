import PropTypes from "prop-types";
import { Link } from "react-router";
import useProductForm from "../hooks/useProductForm.js";
import FormField from "./FormField.jsx";
import FormAlert from "./FormAlert.jsx";
import { PATHS, PRODUCT_CATEGORIES, PRODUCT_IMAGE_TYPES } from "../lib/constants.js";

function ProductForm({ product = null, onSave }) {
    const {
        values, errors, formError, status, isSubmitting, formRef,
        handleChange, handleSubmit, handleImageChange, imagePreviewUrl, hasSavedImage
    } = useProductForm(product, onSave);
    const imageErrorId = errors.image ? "product-image-error" : undefined;

    return (
        <form ref={formRef} className="card card-body" onSubmit={handleSubmit} noValidate aria-label={product ? "Editar producto" : "Publicar producto"}>
            <FormAlert message={status === "error" ? formError : null} />
            <FormField id="product-name" name="name" label="Nombre del producto" required maxLength={100} value={values.name} onChange={handleChange} error={errors.name} />
            <FormField id="product-description" name="description" label="Descripción" as="textarea" rows={3} maxLength={2000} value={values.description} onChange={handleChange} error={errors.description} />
            <div className="row">
                <div className="col-12 col-md-6">
                    <FormField id="product-price" name="price" label="Precio (ARS)" type="number" min="0" step="0.01" inputMode="decimal" required value={values.price} onChange={handleChange} error={errors.price} />
                </div>
                <div className="col-12 col-md-6">
                    <FormField id="product-category" name="category" label="Categoría" as="select" required value={values.category} onChange={handleChange} error={errors.category}>
                        <option value="">Elegí una categoría</option>
                        {PRODUCT_CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                    </FormField>
                </div>
            </div>
            <div className="form-check form-switch mb-3">
                <input id="product-available" name="is_available" className="form-check-input" type="checkbox" role="switch" aria-checked={values.is_available} checked={values.is_available} onChange={handleChange} />
                <label className="form-check-label" htmlFor="product-available">Disponible para la venta</label>
                <div className="form-text">Si lo desactivás, el producto se muestra como "Sin stock" y no ofrece contacto por WhatsApp.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="product-image" className="form-label fw-semibold">Foto del producto</label>
                <input
                    id="product-image"
                    name="image"
                    type="file"
                    accept={PRODUCT_IMAGE_TYPES.join(",")}
                    className={`form-control${errors.image ? " is-invalid" : ""}`}
                    aria-invalid={errors.image ? "true" : "false"}
                    aria-describedby={["product-image-help", imageErrorId].filter(Boolean).join(" ")}
                    onChange={handleImageChange}
                />
                <div id="product-image-help" className="form-text">Opcional. JPG, PNG o WEBP de hasta 5 MB.</div>
                {errors.image ? <div id={imageErrorId} className="invalid-feedback">{errors.image}</div> : null}
                {imagePreviewUrl ? <img className="product-image-preview mt-2" src={imagePreviewUrl} alt="Vista previa de la foto del producto" /> : null}
                {hasSavedImage && !values.image ? (
                    <div className="form-check mt-2">
                        <input id="product-remove-image" name="remove_image" className="form-check-input" type="checkbox" checked={values.remove_image} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="product-remove-image">Quitar la foto actual</label>
                    </div>
                ) : null}
            </div>
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
