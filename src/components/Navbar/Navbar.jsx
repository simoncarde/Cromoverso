import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Icon({ name, size = 22 }) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        focusable: false,
    };

    switch (name) {
        case "home":
            return (
                <svg {...common}>
                    <path d="m3 10 9-7 9 7" />
                    <path d="M5 9v11h14V9M9 20v-6h6v6" />
                </svg>
            );

        case "world":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
                </svg>
            );

        case "access":
            return (
                <svg {...common}>
                    <circle cx="12" cy="5" r="2" />
                    <path d="M4 9h16M12 7v13M8 20l4-7 4 7" />
                </svg>
            );

        case "close":
            return (
                <svg {...common}>
                    <path d="m6 6 12 12M18 6 6 18" />
                </svg>
            );

        case "menu":
            return (
                <svg {...common}>
                    <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
            );

        case "chevron":
            return (
                <svg {...common}>
                    <path d="m9 18 6-6-6-6" />
                </svg>
            );

        default:
            return null;
    }
}

function Marca({ onClick, ariaLabel, texto }) {
    return (
        <Link
            to="/"
            className="navbar-marca"
            aria-label={ariaLabel || "Cromoverso, ir al inicio"}
            onClick={onClick}
        >
            <svg
                className="navbar-marca-simbolo"
                viewBox="0 0 40 40"
                aria-hidden="true"
            >
                <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="#6C3BFF"
                    stroke="currentColor"
                    strokeWidth="2"
                />

                <path
                    d="m20 7 3.5 8 8.5 1-6.3 5.8 1.7 8.4-7.4-4.2-7.4 4.2 1.7-8.4L8 16l8.5-1L20 7Z"
                    fill="#FFD23F"
                />
            </svg>

            <span>{texto || "cromoverso"}</span>
        </Link>
    );
}

