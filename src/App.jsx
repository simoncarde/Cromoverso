import { useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import useTextos from "./hooks/useTextos.js";

function App() {
    const [idioma, setIdioma] = useState("es");
    const {
    textos,
    cargando,
    error,
    } = useTextos(idioma);

    function cambiarIdioma(nuevoIdioma) {
        setIdioma(nuevoIdioma);
    }

    return (
        <Navbar
            textos={textos}
            cargando={cargando}
            error={error}
            idioma={idioma}
            cambiarIdioma={cambiarIdioma}
            activo="inicio"
        />
    );
}

export default App;