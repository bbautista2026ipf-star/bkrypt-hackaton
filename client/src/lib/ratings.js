// Promedio del emprendimiento a partir de sus productos, ponderado por la cantidad de reseñas de cada uno
export const summarizeProductRatings = (products) => {
    const reviewsCount = products.reduce((total, product) => total + (product.reviews_count ?? 0), 0);
    if (reviewsCount === 0) {
        return { averageRating: null, reviewsCount: 0 };
    }
    const weightedSum = products.reduce((sum, product) => sum + (product.average_rating ?? 0) * (product.reviews_count ?? 0), 0);
    return { averageRating: Math.round((weightedSum / reviewsCount) * 10) / 10, reviewsCount };
};
