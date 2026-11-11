import { Link } from "react-router-dom";
import Icono from "../Iconos.jsx";
import { formatearTexto } from "../../utils/textos.js";
import "./Mundos.css";

function Mundos({
    mundos = [],
    cargandoMundos,
    errorMundos,
    textos,
    idioma = "es"
}) {
    const contenido = textos?.paginas?.inicio?.mundos;
    const nombres = contenido?.nombres ?? {};
    const es = idioma === "es";

    if (!contenido) return null;
    const coloresMundos = [
        "var(--mundo-neon-suave)",
        "var(--mundo-coral-suave)",
        "var(--mundo-bosque-suave)",
        "var(--mundo-forja-suave)",
        "var(--mundo-orbita-suave)",
        "var(--mundo-niebla-suave)"
    ];

    const primerMundoNombre = mundos[0]?.nombre || (es ? "Ciudad Neón" : "Neon City");
    const enlaceVerTexto = contenido?.enlaces?.ver
        ? formatearTexto(contenido.enlaces.ver, { mundo: primerMundoNombre })
        : (es ? `Ver ${primerMundoNombre}` : `See ${primerMundoNombre}`);

    return (
        <section className="mundos-seccion" id="mundos">
            <div className="mundos-interior">

                <header className="mundos-cabecera">
                    <div className="mundos-titulos">
                        <h2>{contenido.titulo}</h2>
                        <p>{contenido.subtitulo || contenido.descripcion}</p>
                    </div>

                    {!cargandoMundos &&
                        !errorMundos &&
                        mundos.length > 0 && (
                            <Link
                                to="/mundos/neon"
                                className="mundos-enlace"
                            >
                                <Icono nombre="flechaDer" />
                                <span>{enlaceVerTexto}</span>
                            </Link>
                        )}
                </header>

                <div className="mundos-lista">
                    {cargandoMundos && (
                        <p className="estado-mundos" role="status" aria-live="polite">
                            {textos?.estados?.cargando || (es ? "Cargando…" : "Loading…")}
                        </p>
                    )}

                    {errorMundos && (
                        <p className="estado-mundos" role="alert">
                            {textos?.estados?.error?.titulo || (es ? "No se pudieron obtener los mundos." : "Could not load worlds.")}
                        </p>
                    )}

                    {!cargandoMundos &&
                        !errorMundos &&
                        mundos.map((mundo, indice) => {
                            const nombre =
                                nombres[mundo.id] ?? mundo.nombre;

                            const etiquetaMundo = contenido?.etiquetas?.mundo
                                ? formatearTexto(contenido.etiquetas.mundo, { numero: indice + 1 })
                                : (es ? `Mundo ${indice + 1}` : `World ${indice + 1}`);

                            const etiquetaCromos = contenido?.etiquetas?.cromos
                                ? formatearTexto(contenido.etiquetas.cromos, { cantidad: mundo.totalCromos })
                                : `${mundo.totalCromos} ${es ? "cromos" : "cards"}`;

                            return (
                                <Link
                                    key={mundo.id}
                                    to={`/mundos/${mundo.id}`}
                                    className="mundo-tarjeta"
                                    style={{
                                        "--color-mundo": mundo.color,
                                        "--fondo-mundo":
                                            coloresMundos[indice] ??
                                            "var(--fondo-superficie)"
                                    }}
                                    aria-label={nombre}
                                >
                                    <div className="mundo-tarjeta-superior">
                                        <img
                                            className="mundo-icono-imagen"
                                            src={`/assets/mundos/${mundo.id}.svg`}
                                            alt=""
                                            aria-hidden="true"
                                        />

                                        {indice === 0 && (
                                            <span className="mundo-etiqueta">
                                                {etiquetaMundo}
                                            </span>
                                        )}
                                    </div>

                                    <h3>{nombre}</h3>

                                    <p>{etiquetaCromos}</p>
                                </Link>
                            );
                        })}

                    {!cargandoMundos &&
                        !errorMundos &&
                        mundos.length === 0 && (
                            <p className="estado-mundos">
                                {textos?.estados?.vacio?.titulo || (es ? "No hay mundos disponibles." : "No worlds available.")}
                            </p>
                        )}
                </div>
            </div>
        </section>
    );
}

export default Mundos;
