import { useEffect, useRef } from "react";
import { IconoUI } from "../../Iconos.jsx";
import TarjetaCromo from "./TarjetaCromo.jsx";

const ICONOS_RAREZA = {
    comun: "circulo",
    rara: "rombo",
    epica: "estrella",
    legendaria: "corona"
};

const ORDEN_ATRIBUTOS = ["fuerza", "velocidad", "mente", "energia"];

function ModalDetalleCromo({
    cromo,
    mundoNombre,
    mundoColor,
    posicion,
    cromoAnterior,
    cromoSiguiente,
    onCambiarCromo,
    textos,
    onCerrar,
    idioma = "es"
}) {
    const es = idioma === "es";
    const cerrarRef = useRef(null);
    const cromoTextos = textos?.componentes?.cromo || {};
    const detalleTextos = cromoTextos.detalle || {};
    const numero = String(cromo.numero).padStart(3, "0");

    const nombresRareza = {
        comun: es ? "Común" : "Common",
        rara: es ? "Rara" : "Rare",
        epica: es ? "Épica" : "Epic",
        legendaria: es ? "Legendaria" : "Legendary"
    };
    const nombresTipo = {
        heroe: es ? "Héroe" : "Hero",
        aliado: es ? "Aliado" : "Ally",
        villano: es ? "Villano" : "Villain"
    };

    const clavesPresentes = Object.keys(cromo.atributos || {});
    const clavesOrdenadas = [
        ...ORDEN_ATRIBUTOS.filter((k) => clavesPresentes.includes(k)),
        ...clavesPresentes.filter((k) => !ORDEN_ATRIBUTOS.includes(k))
    ];
    const atributos = (clavesOrdenadas.length > 0 ? clavesOrdenadas : ORDEN_ATRIBUTOS).map((clave) => ({
        clave,
        nombre: cromoTextos.atributos?.[clave] || (
            clave === "energia" ? (es ? "Energía" : "Energy") :
            clave === "fuerza" ? (es ? "Fuerza" : "Strength") :
            clave === "velocidad" ? (es ? "Velocidad" : "Speed") :
            clave === "mente" ? (es ? "Mente" : "Mind") : clave
        ),
        valor: Number(cromo.atributos?.[clave]) || 0
    }));

    const total = cromo.totalAtributos || atributos.reduce(
        (acumulado, atributo) => acumulado + atributo.valor,
        0
    );

    const iconoRareza = ICONOS_RAREZA[cromo.rareza] || "circulo";
    const nombreMundo = mundoNombre || cromo.mundoNombre || cromo.mundo;
    const posicionActual = posicion ?? cromo.posicion ?? cromo.numero;
    const colorFinal = cromo.ilustracion?.colorBase || mundoColor || (cromo.mundo ? `var(--mundo-${cromo.mundo})` : "var(--marca-primario)");

    useEffect(() => {
        cerrarRef.current?.focus();
        function manejarTecla(evento) {
            if (evento.key === "Escape") {
                onCerrar();
            } else if (evento.key === "ArrowLeft" && cromoAnterior) {
                onCambiarCromo?.(cromoAnterior);
            } else if (evento.key === "ArrowRight" && cromoSiguiente) {
                onCambiarCromo?.(cromoSiguiente);
            }
        }
        document.addEventListener("keydown", manejarTecla);
        return () => document.removeEventListener("keydown", manejarTecla);
    }, [onCerrar, cromoAnterior, cromoSiguiente, onCambiarCromo]);

    return (
        <div
            className="modal-cromo-overlay"
            style={{ "--color-mundo": colorFinal }}
            onMouseDown={(evento) => {
                if (evento.target === evento.currentTarget) {
                    onCerrar();
                }
            }}
        >
            <section
                className="modal-cromo"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-cromo-titulo"
            >
                <div className="modal-cromo-manija" aria-hidden="true" />
                <button
                    ref={cerrarRef}
                    type="button"
                    className="modal-cromo-cerrar"
                    onClick={onCerrar}
                    aria-label={detalleTextos.cerrar || (es ? "Cerrar detalles" : "Close details")}
                >
                    &times;
                </button>

                <div className="modal-cromo-arte">
                    <TarjetaCromo
                        cromo={cromo}
                        mundo={{ id: cromo.mundo, nombre: nombreMundo }}
                        textos={textos}
                        idioma={idioma}
                    />
                </div>

                <div className="modal-cromo-informacion">
                    <div className="modal-cromo-encabezado">
                        <div className="modal-cromo-etiquetas">
                            <span className={`modal-cromo-etiqueta modal-cromo-rareza rareza-${cromo.rareza}`}>
                                <IconoUI nombre={iconoRareza} size={13} />
                                {nombresRareza[cromo.rareza] || cromo.rareza}
                            </span>
                            <span className="modal-cromo-etiqueta modal-cromo-mundo">
                                {nombreMundo}
                            </span>
                            <span className="modal-cromo-etiqueta modal-cromo-tipo">
                                {nombresTipo[cromo.tipo] || cromo.tipo}
                            </span>
                        </div>

                        <p className="modal-cromo-identificacion-desktop">
                            {cromo.id || `CV-${numero}`} &middot; {nombreMundo}, {es ? "posición" : "position"} {posicionActual}
                        </p>

                        <p className="modal-cromo-identificacion-movil">
                            {cromo.id || `CV-${numero}`}
                        </p>

                        <h2 id="modal-cromo-titulo" className="modal-cromo-titulo">
                            {cromo.nombre}
                        </h2>

                        <p className="modal-cromo-subtitulo-movil">
                            {nombreMundo} &bull; {nombresTipo[cromo.tipo] || cromo.tipo}
                        </p>
                    </div>

                    <div className="modal-cromo-poder">
                        <span className="modal-cromo-poder-icono">
                            <IconoUI nombre="rayo" size={18} />
                        </span>
                        <div className="modal-cromo-poder-cuerpo">
                            <div className="modal-cromo-poder-encabezado">
                                <span className="modal-cromo-poder-icono-movil">
                                    <IconoUI nombre="rayo" size={16} />
                                </span>
                                <span className="modal-cromo-poder-etiqueta">
                                    {detalleTextos.poder || (es ? "PODER" : "POWER")}
                                </span>
                            </div>
                            <p className="modal-cromo-poder-texto">
                                {cromo.poder || cromo.descripcion}
                            </p>
                        </div>
                    </div>

                    {cromo.descripcion && cromo.descripcion !== cromo.poder && (
                        <p className="modal-cromo-lore">
                            {cromo.descripcion}
                        </p>
                    )}

                    <section className="modal-cromo-atributos">
                        <div className="modal-cromo-atributos-cabecera">
                            <h3>
                                {detalleTextos.atributos || (es ? "Atributos" : "Attributes")}
                            </h3>
                            <strong className="modal-cromo-total">
                                {(detalleTextos.total || "Total")} {total}
                            </strong>
                        </div>
                        {atributos.map((atributo) => (
                            <div
                                className="modal-cromo-atributo"
                                key={atributo.clave}
                            >
                                <span>
                                    {atributo.nombre.charAt(0).toLocaleUpperCase(idioma)}
                                    {atributo.nombre.slice(1)}
                                </span>
                                <div className="modal-cromo-barra">
                                    <div
                                        className="modal-cromo-barra-progreso"
                                        style={{
                                            width: `${Math.min(
                                                Math.max(atributo.valor, 0),
                                                100
                                            )}%`
                                        }}
                                    />
                                </div>
                                <strong>{atributo.valor}</strong>
                            </div>
                        ))}
                    </section>

                    <p className="modal-cromo-escala">
                        {detalleTextos.notaEscala || (es ? "Escala de 10 a 99." : "Scale from 10 to 99.")}
                    </p>

                    <nav className="modal-cromo-navegacion" aria-label={es ? "Navegación de cromos" : "Cards navigation"}>
                        {cromoAnterior ? (
                            <button
                                type="button"
                                className="modal-cromo-nav-btn modal-cromo-nav-prev"
                                onClick={() => onCambiarCromo?.(cromoAnterior)}
                            >
                                <span aria-hidden="true">&lt;</span> {String(cromoAnterior.numero).padStart(3, "0")} {cromoAnterior.nombre}
                            </button>
                        ) : <span className="modal-cromo-nav-espacio" aria-hidden="true" />}

                        {cromoSiguiente ? (
                            <button
                                type="button"
                                className="modal-cromo-nav-btn modal-cromo-nav-next"
                                onClick={() => onCambiarCromo?.(cromoSiguiente)}
                            >
                                <span aria-hidden="true">&gt;</span> {String(cromoSiguiente.numero).padStart(3, "0")} {cromoSiguiente.nombre}
                            </button>
                        ) : <span className="modal-cromo-nav-espacio" aria-hidden="true" />}
                    </nav>
                </div>
            </section>
        </div>
    );
}

export default ModalDetalleCromo;
