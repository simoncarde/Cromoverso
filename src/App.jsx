import { useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import useTextos from "./hooks/useTextos.js";
import useCromos from "./hooks/useCromos.js";
import Hero from "./components/Hero/Hero.jsx";

function App() {
    const [idioma, setIdioma] = useState("es");

    const {
        textos,
        cargando,
        error
    } = useTextos(idioma);

    const {
        cromos,
        cargandoCromos,
        errorCromos
    } = useCromos();

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
                <Hero
                    textos={textos}
                    cargando={cargando}
                    error={error}
                    cromos={cromos}
                    cargandoCromos={cargandoCromos}
                    errorCromos={errorCromos}
                />
            </main>
        </>
    );
}

export default App;