function Navbar({
    textos,
    idioma = "es",
    cambiarIdioma,
    activo = "inicio",
    abrirPanelAccesibilidad,
    mundos = [],
}) {
    const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
    const [mundosAbiertos, setMundosAbiertos] = useState(false);

    const listaMundos = Array.isArray(mundos) && mundos.length > 0 ? mundos : [
        { id: "neon", nombre: "Ciudad Neón" },
        { id: "coral", nombre: "Abismo Coral" },
        { id: "bosque", nombre: "Bosque Eterno" },
        { id: "forja", nombre: "Forja Volcánica" },
        { id: "orbita", nombre: "Estación Órbita" },
        { id: "niebla", nombre: "Reino de Niebla" },
    ];

    const nav = textos?.navbar;
    const menuMovil = textos?.menuMovil;
    const accesibilidad = textos?.accesibilidad;
    const textosIdioma = textos?.idioma;
    const es = idioma === "es";

    const marcaAria = nav?.logo?.aria || (es ? "Cromoverso, ir al inicio" : "Cromoverso, go to home");
    const marcaTexto = nav?.logo?.texto || "cromoverso";
    const inicio = nav?.enlaces?.inicio || (es ? "Inicio" : "Home");
    const mundosTexto = nav?.enlaces?.mundos || (es ? "Mundos" : "Worlds");
    const ingresar = nav?.botones?.ingresar || (es ? "Ingresar" : "Log in");
    const crearCuenta = nav?.botones?.crearCuenta || (es ? "Crear cuenta" : "Create account");
    const navPrincipalAria = es ? "Navegación principal" : "Main navigation";
    const navMovilAria = es ? "Navegación móvil" : "Mobile navigation";
    const accesibilidadAria = nav?.aria?.accesibilidad || accesibilidad?.titulo || (es ? "Accesibilidad" : "Accessibility");
    const abrirMenuAria = menuMovil?.abrir || (es ? "Abrir menú" : "Open menu");
    const cerrarMenuAria = menuMovil?.cerrar || (es ? "Cerrar menú" : "Close menu");
    const menuDialogAria = nav?.usuario?.menu || (es ? "Menú principal" : "Main menu");
    const estasAquiTexto = (menuMovil?.aria?.estasAqui || (es ? "Estás aquí" : "You are here")).toUpperCase();
    const seccionIdioma = menuMovil?.secciones?.idioma || textosIdioma?.etiqueta || (es ? "Idioma" : "Language");
    const seccionAccesibilidad = menuMovil?.secciones?.accesibilidad || accesibilidad?.titulo || (es ? "Accesibilidad" : "Accessibility");
    const abrirAccesibilidadAria = accesibilidad?.botones?.abrir || nav?.aria?.accesibilidad || (es ? "Abrir accesibilidad" : "Open accessibility");

    function cerrarMenu() {
        setMenuMovilAbierto(false);
        setMundosAbiertos(false);
    }

    useEffect(() => {
        if (!menuMovilAbierto) return undefined;

        const overflowAnterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        function manejarEscape(evento) {
            if (evento.key === "Escape") cerrarMenu();
        }

        window.addEventListener("keydown", manejarEscape);

        return () => {
            document.body.style.overflow = overflowAnterior;
            window.removeEventListener("keydown", manejarEscape);
        };
    }, [menuMovilAbierto]);

    function abrirAccesibilidad(evento) {
        cerrarMenu();
        abrirPanelAccesibilidad?.(evento);
    }

    return (
        <header className="navbar">
            <div className="navbar-barra">
                <Marca ariaLabel={marcaAria} texto={marcaTexto} />

                <nav
                    className="navbar-enlaces"
                    aria-label={navPrincipalAria}
                >
                    <Link
                        to="/"
                        className={activo === "inicio" ? "activo" : ""}
                    >
                        {inicio}
                    </Link>

                    <Link
                        to="/mundos/neon"
                        className={activo === "mundos" ? "activo" : ""}
                    >
                        {mundosTexto}
                    </Link>
                </nav>

                <div className="navbar-acciones-escritorio">
                    <button
                        type="button"
                        className="navbar-accesibilidad"
                        onClick={abrirPanelAccesibilidad}
                        aria-label={accesibilidadAria}
                    >
                        <Icon name="access" size={20} />
                    </button>

                    <div className="navbar-idiomas">
                        <button
                            type="button"
                            className={es ? "seleccionado" : ""}
                            onClick={() => cambiarIdioma?.("es")}
                            aria-pressed={es}
                        >
                            {textosIdioma?.codigos?.es || "ES"}
                        </button>

                        <button
                            type="button"
                            className={!es ? "seleccionado" : ""}
                            onClick={() => cambiarIdioma?.("en")}
                            aria-pressed={!es}
                        >
                            {textosIdioma?.codigos?.en || "EN"}
                        </button>
                    </div>

                    <a
                        className="navbar-boton navbar-boton-claro"
                        href="#ingresar"
                    >
                        {ingresar}
                    </a>

                    <a
                        className="navbar-boton navbar-boton-morado"
                        href="#crear-cuenta"
                    >
                        {crearCuenta}
                    </a>
                </div>

                <div className="navbar-acciones-movil">
                    <a
                        className="navbar-ingresar-movil"
                        href="#ingresar"
                    >
                        {ingresar}
                    </a>

                    <button
                        type="button"
                        className="navbar-menu-trigger"
                        onClick={() => setMenuMovilAbierto(true)}
                        aria-label={abrirMenuAria}
                        aria-expanded={menuMovilAbierto}
                    >
                        <Icon name="menu" size={25} />
                    </button>
                </div>
            </div>

            {menuMovilAbierto && (
                <div
                    className="navbar-overlay-movil"
                    role="dialog"
                    aria-modal="true"
                    aria-label={menuDialogAria}
                >
                    <div className="navbar-overlay-cabecera">
                        <Marca onClick={cerrarMenu} ariaLabel={marcaAria} texto={marcaTexto} />

                        <button
                            type="button"
                            className="navbar-cerrar-menu"
                            onClick={cerrarMenu}
                            aria-label={cerrarMenuAria}
                        >
                            <Icon name="close" size={23} />
                        </button>
                    </div>

                    <div className="navbar-overlay-contenido">
                        <nav
                            className="navbar-overlay-enlaces"
                            aria-label={navMovilAria}
                        >
                            <Link
                                to="/"
                                className={
                                    activo === "inicio" ? "activo" : ""
                                }
                                onClick={cerrarMenu}
                            >
                                <Icon name="home" size={20} />

                                <span>{inicio}</span>

                                {activo === "inicio" && (
                                    <strong>
                                        {estasAquiTexto}
                                    </strong>
                                )}
                            </Link>

                            <div className="navbar-overlay-grupo-mundos">
                                <button
                                    type="button"
                                    className={`navbar-overlay-mundos ${
                                        activo === "mundos" ? "activo" : ""
                                    } ${mundosAbiertos ? "expandido" : ""}`}
                                    onClick={() =>
                                        setMundosAbiertos((anterior) => !anterior)
                                    }
                                    aria-expanded={mundosAbiertos}
                                    aria-controls="navbar-lista-mundos"
                                >
                                    <Icon name="world" size={20} />

                                    <span>{mundosTexto}</span>

                                    <Icon name="chevron" size={19} />
                                </button>

                                {mundosAbiertos && (
                                    <div
                                        className="navbar-overlay-lista-mundos"
                                        id="navbar-lista-mundos"
                                    >
                                        {listaMundos.map((mundo) => (
                                            <Link
                                                key={mundo.id}
                                                to={`/mundos/${mundo.id}`}
                                                className="navbar-overlay-mundo"
                                                onClick={cerrarMenu}
                                            >
                                                <img
                                                    className="navbar-overlay-mundo-icono"
                                                    src={`/assets/mundos/${mundo.id}.svg`}
                                                    alt=""
                                                    aria-hidden="true"
                                                />

                                                <span>{mundo.nombre}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </nav>

                        <div className="navbar-overlay-ajustes">
                            <div className="navbar-overlay-fila">
                                <span>{seccionIdioma}</span>

                                <div className="navbar-overlay-idiomas">
                                    <button
                                        type="button"
                                        className={es ? "seleccionado" : ""}
                                        onClick={() => cambiarIdioma?.("es")}
                                        aria-pressed={es}
                                    >
                                        {textosIdioma?.codigos?.es || "ES"}
                                    </button>

                                    <button
                                        type="button"
                                        className={!es ? "seleccionado" : ""}
                                        onClick={() => cambiarIdioma?.("en")}
                                        aria-pressed={!es}
                                    >
                                        {textosIdioma?.codigos?.en || "EN"}
                                    </button>
                                </div>
                            </div>

                            <div className="navbar-overlay-fila">
                                <span>{seccionAccesibilidad}</span>

                                <button
                                    type="button"
                                    className="navbar-overlay-accesibilidad"
                                    onClick={abrirAccesibilidad}
                                    aria-label={abrirAccesibilidadAria}
                                >
                                    <Icon name="access" size={21} />
                                </button>
                            </div>
                        </div>

                        <div className="navbar-overlay-botones">
                            <a
                                className="navbar-boton navbar-boton-claro"
                                href="#ingresar"
                                onClick={cerrarMenu}
                            >
                                {ingresar}
                            </a>

                            <a
                                className="navbar-boton navbar-boton-morado"
                                href="#crear-cuenta"
                                onClick={cerrarMenu}
                            >
                                {crearCuenta}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;