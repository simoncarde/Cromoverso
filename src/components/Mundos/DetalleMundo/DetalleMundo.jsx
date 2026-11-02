import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SelectorMundos from "./SelectorMundos.jsx";
import FiltroRareza from "./FiltroRareza.jsx";
import FiltroTipo from "./FiltroTipo.jsx";
import TarjetaCromo from "./TarjetaCromo.jsx";
import useColeccionCromos from "../../../hooks/useColeccionCromos.js";
import Icono from "../../Iconos.jsx";
import { IconoUI } from "../../Iconos.jsx";
import "./DetalleMundo.css";

const RAREZAS = ["legendaria", "epica", "rara", "comun"];
const TIPOS = ["heroe", "aliado", "villano"];
const NOMBRES_RAREZA = {
    legendaria: "Legendaria",
    epica: "Épica",
    rara: "Rara",
    comun: "Común",
};
const NOMBRES_TIPO = { heroe: "Héroe", aliado: "Aliado", villano: "Villano" };

function DetalleMundo({ mundos = [], cargandoMundos = false, errorMundos = false }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cromos, cargando, error } = useColeccionCromos();
    const [rareza, setRareza] = useState("");
    const [tipo, setTipo] = useState("");
    const [orden, setOrden] = useState("numero");
    const [busqueda, setBusqueda] = useState("");
    const [busquedaAbierta, setBusquedaAbierta] = useState(false);

    const mundo = mundos.find((item) => item.id === id);

    const cromosDelMundo = useMemo(() => {
        const consulta = busqueda.trim().toLocaleLowerCase("es");
        const filtrados = cromos.filter((cromo) =>
            cromo.mundo === id &&
            (!rareza || cromo.rareza === rareza) &&
            (!tipo || cromo.tipo === tipo) &&
            (!consulta || `${cromo.nombre} ${cromo.id}`.toLocaleLowerCase("es").includes(consulta))
        );
        return [...filtrados].sort((a, b) => {
            if (orden === "nombre") return a.nombre.localeCompare(b.nombre, "es");
            if (orden === "rareza") return RAREZAS.indexOf(a.rareza) - RAREZAS.indexOf(b.rareza) || a.numero - b.numero;
            return a.numero - b.numero;
        });
    }, [cromos, id, rareza, tipo, orden, busqueda]);

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
        return <main className="detalle-mundo estado-pagina">Cargando colección…</main>;
    }
    if (errorMundos || error) {
        return <main className="detalle-mundo estado-pagina">No fue posible cargar los mundos o sus cromos. Intenta nuevamente.</main>;
    }
    if (!mundo) {
        return <main className="detalle-mundo estado-pagina"><h1>Mundo no encontrado</h1><Link to="/mundos/neon">Ir a Ciudad Neón</Link></main>;
    }

    const indiceMundo = mundos.findIndex((item) => item.id === id) + 1;
    const primerNumero = String(mundo.numeros?.desde ?? 1).padStart(3, "0");
    const ultimoNumero = String(mundo.numeros?.hasta ?? 20).padStart(3, "0");
    const descripcionMundo = typeof mundo.descripcion === "string" && mundo.descripcion.trim()
        ? mundo.descripcion
        : "Descubre los héroes y cromos de este mundo.";

    return (
        <main className="detalle-mundo" style={{ "--color-mundo": mundo.color }}>
            <header className="detalle-mundo-hero">
                <div className="detalle-mundo-hero-interior">
                    <nav className="detalle-mundo-migas" aria-label="Ruta de navegación">
                        <Link to="/">Inicio</Link>
                        <span aria-hidden="true">›</span>
                        <span>{mundo.nombre}</span>
                    </nav>

                    <div className="detalle-mundo-mobile-heading">
                        <button type="button" className="detalle-mundo-hero-boton" onClick={() => navigate("/")} aria-label="Volver al inicio">
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
                            aria-label={busquedaAbierta ? "Cerrar búsqueda" : "Buscar cromos"}
                            aria-expanded={busquedaAbierta}
                        >
                            <Icono nombre={busquedaAbierta ? "cerrar" : "buscar"} />
                        </button>
                    </div>

                    <div className="detalle-mundo-desktop-heading">
                        <h1>{mundo.nombre}</h1>
                        <p>Mundo {indiceMundo} de {mundos.length} · cromos {primerNumero} al {ultimoNumero}.</p>
                    </div>

                    {busquedaAbierta && (
                        <form className="detalle-mundo-busqueda-movil" onSubmit={(evento) => evento.preventDefault()} role="search">
                            <Icono nombre="buscar" />
                            <input
                                type="search"
                                value={busqueda}
                                onChange={(evento) => setBusqueda(evento.target.value)}
                                placeholder="Buscar un héroe o número"
                                aria-label="Buscar cromos por nombre o número"
                                autoFocus
                            />
                            {busqueda && <button type="button" onClick={() => setBusqueda("")} aria-label="Limpiar búsqueda"><Icono nombre="cerrar" /></button>}
                        </form>
                    )}
                </div>
            </header>

            <div className="detalle-mundo-contenido">
                <aside className="detalle-mundo-sidebar">
                    <SelectorMundos mundos={mundos} actual={id} />
                    <FiltroRareza
                        valores={RAREZAS}
                        nombres={NOMBRES_RAREZA}
                        conteos={conteoRareza}
                        seleccionado={rareza}
                        onChange={setRareza}
                    />
                    <FiltroTipo
                        valores={TIPOS}
                        nombres={NOMBRES_TIPO}
                        conteos={conteoTipo}
                        seleccionado={tipo}
                        onChange={setTipo}
                    />
                </aside>

                <section className="detalle-mundo-coleccion" aria-label={`Cromos de ${mundo.nombre}`}>
                    <div className="detalle-mundo-controles-movil">
                        <label className="detalle-mundo-filtro-movil">
                            <span className="sr-only">Filtrar por rareza</span>
                            <select value={rareza} onChange={(evento) => setRareza(evento.target.value)}>
                                <option value="">Rareza: todas</option>
                                {RAREZAS.map((valor) => <option key={valor} value={valor}>{NOMBRES_RAREZA[valor]}</option>)}
                            </select>
                            <IconoUI nombre="chevronAbajo" size={16} />
                        </label>
                        <label className="detalle-mundo-filtro-movil">
                            <span className="sr-only">Filtrar por tipo</span>
                            <select value={tipo} onChange={(evento) => setTipo(evento.target.value)}>
                                <option value="">Tipo: todos</option>
                                {TIPOS.map((valor) => <option key={valor} value={valor}>{NOMBRES_TIPO[valor]}</option>)}
                            </select>
                            <IconoUI nombre="chevronAbajo" size={16} />
                        </label>
                    </div>

                    <div className="detalle-mundo-barra">
                        <p><strong>{cromosDelMundo.length}</strong> de {cromosSinFiltro.length || mundo.totalCromos} cromos</p>
                        <label className="detalle-mundo-orden">
                            <span>Orden:</span>
                            <span className="detalle-mundo-select-wrap">
                                <select value={orden} onChange={(evento) => setOrden(evento.target.value)} aria-label="Ordenar cromos">
                                    <option value="numero">Número</option>
                                    <option value="nombre">Nombre</option>
                                    <option value="rareza">Rareza</option>
                                </select>
                                <IconoUI nombre="chevronAbajo" size={14} />
                            </span>
                        </label>
                    </div>

                    {cromosDelMundo.length > 0 ? (
                        <div className="detalle-mundo-grid">
                            {cromosDelMundo.map((cromo) => (
                                <TarjetaCromo key={cromo.id} cromo={cromo} mundo={mundo} />
                            ))}
                        </div>
                    ) : (
                        <div className="detalle-mundo-vacio">
                            {cromosSinFiltro.length === 0
                                ? "Este mundo todavía no tiene cromos disponibles."
                                : "No hay cromos que coincidan con estos filtros."}
                            {(rareza || tipo || busqueda) && (
                                <button type="button" onClick={() => { setRareza(""); setTipo(""); setBusqueda(""); }}>
                                    Limpiar filtros
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
