const API_BASE_URL = String(import.meta.env.VITE_API_URL || "")
    .trim()
    .replace(/\/+$/, "");

if (!API_BASE_URL) {
    throw new Error("Configura VITE_API_URL con la URL base de la API de Cromoverso.");
}

export const API_ENDPOINTS = Object.freeze({
    textos: `${API_BASE_URL}/textos`,
    mundos: `${API_BASE_URL}/mundos`,
    cromos: `${API_BASE_URL}/cromos`,
});

export function urlTextos(idioma) {
    return `${API_ENDPOINTS.textos}?idioma=${encodeURIComponent(idioma)}`;
}

export function urlCromo(id) {
    return `${API_ENDPOINTS.cromos}/${encodeURIComponent(id)}`;
}

export function urlPaginaCromos(pagina, porPagina = 20) {
    const parametros = new URLSearchParams({
        pagina: String(pagina),
        porPagina: String(porPagina),
    });
    return `${API_ENDPOINTS.cromos}?${parametros}`;
}
