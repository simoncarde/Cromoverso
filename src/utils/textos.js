
export function formatearTexto(plantilla, valores = {}) {
    if (!plantilla || typeof plantilla !== "string") {
        return "";
    }
    return plantilla.replace(/\{(\w+)\}/g, (coincidencia, clave) => {
        return clave in valores && valores[clave] !== undefined && valores[clave] !== null
            ? String(valores[clave])
            : coincidencia;
    });
}
