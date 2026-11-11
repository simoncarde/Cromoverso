
import Icono from "../Iconos.jsx";
import "./Footer.css";

const DESTINOS_FOOTER = {
    inicio: "#inicio",
    mundos: "#mundos",
    ingresar: "/login",
    crearCuenta: "/registro",
    terminos: "/terminos",
    accesibilidad: "/accesibilidad",
};

function Footer({ textos, idioma = "es" }) {
    const footer = textos?.footer;
    const nombreSitio = textos?.sitio?.nombre ?? "cromoverso";
    const es = idioma === "es";

    if (!footer) {
        return null;
    }

    const columnas = [
        {
            id: "explora",
            datos: footer.columnas?.explora,
        },
        {
            id: "cuenta",
            datos: footer.columnas?.cuenta,
        },
        {
            id: "legal",
            datos: footer.columnas?.legal,
        },
    ];

    const derechos = footer.legal?.derechos?.replace(
        "{anio}",
        String(new Date().getFullYear())
    );

    return (
        <footer className="footer-cromoverso" id="footer">
            <div className="footer-interior">
                <div className="footer-superior">
                    <div className="footer-marca">
                        <a href="#inicio" className="footer-logo">
                            <span className="footer-logo-icono">
                                <Icono nombre="estrella" />
                            </span>

                            <span>{nombreSitio.toLowerCase()}</span>
                        </a>

                        <p>{footer.lema}</p>
                    </div>

                    <nav
                        className="footer-navegacion"
                        aria-label={textos?.footer?.aria?.navegacion || (es ? "Navegación del pie de página" : "Footer navigation")}
                    >
                        {columnas.map(({ id, datos }) => {
                            if (!datos) return null;

                            return (
                                <div
                                    className="footer-columna"
                                    key={id}
                                >
                                    <h3>{datos.titulo}</h3>

                                    {Object.entries(
                                        datos.enlaces ?? {}
                                    ).map(([clave, etiqueta]) => (
                                        <a
                                            key={clave}
                                            href={
                                                DESTINOS_FOOTER[clave] ?? "#"
                                            }
                                        >
                                            {etiqueta}
                                        </a>
                                    ))}
                                </div>
                            );
                        })}
                    </nav>
                </div>

                <div className="footer-inferior">
                    <p>{derechos}</p>

                    {footer.legal?.nota && (
                        <p className="footer-nota">
                            {footer.legal.nota}
                        </p>
                    )}
                </div>
            </div>
        </footer>
    );
}

export default Footer;