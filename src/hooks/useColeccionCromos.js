import { useEffect, useState } from "react";

const API_CROMOS = "https://yanethm-cromoverso-api.fly.dev/api/v1/cromos";

export default function useColeccionCromos() {
    const [cromos, setCromos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function cargar() {
            try {
                const primeraRespuesta = await fetch(`${API_CROMOS}?pagina=1&porPagina=20`, { signal: controller.signal });
                if (!primeraRespuesta.ok) throw new Error(`API cromos: ${primeraRespuesta.status}`);
                const primera = await primeraRespuesta.json();
                if (!Array.isArray(primera?.datos)) throw new Error("La API no devolvió una lista de cromos.");

                const paginas = Number(primera?.paginacion?.paginas ?? 1);
                const restantes = await Promise.all(
                    Array.from({ length: Math.max(0, paginas - 1) }, (_, indice) => indice + 2).map(async (pagina) => {
                        const respuesta = await fetch(`${API_CROMOS}?pagina=${pagina}&porPagina=20`, { signal: controller.signal });
                        if (!respuesta.ok) throw new Error(`API cromos página ${pagina}: ${respuesta.status}`);
                        const resultado = await respuesta.json();
                        if (!Array.isArray(resultado?.datos)) throw new Error(`Respuesta inválida en página ${pagina}.`);
                        return resultado.datos;
                    })
                );

                const todos = [...primera.datos, ...restantes.flat()];
                todos.sort((a, b) => Number(a.numero) - Number(b.numero));
                if (!controller.signal.aborted) {
                    setCromos(todos);
                    setError(false);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("No se pudo cargar la colección de cromos:", err);
                    setError(true);
                }
            } finally {
                if (!controller.signal.aborted) setCargando(false);
            }
        }

        cargar();
        return () => controller.abort();
    }, []);

    return { cromos, cargando, error };
}
