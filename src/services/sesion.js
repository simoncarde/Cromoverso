import { API_ENDPOINTS } from "./api.js";

export async function crearSesion(correo, clave) {
    const respuesta = await fetch(API_ENDPOINTS.sesion, {
        method: "POST",
        credentials: "include",
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

export async function obtenerSesion() {
    const respuesta = await fetch(API_ENDPOINTS.sesion, {
        credentials: "include",
    });

    const datos = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
        const error = new Error(datos.mensaje || datos.error || "");
        error.status = respuesta.status;
        error.codigo = datos.codigo || datos.error?.codigo || datos.error;
        throw error;
    }
    return datos?.datos ?? datos;
}

export async function eliminarSesion() {
    const respuesta = await fetch(API_ENDPOINTS.sesion, {
        method: "DELETE",
        credentials: "include",
    });

    if (!respuesta.ok && respuesta.status !== 204) {
        const datos = await respuesta.json().catch(() => ({}));
        const error = new Error(datos.mensaje || datos.error || "");
        error.status = respuesta.status;
        throw error;
    }
}
