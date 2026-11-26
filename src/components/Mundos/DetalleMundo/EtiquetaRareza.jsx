import { IconoUI } from "../../Iconos.jsx";

const ICONOS_RAREZA = {
    comun: "circulo",
    rara: "rombo",
    epica: "estrella",
    legendaria: "corona"
};

function EtiquetaRareza({ rareza, nombre, className = "" }) {
    const icono = ICONOS_RAREZA[rareza] || "circulo";

    return (
        <span className={className}>
            <IconoUI nombre={icono} size={13} />
            {nombre || rareza}
        </span>
    );
}

export default EtiquetaRareza;
