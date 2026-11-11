import { useLayoutEffect, useState } from "react";

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
    useLayoutEffect(() => {
        const raiz = document.documentElement;
        raiz.dataset.tamanoTexto = preferencias.tamanoTexto;
        raiz.style.setProperty(
            "--escala-texto",
            preferencias.tamanoTexto === "muyGrande"
                ? "1.3"
                : preferencias.tamanoTexto === "grande"
                    ? "1.15"
                    : "1"
        );
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
        try {
            localStorage.setItem(CLAVE, JSON.stringify(preferencias));
        } catch {}
    }, [preferencias]);

    function cambiarPreferencia(nombre, valor) {
        if (nombre === "reducirMovimiento") {
            document.documentElement.dataset.reducirMovimiento = String(valor);
        }
        setPreferencias((actuales) => ({
            ...actuales,
            [nombre]: valor,
        }));
    }

    function restablecerPreferencias() {
        document.documentElement.dataset.reducirMovimiento = "false";
        setPreferencias(PREFERENCIAS_INICIALES);
    }

    return {
        preferencias,
        cambiarPreferencia,
        restablecerPreferencias,
    };
}

export default useAccesibilidad;
