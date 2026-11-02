import { NavLink } from "react-router-dom";

function SelectorMundos({ mundos, actual }) {
    return (
        <section className="filtro-panel selector-mundos">
            <h2>Mundos</h2>
            <nav aria-label="Seleccionar mundo">
                {mundos.map((mundo) => (
                    <NavLink
                        key={mundo.id}
                        to={`/mundos/${mundo.id}`}
                        className={({ isActive }) => `selector-mundos-enlace${isActive ? " activo" : ""}`}
                        style={{ "--color-mundo": mundo.color }}
                    >
                        <img
                            className="selector-mundos-icono"
                            src={`/assets/mundos/${mundo.id}.svg`}
                            alt=""
                            loading="lazy"
                        />
                        <span className="selector-mundos-nombre">{mundo.nombre}</span>
                        <span className="selector-mundos-total">{mundo.totalCromos} cromos</span>
                        {mundo.id === actual && <small>Página actual</small>}
                    </NavLink>
                ))}
            </nav>
        </section>
    );
}

export default SelectorMundos;
