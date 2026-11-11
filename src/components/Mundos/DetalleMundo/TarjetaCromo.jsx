import { useEffect, useState } from "react";
import { IconoUI } from "../../Iconos.jsx";
import { formatearTexto } from "../../../utils/textos.js";

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

function TarjetaCromo({ cromo, mundo, textos, idioma = "es" }) {
    const numero = String(cromo.numero).padStart(3, "0");
    const archivo = `CV-${numero}.svg`;
    const original = `/assets/cromos/${archivo}?v=2`;
    const respaldo = `/assets/cromos/${PLANTILLAS_POR_MUNDO[mundo.id] || "CV-001.svg"}?v=2`;
    const [src, setSrc] = useState(original);

    const es = idioma === "es";
    const cromoTextos = textos?.componentes?.cromo;
    const albumMundo = textos?.paginas?.albumMundo;

    const nombresTipo = cromoTextos?.tipos || albumMundo?.filtros?.tipo?.opciones || {
        heroe: es ? "Héroe" : "Hero",
        aliado: es ? "Aliado" : "Ally",
        villano: es ? "Villano" : "Villain"
    };

    const nombresRareza = cromoTextos?.rarezas || {
        comun: es ? "Común" : "Common",
        rara: es ? "Rara" : "Rare",
        epica: es ? "Épica" : "Epic",
        legendaria: es ? "Legendaria" : "Legendary"
    };

    const tipoEtiqueta = nombresTipo[cromo.tipo] || cromo.tipo;
    const rarezaEtiqueta = nombresRareza[cromo.rareza] || cromo.rareza || (es ? "Común" : "Common");

    const plantillaTarjeta = albumMundo?.tarjeta?.tipo || "{mundo} · {tipo}";
    const subtitulo = formatearTexto(plantillaTarjeta, {
        mundo: mundo.nombre,
        tipo: tipoEtiqueta
    });

    const ariaRareza = albumMundo?.filtros?.rareza?.valor
        ? formatearTexto(albumMundo.filtros.rareza.valor, { rareza: rarezaEtiqueta })
        : `${es ? "Rareza" : "Rarity"}: ${rarezaEtiqueta}`;

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
            title={`${cromo.nombre} · ${tipoEtiqueta}`}
        >
            <div className={`tarjeta-cromo-ilustracion${cromo.holografico ? " holografico" : ""}`}>
                {src ? (
                    <img
                        className="tarjeta-cromo-svg"
                        src={src}
                        alt={`${cromo.nombre} (${numero}) - ${subtitulo}`}
                        loading="lazy"
                        onError={usarRespaldo}
                    />
                ) : (
                    <div className="tarjeta-cromo-sin-imagen" aria-hidden="true" />
                )}
                <span className="tarjeta-cromo-numero">{numero}</span>
                <span
                    className={`tarjeta-cromo-sello rareza-${cromo.rareza || "comun"}`}
                    title={rarezaEtiqueta}
                    aria-label={ariaRareza}
                >
                    <IconoUI nombre={iconoRareza} size={13} />
                </span>
            </div>
            <div className="tarjeta-cromo-info">
                <h3>{cromo.nombre}</h3>
                <p>{subtitulo}</p>
            </div>
        </article>
    );
}

export default TarjetaCromo;
