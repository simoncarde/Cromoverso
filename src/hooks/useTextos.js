import { useEffect, useState } from "react";

const API = "https://yanethm-cromoverso-api.fly.dev/api/v1/textos";
const ENLACES = ["album", "sobres", "intercambios", "mundos", "ranking"];
const MENU_MOVIL = ["inicio", "album", "sobres", "intercambios", "mundos", "ranking", "miColeccion", "perfilYLogros", "notificaciones"];

function validarTextos(datos) {
    const textos = datos?.textos;
    const nav = textos?.navbar;
    const etiquetas = [
        nav?.logo?.texto,
        nav?.logo?.aria,
        ...ENLACES.map((item) => nav?.enlaces?.[item]),
        nav?.buscador?.placeholder,
        nav?.buscador?.aria,
        nav?.botones?.ingresar,
        nav?.botones?.crearCuenta,
        nav?.usuario?.menu,
        nav?.usuario?.perfil,
        nav?.usuario?.cerrarSesion,
        nav?.aria?.idioma,
        nav?.aria?.accesibilidad,
        nav?.aria?.notificaciones,
        nav?.botones?.sobresDisponibles?.uno,
        nav?.botones?.sobresDisponibles?.otro,
        nav?.aria?.notificacionesSinLeer?.uno,
        nav?.aria?.notificacionesSinLeer?.otro,
        textos?.menuMovil?.abrir,
        textos?.menuMovil?.cerrar,
        ...MENU_MOVIL.map((item) => textos?.menuMovil?.enlaces?.[item]),
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