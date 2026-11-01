
import "./BannerCookies.css";

function BannerCookies({ textos, onAceptar, onRechazar }) {
    if (!textos) return null;

    return (
        <aside
            className="banner-cookies"
            aria-label={textos.titulo}
        >
            <div className="banner-cookies__contenido">
                <h2 className="banner-cookies__titulo">
                    {textos.titulo}
                </h2>

                <p className="banner-cookies__texto">
                    {textos.texto}
                </p>
            </div>

            <div className="banner-cookies__acciones">
                <button
                    className="banner-cookies__boton banner-cookies__boton--rechazar"
                    type="button"
                    onClick={onRechazar}
                >
                    {textos.botones.rechazar}
                </button>

                <button
                    className="banner-cookies__boton banner-cookies__boton--aceptar"
                    type="button"
                    onClick={onAceptar}
                >
                    {textos.botones.aceptar}
                </button>
            </div>
        </aside>
    );
}

export default BannerCookies;
