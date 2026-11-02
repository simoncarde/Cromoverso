import { useState } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Mundos from "./components/Mundos/Mundos.jsx";
import DetalleMundo from "./components/Mundos/DetalleMundo/DetalleMundo.jsx";
import Footer from "./components/Footer/Footer.jsx";
import PanelAccesibilidad from "./components/PanelAccesibilidad/PanelAccesibilidad.jsx";
import Cookies from "./components/Cookies/Cookies.jsx";

import useTextos from "./hooks/useTextos.js";
import useCromos from "./hooks/useCromos.js";
import useMundos from "./hooks/useMundos.js";
import useAccesibilidad from "./hooks/useAccesibilidad.js";

function Aplicacion() {
    const [idioma, setIdioma] = useState("es");
    const [panelAbierto, setPanelAbierto] = useState(false);
    const [posicionPanel, setPosicionPanel] = useState({ top: 100, left: 12 });
    const location = useLocation();

    const { textos, cargando, error } = useTextos(idioma);
    const { cromos, cargandoCromos, errorCromos } = useCromos();
    const { mundos, cargandoMundos, errorMundos } = useMundos();
    const { preferencias, cambiarPreferencia, restablecerPreferencias } = useAccesibilidad();

    function cambiarIdioma(nuevoIdioma) {
        setIdioma(nuevoIdioma);
    }

    function abrirPanelAccesibilidad(evento) {
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
    }

    const activo = location.pathname === "/" ? "inicio" : "mundos";

    const claseSitio = location.pathname.startsWith("/mundos/")
        ? "sitio sitio-vista-mundo"
        : "sitio";

    return (
        <div className={claseSitio}>
            <Navbar
                textos={textos}
                cargando={cargando}
                error={error}
                idioma={idioma}
                cambiarIdioma={cambiarIdioma}
                activo={activo}
                abrirPanelAccesibilidad={abrirPanelAccesibilidad}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        <main>
                            <Hero
                                textos={textos}
                                cargando={cargando}
                                error={error}
                                cromos={cromos}
                                cargandoCromos={cargandoCromos}
                                errorCromos={errorCromos}
                            />
                            <div className="mundos-con-banner">
                                <Mundos
                                    mundos={mundos}
                                    cargandoMundos={cargandoMundos}
                                    errorMundos={errorMundos}
                                    textos={textos}
                                />
                                <Cookies textos={textos?.cookies} />
                            </div>
                        </main>
                    }
                />
                <Route path="/mundos" element={<Navigate to="/mundos/neon" replace />} />
                <Route path="/mundos/:id" element={<DetalleMundo mundos={mundos} cargandoMundos={cargandoMundos} errorMundos={errorMundos} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Footer textos={textos} />

            {panelAbierto && (
                <PanelAccesibilidad
                    textos={textos}
                    preferencias={preferencias}
                    cambiarPreferencia={cambiarPreferencia}
                    restablecerPreferencias={restablecerPreferencias}
                    cerrarPanel={cerrarPanelAccesibilidad}
                    posicion={posicionPanel}
                />
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
