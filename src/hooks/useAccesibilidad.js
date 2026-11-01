import { useEffect, useState } from "react";

const CLAVE = "cromoverso-accesibilidad";
const PREFERENCIAS_INICIALES = {
    tamanoTexto: "normal",
    altoContraste: false,
    reducirMovimiento: false,
    subrayarEnlaces: false,
    fuenteLecturaFacil: false,
};

function obtenerPreferencias() {
    try {
        const guardadas = localStorage.getItem(CLAVE);
        if (!guardadas) {
            return PREFERENCIAS_INICIALES;
        }
        const datos = JSON.parse(guardadas);
        return {
            ...PREFERENCIAS_INICIALES,
            ...datos,
        };
    } catch {
        return PREFERENCIAS_INICIALES;
    }
}

function useAccesibilidad() {
    const [preferencias, setPreferencias] = useState(obtenerPreferencias);
    useEffect(() => {
        const raiz = document.documentElement;
        raiz.dataset.tamanoTexto = preferencias.tamanoTexto;
        raiz.dataset.altoContraste = String(preferencias.altoContraste);
        raiz.dataset.reducirMovimiento = String(
            preferencias.reducirMovimiento
        );
        raiz.dataset.subrayarEnlaces = String(
            preferencias.subrayarEnlaces
        );
        raiz.dataset.fuenteLecturaFacil = String(
            preferencias.fuenteLecturaFacil
        );
        localStorage.setItem(CLAVE, JSON.stringify(preferencias));
    }, [preferencias]);

    function cambiarPreferencia(nombre, valor) {
        setPreferencias((actuales) => ({
            ...actuales,
            [nombre]: valor,
        }));
    }

    function restablecerPreferencias() {
        setPreferencias(PREFERENCIAS_INICIALES);
    }

    return {
        preferencias,
        cambiarPreferencia,
        restablecerPreferencias,
    };
}

export default useAccesibilidad;