import { useEffect, useState } from "react";

const API = "https://yanethm-cromoverso-api.fly.dev/api/v1/textos";
const MENU_MOVIL = ["inicio", "mundos"];

function validarTextos(datos) {
    const textos = datos?.textos;
    const nav = textos?.navbar;
    const menu = textos?.menuMovil;
    const etiquetas = [
        nav?.logo?.texto,
        nav?.logo?.aria,
        nav?.enlaces?.inicio,
        nav?.enlaces?.mundos,
        nav?.botones?.ingresar,
        nav?.botones?.crearCuenta,
        ...MENU_MOVIL.map((item) => menu?.enlaces?.[item])
    ];
    if (!etiquetas.every((item) => typeof item === "string" && item.trim())) {
        throw new Error("La respuesta no contiene los textos del navbar.");
    }
    return textos;
}

function useTextos(idioma) {
    const [textos, setTextos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function cargarTextos() {
            try {
                setCargando(true);
                setError(false);
                const respuesta = await fetch(`${API}?idioma=${idioma}`);
                const datos = await respuesta.json();
                if(!respuesta.ok){
                    throw new Error("No se pudieron cargar los textos.");
                }
                const textosValidos = validarTextos(datos);
                setTextos(textosValidos);
            } catch (error) {
                setTextos(null);
                setError(true);
            }finally {
                setCargando(false);
            }
        }
        cargarTextos();
    }, [idioma]);
    return {
        textos,
        cargando,
        error,
    };
}

export default useTextos;