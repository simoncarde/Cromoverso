import { IconoUI } from "../../Iconos.jsx";
import { formatearTexto } from "../../../utils/textos.js";

const ICONOS = {
    legendaria: "corona",
    epica: "estrella",
    rara: "rombo",
    comun: "circulo"
};

function FiltroRareza({ valores, nombres, conteos, seleccionado, onChange, textos, idioma = "es" }) {
    const albumMundo = textos?.paginas?.albumMundo;
    const es = idioma === "es";

    const titulo = albumMundo?.filtros?.rareza?.titulo || (es ? "Filtrar por rareza" : "Filter by rarity");

    return (
        <section className="filtro-panel">
            <h2 className="filtro-panel-titulo"><IconoUI nombre="filtro" size={16} /> {titulo}</h2>
            <div className="filtro-opciones">
                {valores.map((valor) => {
                    const cantidadTexto = albumMundo?.filtros?.cantidad?.otro
                        ? formatearTexto(albumMundo.filtros.cantidad.otro, { cantidad: conteos[valor] ?? 0 })
                        : `${conteos[valor] ?? 0} ${es ? "cromos" : "cards"}`;

                    return (
                        <button
                            type="button"
                            key={valor}
                            className={`filtro-chip rareza-${valor}${seleccionado === valor ? " seleccionado" : ""}`}
                            aria-pressed={seleccionado === valor}
                            onClick={() => onChange(seleccionado === valor ? "" : valor)}
                        >
                            <span className="filtro-chip-nombre"><IconoUI nombre={ICONOS[valor]} size={13} /> {nombres[valor]}</span>
                            <small>{cantidadTexto}</small>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default FiltroRareza;
