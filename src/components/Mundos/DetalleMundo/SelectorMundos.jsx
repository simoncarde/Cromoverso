
import { NavLink } from "react-router-dom";

function SelectorMundos({
    mundos = [],
    actual,
    compacto = false
}) {
    const claseSelector = compacto
        ? "filtro-panel selector-mundos selector-mundos-movil"
        : "filtro-panel selector-mundos";

    return (
        <section className={claseSelector}>

            <h2>
                {compacto
                    ? "Explora los mundos"
                    : "Mundos"}
            </h2>

            <nav aria-label="Seleccionar mundo">

                {mundos.map((mundo) => (
                    <NavLink
                        key={mundo.id}
                        to={`/mundos/${mundo.id}`}
                        className={({ isActive }) =>
                            `selector-mundos-enlace${
                                isActive ? " activo" : ""
                            }`
                        }
                        style={{
                            "--color-mundo": mundo.color
                        }}
                        aria-label={`${mundo.nombre}, ${mundo.totalCromos} cromos`}
                    >
                        <img
                            className="selector-mundos-icono"
                            src={`/assets/mundos/${mundo.id}.svg`}
                            alt=""
                            loading="lazy"
                        />

                        <span className="selector-mundos-nombre">
                            {mundo.nombre}
                        </span>

                        <span className="selector-mundos-total">
                            {mundo.totalCromos} cromos
                        </span>

                        {mundo.id === actual && (
                            <small>
                                {compacto
                                    ? "Estás aquí"
                                    : "Página actual"}
                            </small>
                        )}
                    </NavLink>
                ))}

            </nav>
        </section>
    );
}

export default SelectorMundos;
