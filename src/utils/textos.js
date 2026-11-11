/**
 * Reemplaza variables en una plantilla de texto tipo "{variable}".
 * Ejemplo: formatearTexto("Mundo {numero} de {total}", { numero: 1, total: 6 })
 * Resultado: "Mundo 1 de 6"
 */
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
