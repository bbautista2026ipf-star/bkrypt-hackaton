import PropTypes from "prop-types";
import ProductGrid from "./ProductGrid.jsx";
import { groupProductsByCategory } from "../lib/catalogGroups.js";

// Sin filtro de tipo ni orden por distancia, el catálogo se organiza en secciones por categoría
function CatalogResults({ products, groupByCategory }) {
    if (!groupByCategory) {
        return <ProductGrid products={products} />;
    }
    return (
        <div className="d-flex flex-column gap-5">
            {groupProductsByCategory(products).map((group) => (
                <section key={group.value} aria-labelledby={`category-${group.value}`}>
                    <h2 id={`category-${group.value}`} className="h4 section-title mb-3">{group.label}</h2>
                    <ProductGrid products={group.products} />
                </section>
            ))}
        </div>
    );
}

CatalogResults.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired
    })).isRequired,
    groupByCategory: PropTypes.bool.isRequired
};

export default CatalogResults;
