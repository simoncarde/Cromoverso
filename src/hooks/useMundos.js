import { useEffect, useState } from "react";

const API_MUNDOS = "https://yanethm-cromoverso-api.fly.dev/api/v1/mundos";

let cacheMundos = null;
let cacheTotalAlbum = 0;
let promesaMundos = null;

function useMundos() {
    const [mundos, setMundos] = useState(cacheMundos || []);
    const [totalAlbum, setTotalAlbum] = useState(cacheTotalAlbum);
    const [cargandoMundos, setCargandoMundos] = useState(!cacheMundos);
    const [errorMundos, setErrorMundos] = useState(false);

    useEffect(() => {
        if (cacheMundos) {
            setMundos(cacheMundos);
            setTotalAlbum(cacheTotalAlbum);
            setCargandoMundos(false);
            return;
        }

        let cancelado = false;

        async function obtenerMundos() {
            try {
                if (!promesaMundos) {
                    promesaMundos = fetch(API_MUNDOS)
                        .then((respuesta) => {
                            if (!respuesta.ok) {
                                throw new Error("No se pudieron obtener los mundos");
                            }
                            return respuesta.json();
                        })
                        .then((datos) => {
                            if (!Array.isArray(datos.datos)) {
                                throw new Error("La respuesta de mundos no es válida");
                            }
                            cacheMundos = datos.datos;
                            cacheTotalAlbum = datos.totalAlbum ?? 0;
                            return datos;
                        })
                        .finally(() => {
                            promesaMundos = null;
                        });
                }

                const datos = await promesaMundos;
                if (!cancelado) {
                    setMundos(datos.datos);
                    setTotalAlbum(datos.totalAlbum ?? 0);
                    setErrorMundos(false);
                }
            } catch (error) {
                if (!cancelado) {
                    console.error("Error al cargar los mundos:", error);
                    setErrorMundos(true);
                }
            } finally {
                if (!cancelado) {
                    setCargandoMundos(false);
                }
            }
        }

        obtenerMundos();

        return () => {
            cancelado = true;
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
