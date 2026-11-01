
import { useState } from "react";

import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Mundos from "./components/Mundos/Mundos.jsx";
import Footer from "./components/Footer/Footer.jsx";
import PanelAccesibilidad from "./components/PanelAccesibilidad/PanelAccesibilidad.jsx";
import Cookies from "./components/Cookies/Cookies.jsx";
import useTextos from "./hooks/useTextos.js";
import useCromos from "./hooks/useCromos.js";
import useMundos from "./hooks/useMundos.js";
import useAccesibilidad from "./hooks/useAccesibilidad.js";

function App() {
    const [idioma, setIdioma] = useState("es");
    const [panelAbierto, setPanelAbierto] = useState(false);
    const [posicionPanel, setPosicionPanel] = useState({
        top: 100,
        left: 12,
    });
    const {
        textos,
        cargando,
        error,
    } = useTextos(idioma);

    const {
        cromos,
        cargandoCromos,
        errorCromos,
    } = useCromos();

    const {
        mundos,
        cargandoMundos,
        errorMundos,
    } = useMundos();

    const {
        preferencias,
        cambiarPreferencia,
        restablecerPreferencias,
    } = useAccesibilidad();

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
            const altoPanel = Math.min(
                440,
                window.innerHeight * 0.68
            );

            left = 0;
            top = window.innerHeight - altoPanel;
        } else {
            const anchoPanel = 432;
            const altoPanel = 630;

            left = rectangulo.right - anchoPanel;

            left = Math.max(
                margen,
                Math.min(
                    left,
                    window.innerWidth - anchoPanel - margen
                )
            );

            top = rectangulo.bottom + 8;

            top = Math.min(
                top,
                window.innerHeight - altoPanel - margen
            );

            top = Math.max(margen, top);
        }

        setPosicionPanel({
            top,
            left,
        });

        setPanelAbierto(true);
    }

    function cerrarPanelAccesibilidad() {
        setPanelAbierto(false);
    }

    return (
    <>
        <Navbar
            textos={textos}
            cargando={cargando}
            error={error}
            idioma={idioma}
            cambiarIdioma={cambiarIdioma}
            activo="inicio"
            abrirPanelAccesibilidad={abrirPanelAccesibilidad}
        />

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
    </>
    );
}

export default App;