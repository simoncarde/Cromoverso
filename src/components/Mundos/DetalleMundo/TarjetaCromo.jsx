import { useEffect, useState } from "react";
import { IconoUI } from "../../Iconos.jsx";

const NOMBRES_TIPO = { heroe: "Héroe", aliado: "Aliado", villano: "Villano" };
const NOMBRES_RAREZA = {
    comun: "Común",
    rara: "Rara",
    epica: "Épica",
    legendaria: "Legendaria"
};
const ICONOS_RAREZA = {
    comun: "circulo",
    rara: "rombo",
    epica: "estrella",
    legendaria: "corona"
};

// Se usan como respaldo cuando no existe un SVG individual para ese ID.
// CV-081 (azul), CV-041 (verde) y CV-101 (rosado) son los cromos de referencia exportados.
const PLANTILLAS_POR_MUNDO = {
    neon: "CV-001.svg",
    coral: "CV-081.svg",
    bosque: "CV-041.svg",
    forja: "CV-061.svg",
    orbita: "CV-082.svg",
    niebla: "CV-101.svg"
};

function TarjetaCromo({ cromo, mundo }) {
    const numero = String(cromo.numero).padStart(3, "0");
    const archivo = `CV-${numero}.svg`;
    const original = `/assets/cromos/${archivo}?v=2`;
    const respaldo = `/assets/cromos/${PLANTILLAS_POR_MUNDO[mundo.id] || "CV-001.svg"}?v=2`;
    const [src, setSrc] = useState(original);

    useEffect(() => {
        setSrc(original);
    }, [original]);

    function usarRespaldo() {
        if (src !== respaldo) {
            setSrc(respaldo);
        } else {
            setSrc("");
        }
    }

    const iconoRareza = ICONOS_RAREZA[cromo.rareza] || "circulo";

    return (
        <article
            className={`tarjeta-cromo rareza-borde-${cromo.rareza || "comun"}`}
            title={`${cromo.nombre} · ${NOMBRES_TIPO[cromo.tipo] || cromo.tipo}`}
        >
            <div className={`tarjeta-cromo-ilustracion${cromo.holografico ? " holografico" : ""}`}>
                {src ? (
                    <img
                        className="tarjeta-cromo-svg"
                        src={src}
                        alt={`Cromo ${numero}: ${cromo.nombre}`}
                        loading="lazy"
                        onError={usarRespaldo}
                    />
                ) : (
                    <div className="tarjeta-cromo-sin-imagen" aria-hidden="true" />
                )}
                <span className="tarjeta-cromo-numero">{numero}</span>
                <span
                    className={`tarjeta-cromo-sello rareza-${cromo.rareza || "comun"}`}
                    title={NOMBRES_RAREZA[cromo.rareza] || "Común"}
                    aria-label={`Rareza ${NOMBRES_RAREZA[cromo.rareza] || "Común"}`}
                >
                    <IconoUI nombre={iconoRareza} size={13} />
                </span>
            </div>
            <div className="tarjeta-cromo-info">
                <h3>{cromo.nombre}</h3>
                <p>{mundo.nombre} · {NOMBRES_TIPO[cromo.tipo] || cromo.tipo}</p>
            </div>
        </article>
    );
}

export default TarjetaCromo;
