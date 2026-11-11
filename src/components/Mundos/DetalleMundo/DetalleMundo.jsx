import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SelectorMundos from "./SelectorMundos.jsx";
import FiltroRareza from "./FiltroRareza.jsx";
import FiltroTipo from "./FiltroTipo.jsx";
import TarjetaCromo from "./TarjetaCromo.jsx";
import useColeccionCromos from "../../../hooks/useColeccionCromos.js";
import Icono from "../../Iconos.jsx";
import { IconoUI } from "../../Iconos.jsx";
import { formatearTexto } from "../../../utils/textos.js";
import "./DetalleMundo.css";

const RAREZAS = ["legendaria", "epica", "rara", "comun"];
const TIPOS = ["heroe", "aliado", "villano"];

function DetalleMundo({
    mundos = [],
    cargandoMundos = false,
    errorMundos = false,
    textos,
    idioma = "es"
}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cromos, cargando, error } = useColeccionCromos();
    const [rareza, setRareza] = useState("");
    const [tipo, setTipo] = useState("");
    const [orden, setOrden] = useState("numero");
    const [busqueda, setBusqueda] = useState("");
    const [busquedaAbierta, setBusquedaAbierta] = useState(false);

    const albumMundo = textos?.paginas?.albumMundo;
    const cromoTextos = textos?.componentes?.cromo;
    const estados = textos?.estados;
    const general = textos?.general;
    const es = idioma === "es";

    const nombresRareza = cromoTextos?.rarezas || {
        legendaria: es ? "Legendaria" : "Legendary",
        epica: es ? "Épica" : "Epic",
        rara: es ? "Rara" : "Rare",
        comun: es ? "Común" : "Common",
    };

    const nombresTipo = cromoTextos?.tipos || albumMundo?.filtros?.tipo?.opciones || {
        heroe: es ? "Héroe" : "Hero",
        aliado: es ? "Aliado" : "Ally",
        villano: es ? "Villano" : "Villain",
    };

    const mundo = mundos.find((item) => item.id === id);

    const cromosDelMundo = useMemo(() => {
        const consulta = busqueda.trim().toLocaleLowerCase(es ? "es" : "en");
        const filtrados = cromos.filter((cromo) =>
            cromo.mundo === id &&
            (!rareza || cromo.rareza === rareza) &&
            (!tipo || cromo.tipo === tipo) &&
            (!consulta || `${cromo.nombre} ${cromo.id}`.toLocaleLowerCase(es ? "es" : "en").includes(consulta))
        );
        return [...filtrados].sort((a, b) => {
            if (orden === "nombre") return a.nombre.localeCompare(b.nombre, es ? "es" : "en");
            if (orden === "rareza") return RAREZAS.indexOf(a.rareza) - RAREZAS.indexOf(b.rareza) || a.numero - b.numero;
            return a.numero - b.numero;
        });
    }, [cromos, id, rareza, tipo, orden, busqueda, es]);

    const cromosSinFiltro = useMemo(
        () => cromos.filter((cromo) => cromo.mundo === id),
        [cromos, id]
    );
    const conteoRareza = useMemo(() => Object.fromEntries(
        RAREZAS.map((valor) => [valor, cromosSinFiltro.filter((c) => c.rareza === valor).length])
    ), [cromosSinFiltro]);
    const conteoTipo = useMemo(() => Object.fromEntries(
        TIPOS.map((valor) => [valor, cromosSinFiltro.filter((c) => c.tipo === valor).length])
    ), [cromosSinFiltro]);

    if (cargandoMundos || cargando) {
        return (
            <main className="detalle-mundo estado-pagina" id="contenido-principal" tabIndex="-1" role="status" aria-live="polite">
                {estados?.cargando || (es ? "Cargando colección…" : "Loading collection…")}
            </main>
        );
    }
    if (errorMundos || error) {
        return (
            <main className="detalle-mundo estado-pagina" id="contenido-principal" tabIndex="-1" role="alert">
                {estados?.error?.texto || (es ? "No fue posible cargar los mundos o sus cromos. Intenta nuevamente." : "Could not load worlds or cards. Please try again.")}
            </main>
        );
    }
    if (!mundo) {
        return (
            <main className="detalle-mundo estado-pagina" id="contenido-principal" tabIndex="-1">
                <h1>{estados?.noEncontrado?.titulo || (es ? "Mundo no encontrado" : "World not found")}</h1>
                <Link to="/mundos/neon">
                    {estados?.noEncontrado?.botones?.irAlInicio || (es ? "Ir a Ciudad Neón" : "Go to Neon City")}
                </Link>
            </main>
        );
    }

    const indiceMundo = mundos.findIndex((item) => item.id === id) + 1;
    const primerNumero = String(mundo.numeros?.desde ?? 1).padStart(3, "0");
    const ultimoNumero = String(mundo.numeros?.hasta ?? 20).padStart(3, "0");
    const descripcionMundo = typeof mundo.descripcion === "string" && mundo.descripcion.trim()
        ? mundo.descripcion
        : (es ? "Descubre los héroes y cromos de este mundo." : "Discover the heroes and cards of this world.");

    const textoRango = albumMundo?.encabezado?.rango
        ? formatearTexto(albumMundo.encabezado.rango, {
            numero: indiceMundo,
            desde: primerNumero,
            hasta: ultimoNumero,
        })
        : (es
            ? `Mundo ${indiceMundo} de ${mundos.length} · cromos ${primerNumero} al ${ultimoNumero}.`
            : `World ${indiceMundo} of ${mundos.length} · cards ${primerNumero} to ${ultimoNumero}.`);

    const textoMigasInicio = albumMundo?.migas?.inicio || (es ? "Inicio" : "Home");
    const ariaMigas = es ? "Ruta de navegación" : "Breadcrumb navigation";
    const ariaVolver = general?.acciones?.volver || (es ? "Volver al inicio" : "Go back");
    const ariaBuscar = textos?.navbar?.buscador?.aria || (es ? "Buscar cromos" : "Search cards");
    const ariaCerrarBusqueda = general?.acciones?.cerrar || (es ? "Cerrar búsqueda" : "Close search");
    const placeholderBuscar = textos?.navbar?.buscador?.placeholder || (es ? "Buscar un héroe o número" : "Search for a hero or a number");
    const ariaBuscarInput = textos?.navbar?.buscador?.aria || (es ? "Buscar cromos por nombre o número" : "Search cards by name or number");
    const ariaLimpiar = general?.acciones?.cerrar || (es ? "Limpiar búsqueda" : "Clear search");
    const totalCards = cromosSinFiltro.length || mundo.totalCromos;

    const textoOrdenLabel = albumMundo?.orden?.etiqueta
        ? albumMundo.orden.etiqueta.replace("{orden}", "").trim()
        : (es ? "Orden:" : "Sort:");
    const textoOrdenNumero = albumMundo?.orden?.opciones?.numero || (es ? "Número" : "Number");
    const textoOrdenNombre = general?.etiquetas?.nombre || (es ? "Nombre" : "Name");
    const textoOrdenRareza = albumMundo?.filtros?.rareza?.titulo
        ? albumMundo.filtros.rareza.titulo.replace(/Filtrar por |Filter by /i, "")
        : (es ? "Rareza" : "Rarity");

    const coleccionAria = albumMundo?.seo?.titulo
        ? formatearTexto(albumMundo.seo.titulo, { mundo: mundo.nombre })
        : (es ? `Cromos de ${mundo.nombre}` : `Cards of ${mundo.nombre}`);

    return (
        <main className="detalle-mundo" id="contenido-principal" tabIndex="-1" style={{ "--color-mundo": mundo.color }}>
            <header className="detalle-mundo-hero">
                <div className="detalle-mundo-hero-interior">
                    <nav className="detalle-mundo-migas" aria-label={ariaMigas}>
                        <Link to="/">{textoMigasInicio}</Link>
                        <span aria-hidden="true">›</span>
                        <span>{mundo.nombre}</span>
                    </nav>

                    <div className="detalle-mundo-mobile-heading">
                        <button type="button" className="detalle-mundo-hero-boton" onClick={() => navigate("/")} aria-label={ariaVolver}>
                            <Icono nombre="flechaIzq" />
                        </button>
                        <div className="detalle-mundo-mobile-titulos">
                            <h1>{mundo.nombre}</h1>
                            <p>{descripcionMundo}</p>
                        </div>
                        <button
                            type="button"
                            className="detalle-mundo-hero-boton"
                            onClick={() => setBusquedaAbierta((actual) => !actual)}
                            aria-label={busquedaAbierta ? ariaCerrarBusqueda : ariaBuscar}
                            aria-expanded={busquedaAbierta}
                        >
                            <Icono nombre={busquedaAbierta ? "cerrar" : "buscar"} />
                        </button>
                    </div>

                    <div className="detalle-mundo-desktop-heading">
                        <h1>{mundo.nombre}</h1>
                        <p>{textoRango}</p>
                    </div>

                    {busquedaAbierta && (
                        <form className="detalle-mundo-busqueda-movil" onSubmit={(evento) => evento.preventDefault()} role="search">
                            <Icono nombre="buscar" />
                            <input
                                type="search"
                                value={busqueda}
                                onChange={(evento) => setBusqueda(evento.target.value)}
                                placeholder={placeholderBuscar}
                                aria-label={ariaBuscarInput}
                                autoFocus
                            />
                            {busqueda && (
                                <button type="button" onClick={() => setBusqueda("")} aria-label={ariaLimpiar}>
                                    <Icono nombre="cerrar" />
                                </button>
                            )}
                        </form>
                    )}
                </div>
            </header>

            <div className="detalle-mundo-contenido">
                <aside className="detalle-mundo-sidebar">
                    <SelectorMundos
                        mundos={mundos}
                        actual={id}
                        textos={textos}
                        idioma={idioma}
                    />
                    <FiltroRareza
                        valores={RAREZAS}
                        nombres={nombresRareza}
                        conteos={conteoRareza}
                        seleccionado={rareza}
                        onChange={setRareza}
                        textos={textos}
                        idioma={idioma}
                    />
                    <FiltroTipo
                        valores={TIPOS}
                        nombres={nombresTipo}
                        conteos={conteoTipo}
                        seleccionado={tipo}
                        onChange={setTipo}
                        textos={textos}
                        idioma={idioma}
                    />
                </aside>

                <section className="detalle-mundo-coleccion" aria-label={coleccionAria}>
                    <div className="detalle-mundo-controles-movil">
                        <label className="detalle-mundo-filtro-movil">
                            <span className="sr-only">
                                {albumMundo?.filtros?.rareza?.titulo || (es ? "Filtrar por rareza" : "Filter by rarity")}
                            </span>
                            <select value={rareza} onChange={(evento) => setRareza(evento.target.value)}>
                                <option value="">
                                    {albumMundo?.filtros?.rareza?.todas || (es ? "Rareza: todas" : "Rarity: all")}
                                </option>
                                {RAREZAS.map((valor) => (
                                    <option key={valor} value={valor}>{nombresRareza[valor]}</option>
                                ))}
                            </select>
                            <IconoUI nombre="chevronAbajo" size={16} />
                        </label>
                        <label className="detalle-mundo-filtro-movil">
                            <span className="sr-only">
                                {albumMundo?.filtros?.tipo?.titulo || (es ? "Filtrar por tipo" : "Filter by type")}
                            </span>
                            <select value={tipo} onChange={(evento) => setTipo(evento.target.value)}>
                                <option value="">
                                    {albumMundo?.filtros?.tipo?.todos || (es ? "Tipo: todos" : "Type: all")}
                                </option>
                                {TIPOS.map((valor) => (
                                    <option key={valor} value={valor}>{nombresTipo[valor]}</option>
                                ))}
                            </select>
                            <IconoUI nombre="chevronAbajo" size={16} />
                        </label>
                    </div>

                    <div className="detalle-mundo-barra">
                        <p>
                            <strong>{cromosDelMundo.length}</strong>{" "}
                            {general?.formatos?.deTotal
                                ? formatearTexto(general.formatos.deTotal, { cantidad: "", total: totalCards }).trim()
                                : (es ? `de ${totalCards}` : `of ${totalCards}`)}{" "}
                            {general?.formatos?.cromos?.otro
                                ? formatearTexto(general.formatos.cromos.otro, { cantidad: "" }).trim()
                                : (es ? "cromos" : "cards")}
                        </p>
                        <label className="detalle-mundo-orden">
                            <span>{textoOrdenLabel}</span>
                            <span className="detalle-mundo-select-wrap">
                                <select
                                    value={orden}
                                    onChange={(evento) => setOrden(evento.target.value)}
                                    aria-label={general?.acciones?.ordenar || (es ? "Ordenar cromos" : "Sort cards")}
                                >
                                    <option value="numero">{textoOrdenNumero}</option>
                                    <option value="nombre">{textoOrdenNombre}</option>
                                    <option value="rareza">{textoOrdenRareza}</option>
                                </select>
                                <IconoUI nombre="chevronAbajo" size={14} />
                            </span>
                        </label>
                    </div>

                    {cromosDelMundo.length > 0 ? (
                        <div className="detalle-mundo-grid">
                            {cromosDelMundo.map((cromo) => (
                                <TarjetaCromo
                                    key={cromo.id}
                                    cromo={cromo}
                                    mundo={mundo}
                                    textos={textos}
                                    idioma={idioma}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="detalle-mundo-vacio">
                            {cromosSinFiltro.length === 0 ? (
                                <p>{estados?.vacio?.titulo || (es ? "Este mundo todavía no tiene cromos disponibles." : "This world has no cards available yet.")}</p>
                            ) : (
                                <>
                                    <h3>{albumMundo?.vacio?.titulo || (es ? "Ningún cromo coincide con estos filtros" : "No cards match these filters")}</h3>
                                    <p>{albumMundo?.vacio?.texto || (es ? "Prueba con otra rareza u otro tipo." : "Try another rarity or type.")}</p>
                                </>
                            )}
                            {(rareza || tipo || busqueda) && (
                                <button
                                    type="button"
                                    onClick={() => { setRareza(""); setTipo(""); setBusqueda(""); }}
                                >
                                    {albumMundo?.vacio?.botones?.limpiar || general?.acciones?.quitarFiltros || (es ? "Limpiar filtros" : "Clear filters")}
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default DetalleMundo;
