import { useEffect, useState } from "react";
import { urlPaginaCromos } from "../services/api.js";

let cacheColeccion = null;
let promesaColeccion = null;

export default function useColeccionCromos() {
    const [cromos, setCromos] = useState(cacheColeccion || []);
    const [cargando, setCargando] = useState(!cacheColeccion);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (cacheColeccion) {
            setCromos(cacheColeccion);
            setCargando(false);
            return;
        }

        let cancelado = false;

        async function cargar() {
            try {
                if (!promesaColeccion) {
                    promesaColeccion = (async () => {
                        const primeraRespuesta = await fetch(urlPaginaCromos(1));
                        if (!primeraRespuesta.ok) throw new Error(`API cromos: ${primeraRespuesta.status}`);
                        const primera = await primeraRespuesta.json();
                        if (!Array.isArray(primera?.datos)) throw new Error("La API no devolvió una lista de cromos.");

                        const paginas = Number(primera?.paginacion?.paginas ?? 1);
                        const restantes = await Promise.all(
                            Array.from({ length: Math.max(0, paginas - 1) }, (_, indice) => indice + 2).map(async (pagina) => {
                                const respuesta = await fetch(urlPaginaCromos(pagina));
                                if (!respuesta.ok) throw new Error(`API cromos página ${pagina}: ${respuesta.status}`);
                                const resultado = await respuesta.json();
                                if (!Array.isArray(resultado?.datos)) throw new Error(`Respuesta inválida en página ${pagina}.`);
                                return resultado.datos;
                            })
                        );

                        const todos = [...primera.datos, ...restantes.flat()];
                        todos.sort((a, b) => Number(a.numero) - Number(b.numero));
                        cacheColeccion = todos;
                        return todos;
                    })().finally(() => {
                        promesaColeccion = null;
                    });
                }

                const todos = await promesaColeccion;
                if (!cancelado) {
                    setCromos(todos);
                    setError(false);
                }
            } catch (err) {
                if (!cancelado) {
                    console.error("No se pudo cargar la colección de cromos:", err);
                    setError(true);
                }
            } finally {
                if (!cancelado) {
                    setCargando(false);
                }
            }
        }

        cargar();

        return () => {
            cancelado = true;
        };
    }, []);

    return { cromos, cargando, error };
}
