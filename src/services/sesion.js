import { API_ENDPOINTS } from "./api.js";

export async function crearSesion(correo, clave) {
    const respuesta = await fetch(API_ENDPOINTS.sesion, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, clave }),
    });

    const datos = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
        const error = new Error(datos.mensaje || datos.error || "");
        error.status = respuesta.status;
        error.datos = datos;
        error.retryAfter = respuesta.headers.get("Retry-After");
        throw error;
    }
    return datos;
}
