import Icono from "../Iconos.jsx";
import useCromos from "../../hooks/useCromos.js";
import "./Hero.css";

function Hero({
    textos,
    idioma = "es",
    cargando,
    error
}) {
    const { cromos, cargandoCromos, errorCromos } = useCromos();
    const hero = textos?.paginas?.inicio?.hero;
    const es = idioma === "es";
    if (cargando) {
        return (
            <section className="hero-cromoverso">
                <p className="estado-cromos" role="status" aria-live="polite">
                    {textos?.estados?.cargando || (es ? "Cargando…" : "Loading…")}
                </p>
            </section>
        );
    }
    if (error || !hero) {
        return (
            <section className="hero-cromoverso">
                <p className="estado-cromos" role="alert">
                    {textos?.estados?.error?.titulo || (es ? "No se pudo cargar el contenido." : "Could not load content.")}
                </p>
            </section>
        );
    }

    const listaCromos = Array.isArray(cromos) ? cromos : [];
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
        cromoIzquierdo,
        cromoCentral,
        cromoDerecho
    ];

    const mostrarEtiqueta = cromosDestacados.some(
        (cromo) => cromo?.holografico === true
    );

    return (
        <section className="hero-cromoverso" id="inicio">
            <div className="interior-cromoverso">

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

                <div className="hero-ilustracion">
                    <div className="hero-figuras">

                        {!cargandoCromos &&
                            !errorCromos &&
                            mostrarEtiqueta && (
                                <span className="hero-etiqueta">
                                    <Icono nombre="corona" />
                                    {hero.etiquetas.guardiana}
                                </span>
                            )}

                        {cargandoCromos && (
                            <p className="estado-cromos" role="status" aria-live="polite">
                                {textos?.estados?.cargando || (es ? "Cargando cromos…" : "Loading cards…")}
                            </p>
                        )}

                        {errorCromos && (
                            <p className="estado-cromos" role="alert">
                                {textos?.estados?.error?.texto || (es ? "No se pudieron cargar los cromos." : "Could not load cards.")}
                            </p>
                        )}

                        {!cargandoCromos &&
                            !errorCromos &&
                            listaCromos.length > 0 && (
                                <img
                                    className="hero-tres-cromos"
                                    src="/assets/iconos/tresCromos.svg"
                                    alt={textos?.general?.aria?.cromosDestacados || (es ? "Tres cromos destacados de Cromoverso" : "Three featured cards from Cromoverso")}
                                />
                            )}

                        {!cargandoCromos &&
                            !errorCromos &&
                            listaCromos.length === 0 && (
                                <p className="estado-cromos">
                                    {textos?.estados?.vacio?.titulo || (es ? "No hay cromos disponibles." : "No cards available.")}
                                </p>
                            )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
