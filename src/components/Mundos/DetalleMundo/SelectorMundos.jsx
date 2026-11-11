import { NavLink } from "react-router-dom";
import { formatearTexto } from "../../../utils/textos.js";

function SelectorMundos({ mundos, actual, textos, idioma = "es" }) {
    const albumMundo = textos?.paginas?.albumMundo;
    const es = idioma === "es";

    const tituloMundos = albumMundo?.mundos?.titulo || (es ? "Mundos" : "Worlds");
    const ariaNav = es ? "Seleccionar mundo" : "Select world";
    const textoPaginaActual = albumMundo?.mundos?.aria?.paginaActual || (es ? "Página actual" : "Current page");

    return (
        <section className="filtro-panel selector-mundos">
            <h2>{tituloMundos}</h2>
            <nav aria-label={ariaNav}>
                {mundos.map((mundo) => {
                    const totalCromosTexto = albumMundo?.mundos?.cromos
                        ? formatearTexto(albumMundo.mundos.cromos, { cantidad: mundo.totalCromos })
                        : `${mundo.totalCromos} ${es ? "cromos" : "cards"}`;

                    return (
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
                            <span className="selector-mundos-total">{totalCromosTexto}</span>
                            {mundo.id === actual && <small>{textoPaginaActual}</small>}
                        </NavLink>
                    );
                })}
            </nav>
        </section>
    );
}

export default SelectorMundos;
