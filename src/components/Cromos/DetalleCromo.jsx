import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { urlCromo } from "../../services/api.js";
import { IconoUI } from "../Iconos.jsx";
import "./DetalleCromo.css";

const ICONOS_RAREZA = {
    comun: "circulo",
    rara: "rombo",
    epica: "estrella",
    legendaria: "corona",
};
const cromosEnCache = new Map();
const solicitudesCromo = new Map();

function extraerCromo(respuesta) {
    if (!respuesta.ok) {
        const error = new Error("No se pudo cargar el cromo.");
        error.status = respuesta.status;
        return respuesta.json().catch(() => ({})).then((datos) => {
            error.codigo = datos?.codigo || datos?.error?.codigo || datos?.error;
            throw error;
        });
    }
    return respuesta.json().then((datos) => {
        const cromo = datos?.datos ?? datos;
        if (!cromo || typeof cromo !== "object" || Array.isArray(cromo)) {
            throw new Error("La respuesta de la API no contiene un cromo válido.");
        }
        return cromo;
    });
}

function calcularVariacion(figura) {
    return Array.from(String(figura || "" )).reduce(
        (total, caracter) => (total * 31 + caracter.codePointAt(0)) % 360,
        0,
    );
}

function SiluetaCromo({ figura, nombre }) {
    const etiqueta = typeof figura === "string" ? figura : figura?.nombre || figura?.tipo || "";
    const giro = calcularVariacion(etiqueta);
    const radioCabeza = 32 + (giro % 9);
    const anchoCuerpo = 38 + (giro % 13);

    return (
        <svg className="detalle-cromo-silueta" viewBox="0 0 240 300" role="img" aria-label={etiqueta ? `${nombre}: ${etiqueta}` : nombre}>
            <defs>
                <linearGradient id="detalle-cromo-brillo" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stopColor="white" stopOpacity=".9" />
                    <stop offset="1" stopColor="white" stopOpacity=".2" />
                </linearGradient>
            </defs>
            <g transform={`rotate(${giro % 9 - 4} 120 150)`}>
                <ellipse cx="120" cy="75" rx={radioCabeza} ry={radioCabeza + 3} fill="url(#detalle-cromo-brillo)" />
                <path d={`M${120 - anchoCuerpo} 123 Q120 103 ${120 + anchoCuerpo} 123 L193 238 Q120 267 47 238 Z`} fill="url(#detalle-cromo-brillo)" />
                <path d="M79 137 35 209 53 222 101 174M161 137l44 72-18 13-48-48" fill="none" stroke="white" strokeOpacity=".72" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m87 230-10 51m76-51 10 51" fill="none" stroke="white" strokeOpacity=".8" strokeWidth="22" strokeLinecap="round" />
                <path d="m95 125 25 28 25-28" fill="none" stroke="white" strokeOpacity=".55" strokeWidth="5" />
            </g>
            <circle cx="120" cy="150" r="137" fill="none" stroke="white" strokeOpacity=".25" strokeWidth="2" strokeDasharray="3 9" />
        </svg>
    );
}

