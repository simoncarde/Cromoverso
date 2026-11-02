import { useEffect, useState } from "react";

const API_CROMOS = "https://yanethm-cromoverso-api.fly.dev/api/v1/cromos";
const IDS_DESTACADOS = ["CV-041", "CV-001", "CV-002"];

export default function useCromos() {
    const [cromos, setCromos] = useState([]);
    const [cargandoCromos, setCargandoCromos] = useState(true);
    const [errorCromos, setErrorCromos] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        async function cargar() {
            try {
                const resultados = await Promise.all(IDS_DESTACADOS.map(async (id) => {
                    const respuesta = await fetch(`${API_CROMOS}/${id}`, { signal: controller.signal });
                    if (!respuesta.ok) throw new Error(`No se pudo cargar ${id}: ${respuesta.status}`);
                    const datos = await respuesta.json();
                    return datos?.datos ?? datos;
                }));
                if (!controller.signal.aborted) {
                    setCromos(resultados);
                    setErrorCromos(false);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Error al cargar cromos destacados:", err);
                    setErrorCromos(true);
                }
            } finally {
                if (!controller.signal.aborted) setCargandoCromos(false);
            }
        }
        cargar();
        return () => controller.abort();
    }, []);

    return { cromos, cargandoCromos, errorCromos };
}
