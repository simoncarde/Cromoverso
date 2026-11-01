
import { useEffect, useRef } from "react";
import "./PanelAccesibilidad.css";

function PanelAccesibilidad({
    textos,
    preferencias,
    cambiarPreferencia,
    restablecerPreferencias,
    cerrarPanel,
    posicion,
}) {
    const accesibilidad = textos?.accesibilidad;
    const botonCerrarRef = useRef(null);
    const cerrarPanelRef = useRef(cerrarPanel);

    cerrarPanelRef.current = cerrarPanel;

    useEffect(() => {
        botonCerrarRef.current?.focus();

        function manejarTeclado(evento) {
            if (evento.key === "Escape") {
                cerrarPanelRef.current();
            }
        }

        window.addEventListener("keydown", manejarTeclado);

        return () => {
            window.removeEventListener("keydown", manejarTeclado);
        };
    }, []);

    if (!accesibilidad) {
        return null;
    }

    function alternar(nombre) {
        cambiarPreferencia(nombre, !preferencias[nombre]);
    }

    function Interruptor({ nombre, titulo }) {
        const activado = Boolean(preferencias[nombre]);

        return (
            <button
                type="button"
                className="accesibilidad-switch"
                role="switch"
                aria-checked={activado}
                aria-label={`${titulo}: ${
                    activado
                        ? accesibilidad.etiquetas.encendido
                        : accesibilidad.etiquetas.apagado
                }`}
                onClick={() => alternar(nombre)}
            >
                <span className="accesibilidad-switch-circulo" />
            </button>
        );
    }

    const opciones = [
        {
            nombre: "altoContraste",
            contenido: accesibilidad.altoContraste,
        },
        {
            nombre: "reducirMovimiento",
            contenido: accesibilidad.reducirMovimiento,
        },
        {
            nombre: "subrayarEnlaces",
            contenido: accesibilidad.subrayarEnlaces,
        },
        {
            nombre: "fuenteLecturaFacil",
            contenido: accesibilidad.fuenteLecturaFacil,
        },
    ];

    return (
        <div className="accesibilidad-fondo">
            <section
                className="accesibilidad-panel"
                style={{
                    top: `${posicion.top}px`,
                    left: `${posicion.left}px`,
                }}
                role="dialog"
                aria-modal="false"
                aria-labelledby="accesibilidad-titulo"
            >
                <header className="accesibilidad-encabezado">
                    <h2 id="accesibilidad-titulo">
                        {accesibilidad.titulo}
                    </h2>

                    <button
                        ref={botonCerrarRef}
                        type="button"
                        className="accesibilidad-cerrar"
                        onClick={cerrarPanel}
                        aria-label={accesibilidad.titulo}
                    >
                        ×
                    </button>
                </header>

                <div className="accesibilidad-contenido">
                    <section className="accesibilidad-seccion-tamano">
                        <h3>{accesibilidad.tamanoTexto.titulo}</h3>

                        <div
                            className="accesibilidad-tamanos"
                            role="group"
                            aria-label={accesibilidad.tamanoTexto.titulo}
                        >
                            {Object.entries(
                                accesibilidad.tamanoTexto.opciones
                            ).map(([valor, etiqueta]) => (
                                <button
                                    key={valor}
                                    type="button"
                                    className={
                                        preferencias.tamanoTexto === valor
                                            ? "seleccionado"
                                            : ""
                                    }
                                    onClick={() =>
                                        cambiarPreferencia(
                                            "tamanoTexto",
                                            valor
                                        )
                                    }
                                    aria-pressed={
                                        preferencias.tamanoTexto === valor
                                    }
                                >
                                    {etiqueta}
                                </button>
                            ))}
                        </div>
                    </section>

                    {opciones.map(({ nombre, contenido }) => (
                        <section
                            className="accesibilidad-seccion-switch"
                            key={nombre}
                        >
                            <div className="accesibilidad-detalle">
                                <h3>{contenido.titulo}</h3>
                                <p>{contenido.ayuda}</p>
                            </div>

                            <Interruptor
                                nombre={nombre}
                                titulo={contenido.titulo}
                            />
                        </section>
                    ))}
                </div>

                <footer className="accesibilidad-pie">
                    <a
                        className="accesibilidad-declaracion"
                        href="#declaracion-accesibilidad"
                        onClick={cerrarPanel}
                    >
                        {accesibilidad.enlaces.declaracion}
                    </a>

                    <button
                        type="button"
                        className="accesibilidad-restablecer"
                        onClick={restablecerPreferencias}
                    >
                        {accesibilidad.botones.restablecer}
                    </button>
                </footer>
            </section>
        </div>
    );
}

export default PanelAccesibilidad;