function DetalleCromo({ textos, idioma = "es" }) {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [intento, setIntento] = useState(0);
    const [resultado, setResultado] = useState({ id, cromo: null, cargando: true, error: null });
    const cromo = resultado.id === id ? resultado.cromo : null;
    const cargando = resultado.id !== id || resultado.cargando;
    const error = resultado.id === id ? resultado.error : null;
    const es = idioma === "es";
    const estadoTextos = textos?.estados || {};
    const cromoTextos = textos?.componentes?.cromo || {};
    const detalleTextos = cromoTextos.detalle || {};
    const rutaFondo = location.state?.backgroundLocation;
    const cerrar = () => navigate(rutaFondo && location.state?.regresarConHistorial !== false ? -1 : cromo?.mundo ? `/mundos/${encodeURIComponent(cromo.mundo)}` : "/mundos");

    useEffect(() => {
        function manejarTecla(evento) {
            if (evento.key === "Escape") cerrar();
        }
        document.addEventListener("keydown", manejarTecla);
        return () => document.removeEventListener("keydown", manejarTecla);
    }, [rutaFondo, cromo?.mundo]);

    useEffect(() => {
        const desbordamientoAnterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = desbordamientoAnterior;
        };
    }, []);

    const modal = (contenido, nombreDialogo) => (
        <div className="detalle-cromo-overlay" onMouseDown={(evento) => evento.target === evento.currentTarget && cerrar()}>
            <main className="detalle-cromo" id="contenido-principal" tabIndex="-1" role="dialog" aria-modal="true" aria-label={nombreDialogo} style={{ "--detalle-cromo-color": cromo?.ilustracion?.colorBase || "#5935a8" }}>
                <button type="button" className="detalle-cromo-cerrar" onClick={cerrar} aria-label={textos?.general?.acciones?.cerrar || (es ? "Cerrar detalle" : "Close details")}>×</button>
                {contenido}
            </main>
        </div>
    );

    useEffect(() => {
        let cancelado = false;
        setResultado({ id, cromo: null, cargando: true, error: null });
        const solicitud = cromosEnCache.has(id)
            ? Promise.resolve(cromosEnCache.get(id))
            : solicitudesCromo.get(id) || fetch(urlCromo(id)).then(extraerCromo).then((datos) => {
                cromosEnCache.set(id, datos);
                return datos;
            }).finally(() => solicitudesCromo.delete(id));
        if (!cromosEnCache.has(id) && !solicitudesCromo.has(id)) solicitudesCromo.set(id, solicitud);
        solicitud
            .then((datos) => {
                if (!cancelado) setResultado({ id, cromo: datos, cargando: false, error: null });
            })
            .catch((fallo) => {
                if (!cancelado) {
                    setResultado({ id, cromo: null, cargando: false, error: fallo });
                }
            });
        return () => { cancelado = true; };
    }, [id, intento]);

    useEffect(() => {
        if (cromo?.mundo && !rutaFondo) {
            navigate(location.pathname, {
                replace: true,
                state: {
                    backgroundLocation: {
                        pathname: `/mundos/${encodeURIComponent(cromo.mundo)}`,
                        search: "",
                        hash: "",
                        key: "detalle-cromo-fondo",
                        state: null,
                    },
                    regresarConHistorial: false,
                },
            });
        }
    }, [cromo, rutaFondo, location.pathname, navigate]);

    useEffect(() => {
        if (!cromo) return;
        const tituloAnterior = document.title;
        const descripcionAnterior = document.querySelector('meta[name="description"]')?.getAttribute("content");
        const titulo = `${cromo.nombre} · ${textos?.sitio?.nombre || "Cromoverso"}`;
        const descripcion = cromo.descripcion || cromo.poder || cromo.nombre;
        document.title = titulo;

        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement("meta");
            meta.name = "description";
            document.head.append(meta);
        }
        meta.content = descripcion;

        return () => {
            document.title = tituloAnterior;
            if (descripcionAnterior === null || descripcionAnterior === undefined) meta.remove();
            else meta.content = descripcionAnterior;
        };
    }, [cromo, textos?.sitio?.nombre]);

    if (cargando) {
        return modal(<div className="detalle-cromo-estado" role="status" aria-live="polite">{estadoTextos.cargando || (es ? "Cargando cromo…" : "Loading card…")}</div>, es ? "Cargando cromo" : "Loading card");
    }

    if (error?.status === 404 || error?.codigo === "no_encontrado") {
        const noEncontrado = estadoTextos.noEncontrado || {};
        return modal(
            <div className="detalle-cromo-estado">
                <span className="detalle-cromo-kicker">404</span>
                <h1>{noEncontrado.titulo || (es ? "Cromo no encontrado" : "Card not found")}</h1>
                <p>{noEncontrado.texto || (es ? "Este cromo no existe o ya no está disponible." : "This card does not exist or is no longer available.")}</p>
                <Link className="detalle-cromo-volver" to="/mundos">{noEncontrado.botones?.irAlInicio || (es ? "Explorar mundos" : "Explore worlds")}</Link>
            </div>, noEncontrado.titulo || (es ? "Cromo no encontrado" : "Card not found"),
        );
    }

    if (error) {
        return modal(
            <div className="detalle-cromo-estado" role="alert">
                <h1>{estadoTextos.error?.titulo || (es ? "No se pudo cargar el cromo" : "Could not load this card")}</h1>
                <p>{estadoTextos.error?.texto || (es ? "Intenta nuevamente dentro de un momento." : "Please try again in a moment.")}</p>
                <button
                    type="button"
                    className="detalle-cromo-reintentar"
                    onClick={() => {
                        cromosEnCache.delete(id);
                        solicitudesCromo.delete(id);
                        setIntento((prev) => prev + 1);
                    }}
                >
                    {estadoTextos.error?.botones?.reintentar || (es ? "Reintentar" : "Retry")}
                </button>
            </div>,
            estadoTextos.error?.titulo || (es ? "No se pudo cargar el cromo" : "Could not load this card")
        );
    }

    const rarezas = cromoTextos.rarezas || {};
    const tipos = cromoTextos.tipos || {};
    const rareza = rarezas[cromo.rareza] || cromo.rareza;
    const tipo = tipos[cromo.tipo] || cromo.tipo;
    const atributos = Object.entries(cromo.atributos || {}).map(([clave, valor]) => ({
        clave,
        nombre: cromoTextos.atributos?.[clave] || clave,
        valor: Number(valor),
    })).filter((atributo) => Number.isFinite(atributo.valor));
    const nombreMundo = cromo.mundoNombre || cromo.mundo;
    const numero = cromo.numero === undefined ? cromo.id : String(cromo.numero).padStart(3, "0");
    const colorBase = cromo.ilustracion?.colorBase || "#5935a8";

    return modal(
        <>
            <nav className="detalle-cromo-migas" aria-label={textos?.general?.etiquetas?.navegacion || (es ? "Ruta de navegación" : "Breadcrumb navigation")}>
                <Link to="/mundos">{textos?.paginas?.albumMundo?.migas?.mundos || (es ? "Mundos" : "Worlds")}</Link>
                {cromo.mundo && <><span aria-hidden="true">/</span><Link to={`/mundos/${encodeURIComponent(cromo.mundo)}`}>{nombreMundo}</Link></>}
                <span aria-hidden="true">/</span><span aria-current="page">{cromo.nombre}</span>
            </nav>
            <div className="detalle-cromo-contenido">
                <section
                    className="detalle-cromo-arte"
                    aria-label={cromo.nombre}
                    style={{
                        "--color-mundo": cromo.ilustracion?.colorBase || colorBase
                    }}
                >
                    <TarjetaCromo
                        cromo={cromo}
                        mundo={mundoNombre}
                        textos={textos}
                        idioma={idioma}
                    />
                </section>
                <article className="detalle-cromo-ficha">
                    <p className="detalle-cromo-identificador">{cromo.id}</p>
                    <h1>{cromo.nombre}</h1>
                    <p className="detalle-cromo-resumen">{cromo.descripcion || cromo.poder}</p>
                    <div className="detalle-cromo-etiquetas">
                        <span className={`detalle-cromo-etiqueta rareza-${cromo.rareza}`}><IconoUI nombre={ICONOS_RAREZA[cromo.rareza]} size={15} />{rareza}</span>
                        {tipo && <span className="detalle-cromo-etiqueta">{tipo}</span>}
                        {nombreMundo && <span className="detalle-cromo-etiqueta">{nombreMundo}</span>}
                    </div>
                    {cromo.poder && cromo.descripcion && <section className="detalle-cromo-poder"><h2>{detalleTextos.poder || (es ? "Poder" : "Power")}</h2><p>{cromo.poder}</p></section>}
                    {atributos.length > 0 && <section className="detalle-cromo-atributos" aria-labelledby="detalle-cromo-atributos-titulo">
                        <div className="detalle-cromo-atributos-cabecera"><h2 id="detalle-cromo-atributos-titulo">{detalleTextos.atributos || (es ? "Atributos" : "Attributes")}</h2><span>{(detalleTextos.total || "Total")} {atributos.reduce((suma, atributo) => suma + atributo.valor, 0)}</span></div>
                        {atributos.map(({ clave, nombre, valor }) => <div className="detalle-cromo-atributo" key={clave}><span>{nombre}</span><div className="detalle-cromo-barra" role="meter" aria-label={nombre} aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.min(100, Math.max(0, valor))}><span style={{ width: `${Math.min(100, Math.max(0, valor))}%` }} /></div><strong>{valor}</strong></div>)}
                    </section>}
                    {cromo.mundo && <Link className="detalle-cromo-volver" to={`/mundos/${encodeURIComponent(cromo.mundo)}`}>{textos?.general?.acciones?.volver || (es ? "Volver al álbum" : "Back to album")}</Link>}
                </article>
            </div>
        </>, cromo.nombre,
    );
}

export default DetalleCromo;
