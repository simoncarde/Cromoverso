import { useEffect, useState } from "react";

const API = "https://yanethm-cromoverso-api.fly.dev/api/v1/textos";

const MENU_MOVIL = ["inicio", "mundos"];
const HERO = ["titulo", "subtitulo", "subtituloMovil"];

function validarTextos(datos) {
    const textos = datos?.textos;
    const nav = textos?.navbar;
    const hero = textos?.paginas?.inicio?.hero;
    const menu = textos?.menuMovil;
    const etiquetas = [
        nav?.logo?.texto,
        nav?.logo?.aria,
        nav?.enlaces?.inicio,
        nav?.enlaces?.mundos,
        nav?.botones?.ingresar,
        nav?.botones?.crearCuenta,
        ...MENU_MOVIL.map((item) => menu?.enlaces?.[item]),
        ...HERO.map((item) => hero?.[item]),
        hero?.etiquetas?.guardiana,
        hero?.botones?.crearCuentaGratis,
        hero?.botones?.explorarMundos,
    ];
    if (!etiquetas.every((item) => typeof item === "string" && item.trim())) {
        throw new Error(
            "La respuesta no contiene los textos necesarios del Navbar y el Hero."
        );
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
                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar los textos.");
                }
                const datos = await respuesta.json();
                const textosValidos = validarTextos(datos);
                setTextos(textosValidos);
            } catch (error) {
                console.error(error);
                setTextos(null);
                setError(true);
            } finally {
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
