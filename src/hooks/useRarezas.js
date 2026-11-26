import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../services/api.js";

let cacheRarezas = null;
let promesaRarezas = null;

export default function useRarezas() {
    const [rarezas, setRarezas] = useState(cacheRarezas || []);
    const [cargandoRarezas, setCargandoRarezas] = useState(!cacheRarezas);
    const [errorRarezas, setErrorRarezas] = useState(false);

    useEffect(() => {
        if (cacheRarezas) {
            setRarezas(cacheRarezas);
            setCargandoRarezas(false);
            return;
        }

        let cancelado = false;

        async function cargar() {
            try {
                if (!promesaRarezas) {
                    promesaRarezas = fetch(API_ENDPOINTS.rarezas)
                        .then((respuesta) => {
                            if (!respuesta.ok) throw new Error(`API rarezas: ${respuesta.status}`);
                            return respuesta.json();
                        })
                        .then((resultado) => {
                            const lista = Array.isArray(resultado?.datos) ? resultado.datos : [];
                            cacheRarezas = lista;
                            return lista;
                        })
                        .finally(() => {
                            promesaRarezas = null;
                        });
                }

                const lista = await promesaRarezas;
                if (!cancelado) {
                    setRarezas(lista);
                    setErrorRarezas(false);
                }
            } catch (err) {
                if (!cancelado) {
                    console.error("No se pudieron cargar las rarezas:", err);
                    setErrorRarezas(true);
                }
            } finally {
                if (!cancelado) {
                    setCargandoRarezas(false);
                }
            }
        }

        cargar();

        return () => {
            cancelado = true;
        };
    }, []);

    return { rarezas, cargandoRarezas, errorRarezas };
}
