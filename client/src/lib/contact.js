// wa.me solo acepta dígitos: se quita el "+" y cualquier separador
export const buildWhatsAppLink = (phoneNumber, message) => {
    const digits = String(phoneNumber).replace(/\D/g, "");
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};

export const buildProductInquiry = (productName, brandName) =>
    `Hola ${brandName}, vi "${productName}" en FormoBuy y quería consultar por el producto.`;

export const buildGreeting = (brandName) => `Hola ${brandName}, te encontré en FormoBuy.`;
