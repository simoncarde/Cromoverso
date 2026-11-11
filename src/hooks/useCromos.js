import { useEffect, useState } from "react";
import { urlCromo } from "../services/api.js";
const IDS_DESTACADOS = ["CV-041", "CV-001", "CV-002"];

let cacheCromos = null;
let promesaCromos = null;

export default function useCromos() {
    const [cromos, setCromos] = useState(cacheCromos || []);
    const [cargandoCromos, setCargandoCromos] = useState(!cacheCromos);
    const [errorCromos, setErrorCromos] = useState(false);

    useEffect(() => {
        if (cacheCromos) {
            setCromos(cacheCromos);
            setCargandoCromos(false);
            return;
        }

        let cancelado = false;

        async function cargar() {
            try {
                if (!promesaCromos) {
                    promesaCromos = Promise.all(
                        IDS_DESTACADOS.map(async (id) => {
                            const respuesta = await fetch(urlCromo(id));
                            if (!respuesta.ok) throw new Error(`No se pudo cargar ${id}: ${respuesta.status}`);
                            const datos = await respuesta.json();
                            return datos?.datos ?? datos;
                        })
                    )
                        .then((resultados) => {
                            cacheCromos = resultados;
                            return resultados;
                        })
                        .finally(() => {
                            promesaCromos = null;
                        });
                }

                const resultados = await promesaCromos;
                if (!cancelado) {
                    setCromos(resultados);
                    setErrorCromos(false);
                }
            } catch (err) {
                if (!cancelado) {
                    console.error("Error al cargar cromos destacados:", err);
                    setErrorCromos(true);
                }
            } finally {
                if (!cancelado) {
                    setCargandoCromos(false);
                }
            }
        }

        cargar();

        return () => {
            cancelado = true;
        };
    }, []);

    return { cromos, cargandoCromos, errorCromos };
}
