import { literal } from "sequelize";

// Subconsultas en lugar de GROUP BY: MySQL 8 (ONLY_FULL_GROUP_BY) rechaza agrupar cuando hay includes.
// "tableAlias" es el alias con el que Sequelize nombra a la tabla de productos en la consulta
// ("Product" en consultas directas, "products" cuando se incluye desde un emprendedor).
export const ratingAttributes = (tableAlias = "Product") => [
    [literal(`(SELECT ROUND(AVG(r.stars), 1) FROM reviews AS r WHERE r.product_id = \`${tableAlias}\`.\`id\`)`), "average_rating"],
    [literal(`(SELECT COUNT(*) FROM reviews AS r WHERE r.product_id = \`${tableAlias}\`.\`id\`)`), "reviews_count"]
];

// MySQL devuelve el promedio como texto (DECIMAL); se convierte a número para el frontend
export const formatProductRating = (product) => {
    const data = typeof product.toJSON === "function" ? product.toJSON() : product;
    return {
        ...data,
        average_rating: data.average_rating === null ? null : Number(data.average_rating),
        reviews_count: Number(data.reviews_count)
    };
};
