import { useState } from "react";
import Icono from "../Iconos.jsx";
import "./Navbar.css";

const ENLACES = ["inicio", "mundos"];
const DESTINOS = {
    inicio: "#inicio",
    mundos: "#mundos",
};
function Navbar({
    textos,
    idioma,
    cambiarIdioma,
    activo = "inicio",
    textoGrande = false,
    alternarTexto,
}) {
    const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
    const nav = textos?.navbar;
    const menuMovil = textos?.menuMovil;
    function seleccionarIdioma(nuevoIdioma) {
        cambiarIdioma(nuevoIdioma);
    }
    function navegar() {
        setMenuMovilAbierto(false);
    }
    return (
        <header className={`navbar ${menuMovilAbierto ? "menu-abierto" : ""}`}>
            <div className="navbar-interior">
                <a
                    className="navbar-marca"
                    href="#inicio"
                    aria-label={nav?.logo?.aria}
                    onClick={navegar}
                >
                    <span className="navbar-logo-escritorio">
                        <Icono nombre="logo" />
                    </span>

                    <span className="navbar-logo-movil">
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
                            className={activo === item ? "activo" : ""}
                            aria-current={activo === item ? "page" : undefined}
                        >
                            {nav?.enlaces?.[item]}
                        </a>
                    ))}
                </nav>

                <div className="navbar-acciones">

                    <button
                        type="button"
                        className="navbar-accesibilidad-boton"
                        onClick={alternarTexto}
                        aria-label={
                            nav?.aria?.accesibilidad ??
                            "Abrir opciones de accesibilidad"
                        }
                        aria-pressed={Boolean(textoGrande)}
                        title={
                            nav?.aria?.accesibilidad ??
                            "Accesibilidad"
                        }
                    >
                        <Icono nombre="accesibilidad" />
                    </button>

                    <div
                        className="navbar-idiomas"
                        role="group"
                        aria-label={nav?.aria?.idioma ?? "Seleccionar idioma"}
                    >
                        <button
                            type="button"
                            className={idioma === "es" ? "seleccionado" : ""}
                            onClick={() => seleccionarIdioma("es")}
                            aria-pressed={idioma === "es"}
                        >
                            ES
                        </button>

                        <button
                            type="button"
                            className={idioma === "en" ? "seleccionado" : ""}
                            onClick={() => seleccionarIdioma("en")}
                            aria-pressed={idioma === "en"}
                        >
                            EN
                        </button>
                    </div>

                    <a className="navbar-ingresar" href="#ingresar">
                        {nav?.botones?.ingresar}
                    </a>

                    <a className="navbar-crear" href="#registro">
                        {nav?.botones?.crearCuenta}
                    </a>
                </div>

                <div className="navbar-acciones-movil">
                    <a className="navbar-movil-ingresar" href="#ingresar">
                        {nav?.botones?.ingresar}
                    </a>

                    <button
                        type="button"
                        className="navbar-movil-boton"
                        onClick={() =>
                            setMenuMovilAbierto((actual) => !actual)
                        }
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

            {menuMovilAbierto && (
                <div className="navbar-panel">
                    <nav
                        className="navbar-panel-enlaces"
                        aria-label="Navegación móvil"
                    >
                        {ENLACES.map((item) => {
                            const esActivo = activo === item;

                            return (
                                <a
                                    key={item}
                                    href={DESTINOS[item]}
                                    className={
                                        esActivo
                                            ? "navbar-panel-enlace activo"
                                            : "navbar-panel-enlace"
                                    }
                                    onClick={navegar}
                                    aria-current={esActivo ? "page" : undefined}
                                >
                                    <span className="navbar-panel-icono">
                                        <Icono
                                            nombre={
                                                item === "inicio"
                                                    ? "inicio"
                                                    : "mundo"
                                            }
                                        />
                                    </span>

                                    <span className="navbar-panel-texto">
                                        {menuMovil?.enlaces?.[item]}
                                    </span>

                                    {esActivo ? (
                                        <span className="navbar-panel-etiqueta">
                                            ESTÁS AQUÍ
                                        </span>
                                    ) : (
                                        <span className="navbar-panel-flecha">
                                            <Icono nombre="chevronAbajo" />
                                        </span>
                                    )}
                                </a>
                            );
                        })}
                    </nav>

                    <div className="navbar-panel-opciones">
                        <div className="navbar-panel-idioma">
                            <span>
                                {menuMovil?.secciones?.idioma ?? "Idioma"}
                            </span>
                            <div
                                className="navbar-idiomas"
                                role="group"
                                aria-label={nav?.aria?.idioma ?? "Seleccionar idioma"}
                            >
                                <button
                                    type="button"
                                    className={
                                        idioma === "es" ? "seleccionado" : ""
                                    }
                                    onClick={() => seleccionarIdioma("es")}
                                    aria-pressed={idioma === "es"}
                                >
                                    ES
                                </button>

                                <button
                                    type="button"
                                    className={
                                        idioma === "en" ? "seleccionado" : ""
                                    }
                                    onClick={() => seleccionarIdioma("en")}
                                    aria-pressed={idioma === "en"}
                                >
                                    EN
                                </button>
                            </div>
                        </div>

                        <div className="navbar-panel-accesibilidad">
                            <span>
                                {menuMovil?.secciones?.accesibilidad ??
                                    "Accesibilidad"}
                            </span>

                            <button
                                type="button"
                                className="navbar-panel-accesibilidad-boton"
                                onClick={alternarTexto}
                                aria-label="Alternar texto grande"
                                aria-pressed={Boolean(textoGrande)}
                                title="Accesibilidad"
                            >
                                <Icono nombre="accesibilidad" />
                            </button>
                        </div>

                        <div className="navbar-panel-botones">
                            <a
                                href="#ingresar"
                                className="navbar-panel-ingresar"
                            >
                                {nav?.botones?.ingresar}
                            </a>

                            <a
                                href="#registro"
                                className="navbar-panel-crear"
                            >
                                {nav?.botones?.crearCuenta}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
