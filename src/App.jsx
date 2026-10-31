
import { useState } from "react";

import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Mundos from "./components/Mundos/Mundos.jsx";
import Footer from "./components/Footer/Footer.jsx";

import useTextos from "./hooks/useTextos.js";
import useCromos from "./hooks/useCromos.js";
import useMundos from "./hooks/useMundos.js";

function App() {
    const [idioma, setIdioma] = useState("es");

    // TEXTOS DEL SITIO.
    const {
        textos,
        cargando,
        error
    } = useTextos(idioma);

    // CROMOS DESTACADOS DEL HERO.
    const {
        cromos,
        cargandoCromos,
        errorCromos
    } = useCromos();

    // SEIS MUNDOS DESDE LA API.
    const {
        mundos,
        cargandoMundos,
        errorMundos
    } = useMundos();

    function cambiarIdioma(nuevoIdioma) {
        setIdioma(nuevoIdioma);
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
            />

            <main>
                {/* HERO */}
                <Hero
                    textos={textos}
                    cargando={cargando}
                    error={error}
                    cromos={cromos}
                    cargandoCromos={cargandoCromos}
                    errorCromos={errorCromos}
                />

                {/* SECCIÓN DE LOS SEIS MUNDOS */}
                <Mundos
                    mundos={mundos}
                    cargandoMundos={cargandoMundos}
                    errorMundos={errorMundos}
                    textos={textos}
                />
            </main>

            {/* FOOTER */}
            <Footer textos={textos} />
        </>
    );
}

export default App;
