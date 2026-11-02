import { IconoUI } from "../../Iconos.jsx";

const ICONOS = { heroe: "estrella", aliado: "destellos", villano: "rayo" };

function FiltroTipo({ valores, nombres, conteos, seleccionado, onChange }) {
    return (
        <section className="filtro-panel">
            <h2 className="filtro-panel-titulo"><IconoUI nombre="filtro" size={16} /> Filtrar por tipo</h2>
            <div className="filtro-opciones">
                {valores.map((valor) => (
                    <button
                        type="button"
                        key={valor}
                        className={`filtro-chip tipo-${valor}${seleccionado === valor ? " seleccionado" : ""}`}
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

export default FiltroTipo;
