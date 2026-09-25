// Lee un valor de la paleta definido en theme.css para usarlo donde el CSS no llega (por ejemplo, los marcadores del mapa)
export const readCssVariable = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
