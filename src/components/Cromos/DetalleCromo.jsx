import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { urlCromo } from "../../services/api.js";
import useColeccionCromos from "../../hooks/useColeccionCromos.js";
import ModalDetalleCromo from "../Mundos/DetalleMundo/ModalDetalleCromo.jsx";
import "../Mundos/DetalleMundo/DetalleMundo.css";
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
    const { cromos } = useColeccionCromos();
    const [intento, setIntento] = useState(0);
    const [resultado, setResultado] = useState({ id, cromo: null, cargando: true, error: null });
    const cromo = resultado.id === id ? resultado.cromo : null;

    const infoNavegacion = useMemo(() => {
        if (!cromo || !Array.isArray(cromos) || cromos.length === 0) return null;
        const delMundo = cromos
            .filter((item) => item.mundo === cromo.mundo)
            .sort((a, b) => Number(a.numero) - Number(b.numero));
        const indice = delMundo.findIndex(
            (item) => item.id === cromo.id || Number(item.numero) === Number(cromo.numero)
        );
        return {
            posicion: cromo.posicion ?? (indice >= 0 ? indice + 1 : cromo.numero),
            anterior: indice > 0 ? delMundo[indice - 1] : null,
            siguiente: indice >= 0 && indice < delMundo.length - 1 ? delMundo[indice + 1] : null
        };
    }, [cromo, cromos]);
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

    const nombreMundo = cromo.mundoNombre || cromo.mundo;
    const colorBase = cromo.ilustracion?.colorBase || "#5935a8";

    return (
        <ModalDetalleCromo
            cromo={cromo}
            mundoNombre={nombreMundo}
            mundoColor={colorBase}
            posicion={infoNavegacion?.posicion ?? cromo.posicion ?? cromo.numero}
            cromoAnterior={infoNavegacion?.anterior}
            cromoSiguiente={infoNavegacion?.siguiente}
            onCambiarCromo={(nuevoCromo) =>
                navigate(`/cromos/${encodeURIComponent(nuevoCromo.id)}`, {
                    state: location.state
                })
            }
            textos={textos}
            idioma={idioma}
            onCerrar={cerrar}
        />
    );
}

export default DetalleCromo;
