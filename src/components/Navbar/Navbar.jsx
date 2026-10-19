import { useEffect, useRef, useState } from "react";
import Icono from "./Iconos.jsx";
import "./Navbar.css";

const ENLACES = ["album", "sobres", "intercambios", "mundos", "ranking"];

const DESTINOS = {
    inicio: "#inicio",
    album: "#album",
    sobres: "#sobres",
    intercambios: "#intercambios",
    mundos: "#mundos",
    ranking: "#ranking",
    miColeccion: "#miColeccion",
    perfilYLogros: "#perfilYLogros",
    notificaciones: "#notificaciones",
};

const ICONOS_MENU_MOVIL = {
    inicio: "inicio",
    album: "album",
    sobres: "sobre",
    intercambios: "intercambio",
    mundos: "globo",
    ranking: "trofeo",
    miColeccion: "album",
    perfilYLogros: "usuario",
    notificaciones: "campana",
};

function Navbar({
    textos,
    cargando,
    error,
    idioma,
    cambiarIdioma,
    activo,
    onBuscar,
    textoGrande,
    alternarTexto,
}) {
    const [busqueda, setBusqueda] = useState("");
    const [menuAbierto, setMenuAbierto] = useState(null);
    const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
    const [seccionActiva, setSeccionActiva] = useState(activo || "inicio");
    const [tamanoTexto, setTamanoTexto] = useState(
        textoGrande ? "grande" : "mediano"
    );
    const [altoContraste, setAltoContraste] = useState(false);
    const [reducirMovimiento, setReducirMovimiento] = useState(false);
    const [subrayarEnlaces, setSubrayarEnlaces] = useState(false);
    const [fuenteFacil, setFuenteFacil] = useState(false);

    const navbarRef = useRef(null);
    const botonMenu = useRef(null);

    const nav = textos?.navbar;
    const menuMovil = textos?.menuMovil;

    const idiomaAbierto = menuAbierto === "idioma";
    const preferenciasAbiertas = menuAbierto === "preferencias";
    const notificacionesAbiertas = menuAbierto === "notificaciones";

    useEffect(() => {
        if (activo) {
            setSeccionActiva(activo);
        }
    }, [activo]);

    useEffect(() => {
        function manejarEscape(evento) {
            if (evento.key === "Escape") {
                setMenuAbierto(null);
                setMenuMovilAbierto(false);
                botonMenu.current?.focus();
            }
        }

        function manejarClickFuera(evento) {
            if (
                navbarRef.current &&
                !navbarRef.current.contains(evento.target)
            ) {
                setMenuAbierto(null);
                setMenuMovilAbierto(false);
            }
        }

        document.addEventListener("keydown", manejarEscape);
        document.addEventListener("mousedown", manejarClickFuera);

        return () => {
            document.removeEventListener("keydown", manejarEscape);
            document.removeEventListener("mousedown", manejarClickFuera);
        };
    }, []);

    useEffect(() => {
        document.body.classList.toggle("accesibilidad-contraste", altoContraste);
        document.body.classList.toggle("accesibilidad-movimiento", reducirMovimiento);
        document.body.classList.toggle("accesibilidad-subrayado", subrayarEnlaces);
        document.body.classList.toggle("accesibilidad-fuente", fuenteFacil);
        document.body.classList.toggle(
            "accesibilidad-texto-pequeno",
            tamanoTexto === "pequeno"
        );
        document.body.classList.toggle(
            "accesibilidad-texto-grande",
            tamanoTexto === "grande"
        );

        return () => {
            document.body.classList.remove(
                "accesibilidad-contraste",
                "accesibilidad-movimiento",
                "accesibilidad-subrayado",
                "accesibilidad-fuente",
                "accesibilidad-texto-pequeno",
                "accesibilidad-texto-grande"
            );
        };
    }, [
        altoContraste,
        reducirMovimiento,
        subrayarEnlaces,
        fuenteFacil,
        tamanoTexto,
    ]);

    function manejarBusqueda(evento) {
        setBusqueda(evento.target.value);
    }

    function enviarResultadosBusqueda(evento) {
        evento.preventDefault();
        const consulta = busqueda.trim();

        if (consulta) {
            onBuscar(consulta);
        }
    }

    function alternarMenu(nombre) {
        setMenuAbierto((actual) => (actual === nombre ? null : nombre));
        setMenuMovilAbierto(false);
    }

    function alternarMenuMovil() {
        setMenuMovilAbierto((actual) => !actual);
        setMenuAbierto(null);
    }

    function abrirPreferencias() {
        setMenuMovilAbierto(false);
        setMenuAbierto("preferencias");
    }

    function navegar(destino) {
        setSeccionActiva(destino);

        if (DESTINOS[destino]) {
            window.location.hash = DESTINOS[destino];
        }

        setMenuAbierto(null);
        setMenuMovilAbierto(false);
    }

    function seleccionarIdioma(nuevoIdioma) {
        cambiarIdioma(nuevoIdioma);
    }

    function cambiarTamanoTexto(nuevoTamano) {
        setTamanoTexto(nuevoTamano);

        const quiereTextoGrande = nuevoTamano === "grande";

        if (quiereTextoGrande !== textoGrande) {
            alternarTexto();
        }
    }

    function restablecerAccesibilidad() {
        setTamanoTexto("mediano");
        setAltoContraste(false);
        setReducirMovimiento(false);
        setSubrayarEnlaces(false);
        setFuenteFacil(false);

        if (textoGrande) {
            alternarTexto();
        }
    }

    const cantidadSobres = 0;

    const textoSobres =
        cantidadSobres === 1
            ? nav?.botones?.sobresDisponibles?.uno?.replace(
                  "{cantidad}",
                  cantidadSobres
              )
            : nav?.botones?.sobresDisponibles?.otro?.replace(
                  "{cantidad}",
                  cantidadSobres
              );

    const claseNavbar = menuMovilAbierto
        ? "navbar navbar-movil-abierto"
        : "navbar";

    return (
        <nav ref={navbarRef} className={claseNavbar}>
            <div className="navbar-interior">
                <a
                    className="navbar-marca"
                    href={DESTINOS.inicio}
                    aria-label={nav?.logo?.aria}
                    onClick={() => navegar("inicio")}
                >
                    <span className="navbar-logo-normal">
                        <Icono nombre="logo" />
                    </span>
                    <span className="navbar-logo-inverso">
                        <Icono nombre="logoInverso" />
                    </span>
                </a>

                <nav
                    className="navbar-enlaces"
                    aria-label="Navegación principal"
                >
                    {ENLACES.map((item) => (
                        <a
                            key={item}
                            href={DESTINOS[item]}
                            className={
                                seccionActiva === item ? "activo" : ""
                            }
                            onClick={() => navegar(item)}
                            aria-current={
                                seccionActiva === item ? "page" : undefined
                            }
                        >
                            {nav?.enlaces?.[item]}
                        </a>
                    ))}
                </nav>

                <div className="navbar-derecha">
                    <form
                        className="navbar-buscador"
                    onSubmit={enviarResultadosBusqueda}
                    role="search"
                >
                    <button
                        type="submit"
                        className="navbar-buscador-boton"
                        aria-label={nav?.buscador?.aria}
                    >
                        <Icono nombre="buscar" />
                    </button>
                    <input
                        type="search"
                        value={busqueda}
                        onChange={manejarBusqueda}
                        placeholder={nav?.buscador?.placeholder}
                        aria-label={nav?.buscador?.aria}
                    />
                    </form>

                    <div className="navbar-utilidades">
                    <div className="navbar-idioma">
                        <button
                            type="button"
                            className={
                                idiomaAbierto
                                    ? "navbar-idioma-boton navbar-control-activo"
                                    : "navbar-idioma-boton"
                            }
                            onClick={() => alternarMenu("idioma")}
                            aria-label={nav?.aria?.idioma}
                            aria-expanded={idiomaAbierto}
                        >
                            <Icono nombre="globo" />
                            <span>{idioma.toUpperCase()}</span>
                            <Icono nombre="chevronAbajo" />
                        </button>

                        {idiomaAbierto && (
                            <div className="navbar-idioma-menu">
                                <button
                                    type="button"
                                    onClick={() => seleccionarIdioma("es")}
                                >
                                    <span>
                                        <strong>Español</strong>
                                        <small>Español · ES</small>
                                    </span>
                                    {idioma === "es" && <Icono nombre="check" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => seleccionarIdioma("en")}
                                >
                                    <span>
                                        <strong>English</strong>
                                        <small>English · EN</small>
                                    </span>
                                    {idioma === "en" && <Icono nombre="check" />}
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className={
                            preferenciasAbiertas
                                ? "navbar-icono navbar-control-activo"
                                : "navbar-icono"
                        }
                        onClick={abrirPreferencias}
                        aria-label={nav?.aria?.accesibilidad}
                        aria-expanded={preferenciasAbiertas}
                    >
                        <Icono nombre="accesibilidad" />
                    </button>

                    <a
                        className="navbar-estado"
                        href={DESTINOS.sobres}
                        aria-label={textoSobres}
                        onClick={() => navegar("sobres")}
                    >
                        <Icono nombre="sobre" />
                        <span>{cantidadSobres}</span>
                        <span className="navbar-estado-texto">sobres</span>
                    </a>

                    <div className="navbar-notificaciones">
                        <button
                            type="button"
                            className={
                                notificacionesAbiertas
                                    ? "navbar-icono navbar-control-activo"
                                    : "navbar-icono"
                            }
                            onClick={() => alternarMenu("notificaciones")}
                            aria-label={nav?.aria?.notificaciones}
                            aria-expanded={notificacionesAbiertas}
                        >
                            <Icono nombre="campana" />
                            <span className="navbar-notificaciones-punto" />
                        </button>
                    </div>

                    <a
                        className="navbar-icono navbar-usuario"
                        href={DESTINOS.perfilYLogros}
                        aria-label={nav?.usuario?.perfil}
                        onClick={() => navegar("perfilYLogros")}
                    >
                        <Icono nombre="usuario" />
                    </a>
                    </div>
                </div>

                <div className="navbar-movil-acciones">
                    <a
                        className="navbar-estado"
                        href={DESTINOS.sobres}
                        aria-label={textoSobres}
                        onClick={() => navegar("sobres")}
                    >
                        <Icono nombre="sobre" />
                        <span>{cantidadSobres}</span>
                    </a>

                    <button
                        type="button"
                        className="navbar-icono navbar-movil-campana"
                        onClick={() => alternarMenu("notificaciones")}
                        aria-label={nav?.aria?.notificaciones}
                        aria-expanded={notificacionesAbiertas}
                    >
                        <Icono nombre="campana" />
                        <span className="navbar-notificaciones-punto" />
                    </button>

                    <button
                        ref={botonMenu}
                        type="button"
                        className="navbar-icono navbar-movil-menu-boton"
                        onClick={alternarMenuMovil}
                        aria-label={
                            menuMovilAbierto
                                ? menuMovil?.cerrar
                                : menuMovil?.abrir
                        }
                        aria-expanded={menuMovilAbierto}
                    >
                        <Icono
                            nombre={menuMovilAbierto ? "cerrar" : "menu"}
                        />
                    </button>
                </div>
            </div>

            {notificacionesAbiertas && (
                <div className="navbar-notificaciones-menu">
                    <div className="navbar-notificaciones-cabecera">
                        Notificaciones
                    </div>
                    <div className="navbar-notificaciones-contenido">
                        No tienes notificaciones nuevas.
                    </div>
                </div>
            )}

            {menuMovilAbierto && (
                <div className="navbar-panel">
                    <nav
                        className="navbar-panel-enlaces"
                        aria-label="Navegación móvil"
                    >
                        {Object.entries(menuMovil?.enlaces ?? {}).map(
                            ([item, etiqueta]) => {
                                const esActivo = seccionActiva === item;

                                return (
                                    <a
                                        key={item}
                                        href={DESTINOS[item]}
                                        className={
                                            esActivo
                                                ? "navbar-panel-enlace activo"
                                                : "navbar-panel-enlace"
                                        }
                                        onClick={() => navegar(item)}
                                        aria-current={
                                            esActivo ? "page" : undefined
                                        }
                                    >
                                        <span className="navbar-panel-enlace-icono">
                                            <Icono
                                                nombre={
                                                    ICONOS_MENU_MOVIL[item]
                                                }
                                            />
                                        </span>
                                        <span className="navbar-panel-enlace-texto">
                                            {etiqueta}
                                        </span>
                                        {esActivo ? (
                                            <span className="navbar-panel-enlace-activo">
                                                ESTÁS AQUÍ
                                            </span>
                                        ) : (
                                            <Icono nombre="chevronAbajo" />
                                        )}
                                    </a>
                                );
                            }
                        )}
                    </nav>

                    <div className="navbar-panel-separador" />

                    <div className="navbar-panel-opciones">
                        <button
                            type="button"
                            className="navbar-panel-opcion"
                            onClick={abrirPreferencias}
                        >
                            <span className="navbar-panel-opcion-info">
                                <span className="navbar-panel-opcion-icono">
                                    <Icono nombre="globo" />
                                </span>
                                <span>Idioma</span>
                            </span>
                            <span className="navbar-panel-opcion-flecha">
                                <Icono nombre="chevronAbajo" />
                            </span>
                        </button>

                        <button
                            type="button"
                            className="navbar-panel-opcion"
                            onClick={abrirPreferencias}
                        >
                            <span className="navbar-panel-opcion-info">
                                <span className="navbar-panel-opcion-icono">
                                    <Icono nombre="accesibilidad" />
                                </span>
                                <span>Accesibilidad</span>
                            </span>
                            <span className="navbar-panel-opcion-flecha">
                                <Icono nombre="chevronAbajo" />
                            </span>
                        </button>
                    </div>

                    <div className="navbar-panel-separador" />

                    <div className="navbar-panel-usuario">
                        <div className="navbar-panel-usuario-info">
                            <span className="navbar-panel-usuario-avatar">
                                <Icono nombre="usuario" />
                            </span>
                            <div className="navbar-panel-usuario-texto">
                                <strong>
                                    {nav?.botones?.ingresar ?? "Ingresar"}
                                </strong>
                                <span>
                                    {idioma === "es"
                                        ? "Accede a tu cuenta"
                                        : "Access your account"}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="navbar-panel-usuario-boton"
                            onClick={() => {
                                setMenuMovilAbierto(false);
                                window.location.hash = "#ingresar";
                            }}
                        >
                            <Icono nombre="usuario" />
                            <span>
                                {nav?.botones?.ingresar ?? "Ingresar"}
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {preferenciasAbiertas && (
                <div className="navbar-preferencias">
                    <div className="navbar-preferencias-panel">
                        <div className="navbar-preferencias-arrastre" />

                        <div className="navbar-preferencias-cabecera">
                            <h2 className="navbar-preferencias-titulo-desktop">Accesibilidad</h2>
                            <h2 className="navbar-preferencias-titulo-movil">Idioma y accesibilidad</h2>
                            <button
                                type="button"
                                className="navbar-preferencias-cerrar"
                                onClick={() => setMenuAbierto(null)}
                                aria-label="Cerrar"
                            >
                                <Icono nombre="cerrar" />
                            </button>
                        </div>

                        <section className="navbar-preferencias-idioma">
                            <div className="navbar-preferencias-etiqueta">
                                <Icono nombre="globo" />
                                <span>IDIOMA · LANGUAGE</span>
                            </div>

                            <div className="navbar-preferencias-idiomas">
                                <button
                                    type="button"
                                    className={idioma === "es" ? "activo" : ""}
                                    onClick={() => seleccionarIdioma("es")}
                                    aria-pressed={idioma === "es"}
                                >
                                    {idioma === "es" && <span>✓</span>}
                                    Español
                                </button>
                                <button
                                    type="button"
                                    className={idioma === "en" ? "activo" : ""}
                                    onClick={() => seleccionarIdioma("en")}
                                    aria-pressed={idioma === "en"}
                                >
                                    English
                                </button>
                            </div>

                            <p>
                                Solo cambia los textos de la interfaz
                                (lang="es-CO"). Se recuerda en este dispositivo.
                            </p>
                        </section>

                        <section className="navbar-preferencias-accesibilidad">
                            <h3>Accesibilidad</h3>

                            <div className="navbar-preferencias-tamano">
                                <strong>Tamaño del texto</strong>
                                <div className="navbar-preferencias-tamanos">
                                    <button
                                        type="button"
                                        className={
                                            tamanoTexto === "pequeno"
                                                ? "activo"
                                                : ""
                                        }
                                        onClick={() =>
                                            cambiarTamanoTexto("pequeno")
                                        }
                                        aria-pressed={
                                            tamanoTexto === "pequeno"
                                        }
                                    >
                                        A
                                    </button>
                                    <button
                                        type="button"
                                        className={
                                            tamanoTexto === "mediano"
                                                ? "activo"
                                                : ""
                                        }
                                        onClick={() =>
                                            cambiarTamanoTexto("mediano")
                                        }
                                        aria-pressed={
                                            tamanoTexto === "mediano"
                                        }
                                    >
                                        A
                                    </button>
                                    <button
                                        type="button"
                                        className={
                                            tamanoTexto === "grande"
                                                ? "activo"
                                                : ""
                                        }
                                        onClick={() =>
                                            cambiarTamanoTexto("grande")
                                        }
                                        aria-pressed={tamanoTexto === "grande"}
                                    >
                                        A
                                    </button>
                                </div>
                            </div>

                            <div className="navbar-preferencias-opcion">
                                <div>
                                    <strong>Alto contraste</strong>
                                    <small>
                                        Más diferencia entre texto y fondo
                                    </small>
                                </div>
                                <button
                                    type="button"
                                    className={
                                        altoContraste
                                            ? "navbar-switch activo"
                                            : "navbar-switch"
                                    }
                                    onClick={() =>
                                        setAltoContraste((actual) => !actual)
                                    }
                                    aria-pressed={altoContraste}
                                >
                                    <span />
                                </button>
                            </div>

                            <div className="navbar-preferencias-opcion">
                                <div>
                                    <strong>Reducir movimiento</strong>
                                    <small>
                                        Sin animación al abrir sobres
                                    </small>
                                </div>
                                <button
                                    type="button"
                                    className={
                                        reducirMovimiento
                                            ? "navbar-switch activo"
                                            : "navbar-switch"
                                    }
                                    onClick={() =>
                                        setReducirMovimiento(
                                            (actual) => !actual
                                        )
                                    }
                                    aria-pressed={reducirMovimiento}
                                >
                                    <span />
                                </button>
                            </div>

                            <div className="navbar-preferencias-opcion">
                                <div>
                                    <strong>Subrayar enlaces</strong>
                                    <small>
                                        Los enlaces no dependen del color
                                    </small>
                                </div>
                                <button
                                    type="button"
                                    className={
                                        subrayarEnlaces
                                            ? "navbar-switch activo"
                                            : "navbar-switch"
                                    }
                                    onClick={() =>
                                        setSubrayarEnlaces(
                                            (actual) => !actual
                                        )
                                    }
                                    aria-pressed={subrayarEnlaces}
                                >
                                    <span />
                                </button>
                            </div>

                            <div className="navbar-preferencias-opcion">
                                <div>
                                    <strong>Fuente para lectura fácil</strong>
                                    <small>
                                        Letras más espaciadas y sin mayúsculas fijas
                                    </small>
                                </div>
                                <button
                                    type="button"
                                    className={
                                        fuenteFacil
                                            ? "navbar-switch activo"
                                            : "navbar-switch"
                                    }
                                    onClick={() =>
                                        setFuenteFacil((actual) => !actual)
                                    }
                                    aria-pressed={fuenteFacil}
                                >
                                    <span />
                                </button>
                            </div>
                        </section>

                        <div className="navbar-preferencias-pie">
                            <button
                                type="button"
                                onClick={() => setMenuAbierto(null)}
                            >
                                Declaración de accesibilidad
                            </button>
                            <button
                                type="button"
                                onClick={restablecerAccesibilidad}
                            >
                                Restablecer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
