import { useEffect, useState } from "react";

const API = "https://yanethm-cromoverso-api.fly.dev/api/v1/textos";

const MENU_MOVIL = ["inicio", "mundos"];
const HERO = ["titulo", "subtitulo", "subtituloMovil"];

function validarTextos(datos) {
    const textos = datos?.textos;
    if (!textos || typeof textos !== "object") {
        throw new Error("La respuesta no contiene el objeto de textos.");
    }
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
        console.warn("Algunos textos esperados del Navbar o Hero no están presentes en la API.");
    }
    return textos;
}

const cacheTextos = {};
const promesasTextos = {};

function useTextos(idioma = "es") {
    const [textos, setTextos] = useState(() => cacheTextos[idioma] || null);
    const [cargando, setCargando] = useState(() => !cacheTextos[idioma]);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (cacheTextos[idioma]) {
            setTextos(cacheTextos[idioma]);
            setCargando(false);
            return;
        }

        let cancelado = false;

        async function cargarTextos() {
            try {
                setCargando(true);
                setError(false);

                if (!promesasTextos[idioma]) {
                    promesasTextos[idioma] = fetch(`${API}?idioma=${idioma}`)
                        .then((respuesta) => {
                            if (!respuesta.ok) {
                                throw new Error("No se pudieron cargar los textos.");
                            }
                            return respuesta.json();
                        })
                        .then((datos) => {
                            const textosValidos = validarTextos(datos);
                            cacheTextos[idioma] = textosValidos;
                            return textosValidos;
                        })
                        .finally(() => {
                            delete promesasTextos[idioma];
                        });
                }

                const textosValidos = await promesasTextos[idioma];
                if (!cancelado) {
                    setTextos(textosValidos);
                }
            } catch (error) {
                if (!cancelado) {
                    console.error(error);
                    setTextos(null);
                    setError(true);
                }
            } finally {
                if (!cancelado) {
                    setCargando(false);
                }
            }
        }

        cargarTextos();

        return () => {
            cancelado = true;
        };
    }, [idioma]);

    return {
        textos,
        cargando,
        error,
    };
}

export default useTextos;
