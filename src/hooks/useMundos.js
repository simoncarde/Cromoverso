import { useEffect, useState } from "react";

const API_MUNDOS =
    "https://yanethm-cromoverso-api.fly.dev/api/v1/mundos";

function useMundos() {
    const [mundos, setMundos] = useState([]);
    const [totalAlbum, setTotalAlbum] = useState(0);
    const [cargandoMundos, setCargandoMundos] = useState(true);
    const [errorMundos, setErrorMundos] = useState(false);
    useEffect(() => {
        const controlador = new AbortController();
        async function obtenerMundos() {
            try {
                const respuesta = await fetch(API_MUNDOS, {
                    signal: controlador.signal
                });
                if (!respuesta.ok) {
                    throw new Error("No se pudieron obtener los mundos");
                }
                const datos = await respuesta.json();
                if (!Array.isArray(datos.datos)) {
                    throw new Error("La respuesta de mundos no es válida");
                }
                setMundos(datos.datos);
                setTotalAlbum(datos.totalAlbum ?? 0);
                setErrorMundos(false);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error al cargar los mundos:", error);
                    setErrorMundos(true);
                }
            } finally {
                if (!controlador.signal.aborted) {
                    setCargandoMundos(false);
                }
            }
        }
        obtenerMundos();
        return () => {
            controlador.abort();
        };
    }, []);
    return {
        mundos,
        totalAlbum,
        cargandoMundos,
        errorMundos
    };
}

export default useMundos;
