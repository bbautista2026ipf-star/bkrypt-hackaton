import { useState } from "react";
import PropTypes from "prop-types";
import useAsyncAction from "../hooks/useAsyncAction.js";
import { useImagePreview } from "../hooks/useProductForm.js";
import FormAlert from "./FormAlert.jsx";
import { validateImage } from "../lib/productForm.js";
import { toAssetUrl } from "../lib/apiConfig.js";

// Cambio de imagen de un producto desde la moderación del administrador: reemplazarla por otra o quitarla
function ProductImageForm({ product, onSave }) {
    const [image, setImage] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [imageError, setImageError] = useState(null);
    const newImagePreview = useImagePreview(image);
    const saving = useAsyncAction(onSave);
    const hasSavedImage = Boolean(product.image_url);
    const imageErrorId = imageError ? "admin-product-image-error" : undefined;
    const previewUrl = newImagePreview ?? (removeImage ? null : toAssetUrl(product.image_url));

    const handleImageChange = (event) => {
        const file = event.target.files?.[0] ?? null;
        setImage(file);
        setRemoveImage(false);
        setImageError(validateImage(file));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!image && !removeImage) {
            setImageError("Elegí una imagen nueva o marcá la opción para quitar la actual");
            return;
        }
        if (imageError) {
            return;
        }
        const imageData = new FormData();
        if (image) {
            imageData.append("image", image);
        } else {
            imageData.append("remove_image", "true");
        }
        await saving.run(imageData);
    };

    return (
        <form onSubmit={handleSubmit} noValidate aria-label={`Cambiar la imagen de ${product.name}`}>
            <FormAlert message={saving.error} />
            {previewUrl ? (
                <img className="product-image-preview mb-3" src={previewUrl} alt={image ? `Vista previa de la nueva imagen de ${product.name}` : `Imagen actual de ${product.name}`} />
            ) : (
                <p className="text-body-secondary">El producto no tiene imagen.</p>
            )}
            <div className="mb-3">
                <label htmlFor="admin-product-image" className="form-label fw-semibold">Nueva imagen</label>
                <input
                    id="admin-product-image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className={`form-control${imageError ? " is-invalid" : ""}`}
                    aria-invalid={imageError ? "true" : "false"}
                    aria-describedby={["admin-product-image-help", imageErrorId].filter(Boolean).join(" ")}
                    onChange={handleImageChange}
                />
                <div id="admin-product-image-help" className="form-text">JPG, PNG o WEBP de hasta 5 MB. Reemplaza la imagen actual.</div>
                {imageError ? <div id={imageErrorId} className="invalid-feedback">{imageError}</div> : null}
            </div>
            {hasSavedImage && !image ? (
                <div className="form-check mb-3">
                    <input
                        id="admin-product-remove-image"
                        className="form-check-input"
                        type="checkbox"
                        checked={removeImage}
                        onChange={(event) => {
                            setRemoveImage(event.target.checked);
                            setImageError(null);
                        }}
                    />
                    <label className="form-check-label" htmlFor="admin-product-remove-image">Quitar la imagen actual</label>
                </div>
            ) : null}
            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" disabled={saving.isRunning}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving.isRunning}>
                    {saving.isRunning ? "Guardando..." : "Guardar imagen"}
                </button>
            </div>
        </form>
    );
}

ProductImageForm.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        image_url: PropTypes.string
    }).isRequired,
    onSave: PropTypes.func.isRequired
};

export default ProductImageForm;
