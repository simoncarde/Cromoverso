import Icono from "../Iconos.jsx";
import "./Mundos.css";

const ICONOS_MUNDOS = {
    rayo: "rayo",
    ola: "mundo",
    hoja: "rombo",
    llama: "rayo",
    orbita: "estrella",
    runa: "info"
};

function Mundos({
    mundos = [],
    cargandoMundos,
    errorMundos,
    textos
}) {
    const contenido = textos?.paginas?.inicio?.mundos;
    const nombres = contenido?.nombres ?? {};

    // Esperamos los textos de la API.
    if (!contenido) {
        return null;
    }

    return (
        <section className="mundos-seccion" id="mundos">
            <div className="mundos-interior">

                <header className="mundos-cabecera">
                    <div className="mundos-titulos">
                        <h2>{contenido.titulo}</h2>
                        <p>{contenido.descripcion}</p>
                    </div>

                    {!cargandoMundos &&
                        !errorMundos &&
                        mundos.some((mundo) => mundo.id === "neon") && (
                            <a
                                href="/mundos/neon"
                                className="mundos-enlace"
                            >
                                <Icono nombre="flechaDer" />
                                <span>{contenido.verCiudad}</span>
                            </a>
                        )}
                </header>

                <div className="mundos-lista">

                    {cargandoMundos && (
                        <p className="estado-mundos">
                            {contenido.cargando}
                        </p>
                    )}

                    {errorMundos && (
                        <p className="estado-mundos">
                            {contenido.error}
                        </p>
                    )}

                    {!cargandoMundos &&
                        !errorMundos &&
                        mundos.map((mundo, indice) => {

                            const nombreMundo =
                                nombres[mundo.id] ?? mundo.nombre;

                            return (
                                <a
                                    key={mundo.id}
                                    href={`/mundos/${mundo.id}`}
                                    className="mundo-tarjeta"
                                    style={{
                                        "--color-mundo": mundo.color
                                    }}
                                    aria-label={nombreMundo}
                                >
                                    <div className="mundo-tarjeta-superior">

                                        <span className="mundo-icono">
                                            <Icono
                                                nombre={
                                                    ICONOS_MUNDOS[mundo.figura] ?? "mundo"
                                                }
                                            />
                                        </span>

                                        {indice === 0 && (
                                            <span className="mundo-etiqueta">
                                                {contenido.etiquetaMundo} 1
                                            </span>
                                        )}

                                    </div>

                                    <h3>{nombreMundo}</h3>

                                    <p>
                                        {mundo.totalCromos} {contenido.cromos}
                                    </p>
                                </a>
                            );
                        })
                    }

                    {!cargandoMundos &&
                        !errorMundos &&
                        mundos.length === 0 && (
                            <p className="estado-mundos">
                                {contenido.vacio}
                            </p>
                        )}

                </div>
            </div>
        </section>
    );
}

export default Mundos;
