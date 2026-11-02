import { IconoUI } from "../../Iconos.jsx";

const ICONOS = {
    legendaria: "corona",
    epica: "estrella",
    rara: "rombo",
    comun: "circulo"
};

function FiltroRareza({ valores, nombres, conteos, seleccionado, onChange }) {
    return (
        <section className="filtro-panel">
            <h2 className="filtro-panel-titulo"><IconoUI nombre="filtro" size={16} /> Filtrar por rareza</h2>
            <div className="filtro-opciones">
                {valores.map((valor) => (
                    <button
                        type="button"
                        key={valor}
                        className={`filtro-chip rareza-${valor}${seleccionado === valor ? " seleccionado" : ""}`}
                        aria-pressed={seleccionado === valor}
                        onClick={() => onChange(seleccionado === valor ? "" : valor)}
                    >
                        <span className="filtro-chip-nombre"><IconoUI nombre={ICONOS[valor]} size={13} /> {nombres[valor]}</span>
                        <small>{conteos[valor] ?? 0} cromos</small>
                    </button>
                ))}
            </div>
        </section>
    );
}

export default FiltroRareza;
