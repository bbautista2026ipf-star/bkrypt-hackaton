const HIGHLIGHT_CLASS = "is-highlighted";
const HIGHLIGHT_DURATION_MS = 900;

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Desplaza la vista hasta la sección y la resalta brevemente para indicar a dónde se movió
export const scrollToSection = (element) => {
    if (!element) {
        return;
    }
    element.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    element.classList.remove(HIGHLIGHT_CLASS);
    element.classList.add(HIGHLIGHT_CLASS);
    window.setTimeout(() => element.classList.remove(HIGHLIGHT_CLASS), HIGHLIGHT_DURATION_MS);
    element.focus({ preventScroll: true });
};
