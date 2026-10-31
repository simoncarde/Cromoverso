
import { useEffect, useState } from "react";

const API_CROMOS = "https://yanethm-cromoverso-api.fly.dev/api/v1/cromos";

const IDS_DESTACADOS = ["CV-041", "CV-001", "CV-002"];

function useCromos() {
    const [cromos, setCromos] = useState([]);
    const [cargandoCromos, setCargandoCromos] = useState(true);
    const [errorCromos, setErrorCromos] = useState(false);
    useEffect(() => {
        async function obtenerCromos() {
            try {
                const resultados = await Promise.all(
                    IDS_DESTACADOS.map(async (id) => {
                        const respuesta = await fetch(`${API_CROMOS}/${id}`);
                        if (!respuesta.ok) {
                            throw new Error(`No se pudo cargar ${id}`);
                        }
                        const datos = await respuesta.json();
                        return datos.datos ?? datos;
                    })
                );
                setCromos(resultados);
                setErrorCromos(false);
            } catch (error) {
                console.error("Error al cargar cromos:", error);
                setErrorCromos(true);
            } finally {
                setCargandoCromos(false);
            }
        }
        obtenerCromos();
    }, []);
    return {
        cromos,
        cargandoCromos,
        errorCromos
    };
}

export default useCromos;
