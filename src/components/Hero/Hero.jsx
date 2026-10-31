import Icono from "../Iconos.jsx";
import "./Hero.css";

function Hero({
    textos,
    cargando,
    error,
    cromos = [],
    cargandoCromos,
    errorCromos
}) {
    const hero = textos?.paginas?.inicio?.hero;
    // Estado de carga del contenido del Hero.
    if (cargando) {
        return (
            <section className="hero-cromoverso">
                <p className="estado-cromos">Cargando...</p>
            </section>
        );
    }
    // Error al cargar los textos.
    if (error || !hero) {
        return (
            <section className="hero-cromoverso">
                <p className="estado-cromos">
                    No se pudo cargar el contenido.
                </p>
            </section>
        );
    }
    const listaCromos = Array.isArray(cromos) ? cromos : [];

    // SELECCIÓN DE LOS TRES CROMOS DESTACADOS.
    const cromoIzquierdo = listaCromos.find(
        (cromo) => cromo.id === "CV-041"
    );
    const cromoCentral = listaCromos.find(
        (cromo) => cromo.id === "CV-001"
    );
    const cromoDerecho = listaCromos.find(
        (cromo) => cromo.id === "CV-002"
    );
    const cromosDestacados = [
        {
            cromo: cromoIzquierdo,
            posicion: "izquierda"
        },
        {
            cromo: cromoCentral,
            posicion: "central"
        },
        {
            cromo: cromoDerecho,
            posicion: "derecha"
        }
    ];
    const mostrarEtiqueta = cromosDestacados.some(
        (item) => item.cromo?.holografico === true
    );
    return (
        <section className="hero-cromoverso" id="inicio">
            <div className="interior-cromoverso">
                {/* COLUMNA DE TEXTO */}
                <div className="texto-cromoverso">
                    <h1>{hero.titulo}</h1>
                    <p className="descripcion-cromoverso-movil">
                        {hero.subtituloMovil}
                    </p>
                    <div className="grupo-botones">
                        <button
                            type="button"
                            className="boton-home primario"
                        >
                            <Icono nombre="regalo" />
                            <span>
                                {hero.botones.crearCuentaGratis}
                            </span>
                        </button>
                        <a
                            href="#mundos"
                            className="boton-home secundario"
                        >
                            <Icono nombre="cartas" />
                            <span>
                                {hero.botones.explorarMundos}
                            </span>
                        </a>
                    </div>
                    <p className="hero-nota">
                        <Icono nombre="estrella" />
                        {hero.subtitulo}
                    </p>
                </div>
                {/* ILUSTRACIÓN DE CROMOS */}
                <div className="hero-ilustracion">
                    {!cargandoCromos &&
                        !errorCromos &&
                        mostrarEtiqueta && (
                            <span className="hero-etiqueta">
                                <Icono nombre="corona" />
                                {hero.etiquetas.guardiana}
                            </span>
                        )}
                    <div className="hero-figuras">
                        {/* CARGA DE CROMOS */}
                        {cargandoCromos && (
                            <p className="estado-cromos">
                                Cargando cromos...
                            </p>
                        )}
                        {/* ERROR DE CARGA */}
                        {errorCromos && (
                            <p className="estado-cromos">
                                No se pudieron cargar los cromos.
                            </p>
                        )}
                        {/* TARJETAS */}
                        {!cargandoCromos &&
                            !errorCromos &&
                            cromosDestacados.map(
                                ({ cromo, posicion }) => {
                                    if (!cromo) return null;
                                    return (
                                        <article
                                            key={cromo.id}
                                            className={`hero-figura hero-figura-${posicion}`}
                                        >
                                            <span className="numero-carta">
                                                {String(cromo.numero).padStart(3, "0")}
                                            </span>
                                            <div
                                                className={`personaje-carta ${
                                                    cromo.holografico
                                                        ? "carta-holografica"
                                                        : ""
                                                }`}
                                                style={{
                                                    "--color-cromo":
                                                        cromo.ilustracion?.colorBase
                                                }}
                                            >
                                                <div className="figura-cromo">
                                                    <Icono
                                                        nombre={
                                                            cromo.ilustracion?.figura
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <span className="nombre-carta">
                                                {cromo.nombre}
                                            </span>
                                            <span className="detalle-carta">
                                                {cromo.mundoNombre} · Héroe
                                            </span>
                                            <span
                                                className={`rareza-carta rareza-${cromo.rareza}`}
                                            >
                                                {cromo.rareza}
                                            </span>
                                        </article>
                                    );
                                }
                            )
                        }
                        {/* LISTADO VACÍO */}
                        {!cargandoCromos &&
                            !errorCromos &&
                            listaCromos.length === 0 && (
                                <p className="estado-cromos">
                                    No hay cromos disponibles.
                                </p>
                            )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
