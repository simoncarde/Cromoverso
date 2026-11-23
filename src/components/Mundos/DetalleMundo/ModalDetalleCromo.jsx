import { useEffect, useRef } from "react";
import { IconoUI } from "../../Iconos.jsx";

const ICONOS_RAREZA = {
    comun: "circulo",
    rara: "rombo",
    epica: "estrella",
    legendaria: "corona"
};

const PLANTILLAS_POR_MUNDO = {
    neon: "CV-001.svg",
    coral: "CV-081.svg",
    bosque: "CV-041.svg",
    forja: "CV-061.svg",
    orbita: "CV-082.svg",
    niebla: "CV-101.svg"
};

function ModalDetalleCromo({ cromo, mundoNombre, mundoColor, textos, onCerrar, idioma = "es" }) {

    const es = idioma === "es";
    const cerrarRef = useRef(null);
    const cromoTextos = textos?.componentes?.cromo || {};
    const detalleTextos = cromoTextos.detalle || {};
    const numero = String(cromo.numero).padStart(3, "0");
    const imagen = `/assets/cromos/CV-${numero}.svg`;
    const logoMundo = `/assets/mundos/${cromo.mundo}.svg`;
    const respaldo = `/assets/cromos/${
        PLANTILLAS_POR_MUNDO[cromo.mundo] || "CV-001.svg"
    }`;
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
    const atributos = Object.entries(cromo.atributos || {}).map(([clave, valor]) => ({
        clave,
        nombre: cromoTextos.atributos?.[clave] || clave,
        valor: Number(valor) || 0
    }));
    const total = atributos.reduce(
        (acumulado, atributo) => acumulado + atributo.valor,
        0
    );

    const iconoRareza = ICONOS_RAREZA[cromo.rareza] || "circulo";
    const nombreMundo = mundoNombre || cromo.mundoNombre || cromo.mundo;

    useEffect(() => {
        cerrarRef.current?.focus();
        function manejarTecla(evento) {
            if (evento.key === "Escape") onCerrar();
        }
        document.addEventListener("keydown", manejarTecla);
        return () => document.removeEventListener("keydown", manejarTecla);
    }, [onCerrar]);

    return (
        <div
            className="modal-cromo-overlay"
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
                    ×
                </button>
                <div
                    className="modal-cromo-arte"
                    style={{
                        backgroundColor:
                            cromo.ilustracion?.colorBase || mundoColor
                    }}
                >
                    <article
                        className={`modal-cromo-tarjeta rareza-borde-${cromo.rareza}`}
                    >
                        <div
                            className={`modal-cromo-imagen${
                                cromo.holografico ? " holografico" : ""
                            }`}
                        >
                            <img
                                src={imagen}
                                alt={`${cromo.nombre} - ${numero}`}
                                onError={(evento) => {
                                    evento.currentTarget.onerror = null;
                                    evento.currentTarget.src = respaldo;
                                }}
                            />
                            <span className="modal-cromo-numero">
                                {numero}
                            </span>
                            <span
                                className={`modal-cromo-sello rareza-${cromo.rareza}`}
                            >
                                <IconoUI
                                    nombre={iconoRareza}
                                    size={15}
                                />
                            </span>
                        </div>
                        <div className="modal-cromo-tarjeta-info">
                            <h3>{cromo.nombre}</h3>
                            <p>
                                {nombreMundo} ·{" "}
                                {nombresTipo[cromo.tipo] || cromo.tipo}
                            </p>
                        </div>
                    </article>
                </div>
                <div className="modal-cromo-informacion">
                    <p className="modal-cromo-identificacion">
                        {cromo.id || `CV-${numero}`}
                    </p>
                    <h2 id="modal-cromo-titulo">
                        {cromo.nombre}
                    </h2>
                    <p className="modal-cromo-subtitulo">
                        {nombreMundo} &middot; {nombresTipo[cromo.tipo] || cromo.tipo}
                    </p>
                    <div className="modal-cromo-etiquetas">
                        <span className={`modal-cromo-rareza rareza-${cromo.rareza}`}>
                            <IconoUI nombre={iconoRareza} size={13} />
                            {nombresRareza[cromo.rareza] || cromo.rareza}
                        </span>
                        <span className="modal-cromo-mundo">
                            {nombreMundo}
                        </span>
                        <span className="modal-cromo-tipo">
                            {nombresTipo[cromo.tipo] || cromo.tipo}
                        </span>
                    </div>
                    <div className="modal-cromo-poder">
                        <span className="modal-cromo-poder-icono">
                            <img src={logoMundo} alt="" aria-hidden="true" />
                        </span>
                        <div>
                            <span>
                                {detalleTextos.poder || (es ? "PODER" : "POWER")}
                            </span>
                            <p className="modal-cromo-descripcion">
                                {cromo.descripcion || cromo.poder}
                            </p>
                        </div>
                    </div>
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
                                <span>{atributo.nombre.charAt(0).toLocaleUpperCase(idioma)}{atributo.nombre.slice(1)}</span>
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
                    <p className="modal-cromo-escala">{detalleTextos.notaEscala || (es ? "Escala de 10 a 99." : "Scale from 10 to 99.")}</p>
                </div>
            </section>
        </div>
    );
}

export default ModalDetalleCromo;
