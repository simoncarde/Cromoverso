import { Link } from "react-router-dom";
import Icono from "../Iconos.jsx";
import "./Mundos.css";

function Mundos({ mundos = [], cargandoMundos, errorMundos, textos }) {
    const contenido = textos?.paginas?.inicio?.mundos;
    const nombres = contenido?.nombres ?? {};

    if (!contenido) return null;

    return (
        <section className="mundos-seccion" id="mundos">
            <div className="mundos-interior">
                <header className="mundos-cabecera">
                    <div className="mundos-titulos">
                        <h2>{contenido.titulo}</h2>
                        <p>{contenido.descripcion}</p>
                    </div>
                    {!cargandoMundos && !errorMundos && mundos.length > 0 && (
                        <Link to="/mundos/neon" className="mundos-enlace">
                            <Icono nombre="flechaDer" />
                            <span>{contenido.verCiudad}</span>
                        </Link>
                    )}
                </header>

                <div className="mundos-lista">
                    {cargandoMundos && <p className="estado-mundos">{contenido.cargando}</p>}
                    {errorMundos && <p className="estado-mundos">{contenido.error}</p>}

                    {!cargandoMundos && !errorMundos && mundos.map((mundo, indice) => {
                        const nombre = nombres[mundo.id] ?? mundo.nombre;
                        return (
                            <Link
                                key={mundo.id}
                                to={`/mundos/${mundo.id}`}
                                className="mundo-tarjeta"
                                style={{ "--color-mundo": mundo.color }}
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
                                            {contenido.etiquetaMundo} 1
                                        </span>
                                    )}
                                </div>
                                <h3>{nombre}</h3>
                                <p>{mundo.totalCromos} {contenido.cromos}</p>
                            </Link>
                        );
                    })}

                    {!cargandoMundos && !errorMundos && mundos.length === 0 && (
                        <p className="estado-mundos">{contenido.vacio}</p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Mundos;
