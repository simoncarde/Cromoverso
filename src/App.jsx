import { lazy, Suspense, useEffect, useRef, useState } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Mundos from "./components/Mundos/Mundos.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Cookies from "./components/Cookies/Cookies.jsx";

import useTextos from "./hooks/useTextos.js";
import useMundos from "./hooks/useMundos.js";
import useAccesibilidad from "./hooks/useAccesibilidad.js";

const DetalleMundo = lazy(() => import("./components/Mundos/DetalleMundo/DetalleMundo.jsx"));
const PanelAccesibilidad = lazy(() => import("./components/PanelAccesibilidad/PanelAccesibilidad.jsx"));

function Aplicacion() {
    const [idioma, setIdioma] = useState("es");
    const [panelAbierto, setPanelAbierto] = useState(false);
    const [posicionPanel, setPosicionPanel] = useState({ top: 100, left: 12 });
    const elementoDisparador = useRef(null);
    const location = useLocation();

    const { textos, cargando, error } = useTextos(idioma);
    const { mundos, cargandoMundos, errorMundos } = useMundos();
    const { preferencias, cambiarPreferencia, restablecerPreferencias } = useAccesibilidad();

    useEffect(() => {
        document.documentElement.lang = idioma;
        if (textos?.sitio?.nombre) {
            document.title = textos?.paginas?.inicio?.seo?.titulo || `${textos.sitio.nombre} · ${textos.sitio.lema || ""}`;
        }
    }, [idioma, textos]);

    function cambiarIdioma(nuevoIdioma) {
        setIdioma(nuevoIdioma);
    }

    function abrirPanelAccesibilidad(evento) {
        elementoDisparador.current = evento?.currentTarget ?? document.activeElement;
        const rectangulo = evento.currentTarget.getBoundingClientRect();
        const margen = 12;
        const esMovil = window.innerWidth <= 900;
        let left;
        let top;

        if (esMovil) {
            const altoPanel = Math.min(440, window.innerHeight * 0.68);
            left = 0;
            top = window.innerHeight - altoPanel;
        } else {
            const anchoPanel = 432;
            const altoPanel = 630;
            left = Math.max(margen, Math.min(rectangulo.right - anchoPanel, window.innerWidth - anchoPanel - margen));
            top = Math.max(margen, Math.min(rectangulo.bottom + 8, window.innerHeight - altoPanel - margen));
        }

        setPosicionPanel({ top, left });
        setPanelAbierto(true);
    }

    function cerrarPanelAccesibilidad() {
        setPanelAbierto(false);
        requestAnimationFrame(() => elementoDisparador.current?.focus());
    }

    const activo = location.pathname === "/" ? "inicio" : "mundos";

    const claseSitio = location.pathname.startsWith("/mundos/")
        ? "sitio sitio-vista-mundo"
        : "sitio";

    return (
        <div className={claseSitio}>
            <a className="salto-contenido" href="#contenido-principal">
                {idioma === "es" ? "Saltar al contenido principal" : "Skip to main content"}
            </a>
            <Navbar
                textos={textos}
                cargando={cargando}
                error={error}
                idioma={idioma}
                cambiarIdioma={cambiarIdioma}
                activo={activo}
                abrirPanelAccesibilidad={abrirPanelAccesibilidad}
                mundos={mundos}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        <main id="contenido-principal" tabIndex="-1">
                            <Hero
                                textos={textos}
                                idioma={idioma}
                                cargando={cargando}
                                error={error}
                            />
                            <div className="mundos-con-banner">
                                <Mundos
                                    mundos={mundos}
                                    cargandoMundos={cargandoMundos}
                                    errorMundos={errorMundos}
                                    textos={textos}
                                    idioma={idioma}
                                />
                                <Cookies textos={textos?.cookies} />
                            </div>
                        </main>
                    }
                />
                <Route path="/mundos" element={<Navigate to="/mundos/neon" replace />} />
                <Route
                    path="/mundos/:id"
                    element={
                        <Suspense fallback={<main className="estado-pagina" id="contenido-principal" role="status" aria-live="polite">{textos?.estados?.cargando || (idioma === "es" ? "Cargando…" : "Loading…")}</main>}>
                            <DetalleMundo
                                mundos={mundos}
                                cargandoMundos={cargandoMundos}
                                errorMundos={errorMundos}
                                textos={textos}
                                idioma={idioma}
                            />
                        </Suspense>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Footer textos={textos} idioma={idioma} />

            {panelAbierto && (
                <Suspense fallback={null}>
                    <PanelAccesibilidad
                        textos={textos}
                        idioma={idioma}
                        preferencias={preferencias}
                        cambiarPreferencia={cambiarPreferencia}
                        restablecerPreferencias={restablecerPreferencias}
                        cerrarPanel={cerrarPanelAccesibilidad}
                        posicion={posicionPanel}
                    />
                </Suspense>
            )}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Aplicacion />
        </BrowserRouter>
    );
}

export default App;
