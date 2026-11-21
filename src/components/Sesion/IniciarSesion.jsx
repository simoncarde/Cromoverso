import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconoUI } from "../Iconos.jsx";
import TarjetaCromo from "../Mundos/DetalleMundo/TarjetaCromo.jsx";
import useCromos from "../../hooks/useCromos.js";
import { crearSesion } from "../../services/sesion.js";
import { formatearTexto } from "../../utils/textos.js";
import "./IniciarSesion.css";
import "../Mundos/DetalleMundo/DetalleMundo.css";

const CROMOS_DESTACADOS_DEFECTO = [
    {
        id: "CV-041",
        numero: 41,
        nombre: "Raíz Madre",
        mundo: "bosque",
        rareza: "comun",
        tipo: "heroe"
    },
    {
        id: "CV-001",
        numero: 1,
        nombre: "Voltia",
        mundo: "neon",
        rareza: "legendaria",
        tipo: "heroe"
    },
    {
        id: "CV-101",
        numero: 101,
        nombre: "Reina Niebla",
        mundo: "niebla",
        rareza: "legendaria",
        tipo: "heroe"
    }
];

const MUNDOS_DEFECTO = [
    { id: "neon", nombre: "Ciudad Neón" },
    { id: "bosque", nombre: "Bosque Eterno" },
    { id: "niebla", nombre: "Reino de Niebla" },
    { id: "coral", nombre: "Abismo Coral" },
    { id: "forja", nombre: "Forja Volcánica" },
    { id: "orbita", nombre: "Estación Órbita" }
];

function primerTexto(...valores) {
    return valores.find((valor) => typeof valor === "string" && valor.trim()) || "";
}

function IniciarSesion({ textos, mundos = [], onAutenticado }) {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");
    const [recordar, setRecordar] = useState(false);
    const [mostrarClave, setMostrarClave] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [mensajeTitulo, setMensajeTitulo] = useState("");
    const [exito, setExito] = useState(false);
    const [validacion, setValidacion] = useState(false);
    const [errorConexion, setErrorConexion] = useState(false);
    const { cromos } = useCromos();

    const pagina = textos?.paginas?.ingresar || textos?.paginas?.iniciarSesion || textos?.paginas?.login;
    const listaMundos = Array.isArray(mundos) && mundos.length > 0 ? mundos : MUNDOS_DEFECTO;
    const destacados = Array.isArray(cromos) && cromos.length >= 3 ? cromos.slice(0, 3) : CROMOS_DESTACADOS_DEFECTO;

    const formulario = pagina?.formulario || {};
    const presentacion = pagina?.presentacion || {};
    const erroresTexto = pagina?.errores || {};
    const correoLabel = formulario.etiquetas?.correo || "Correo electrónico";
    const claveLabel = formulario.etiquetas?.clave || "Contraseña";
    const botonTexto = formulario.botones?.ingresar || "Ingresar";

    const tituloLineas = presentacion.titulo
        ? primerTexto(presentacion.titulo).split(/(?<=\.)\s+/)
        : ["Seis mundos.", "120 héroes.", "Un álbum tuyo."];

    async function enviar(evento) {
        evento.preventDefault();
        const faltanCampos = !correo.trim() || !clave;
        setValidacion(faltanCampos);
        if (faltanCampos) {
            setExito(false);
            setMensaje("");
            setMensajeTitulo("");
            return;
        }
        setCargando(true);
        setErrorConexion(false);
        setMensaje("");
        setMensajeTitulo("");
        setExito(false);
        try {
            const respuesta = await crearSesion(correo, clave);
            const sesion = respuesta?.datos ?? respuesta;
            if (sesion.token) {
                window.localStorage.removeItem("cromoverso-sesion");
                window.sessionStorage.removeItem("cromoverso-sesion");
                const almacenamiento = recordar ? window.localStorage : window.sessionStorage;
                almacenamiento.setItem("cromoverso-sesion", JSON.stringify({ token: sesion.token, usuario: sesion.usuario }));
                onAutenticado?.(sesion);
            }
            setExito(true);
            setMensaje(primerTexto(pagina?.formulario?.mensajes?.exito, "Inicio de sesión exitoso"));
            if (sesion.token) navigate("/");
        } catch (error) {
            const esErrorConexion = error.status == null;
            setErrorConexion(esErrorConexion);
            const camposError = error.datos?.campos;
            const detalleCampo = camposError && Object.values(camposError).flat().find((valor) => typeof valor === "string");
            
            setMensajeTitulo(
                error.status === 401
                    ? (erroresTexto.credenciales?.titulo || "Correo o contraseña incorrectos")
                    : error.status === 429
                        ? (erroresTexto.demasiadosIntentos?.titulo || "Demasiados intentos")
                        : esErrorConexion
                            ? (erroresTexto.conexion?.titulo || "No pudimos conectarnos")
                            : ""
            );

            const respuesta429 = error.status === 429
                ? formatearTexto(erroresTexto.demasiadosIntentos?.texto || "Espera {segundos} segundos antes de volver a intentar.", { segundos: error.retryAfter || "" })
                : "";

            setMensaje(primerTexto(
                detalleCampo,
                error.status === 401 && (erroresTexto.credenciales?.texto || "Revisa los datos e inténtalo de nuevo. Si no recuerdas tu contraseña, puedes restablecerla."),
                error.status === 422 && textos?.errores?.validacion,
                error.status === 429 && respuesta429,
                esErrorConexion && (erroresTexto.conexion?.texto || "Revisa tu conexión a internet e inténtalo de nuevo. Lo que escribiste se conserva."),
                error.status != null && error.status !== 401 && error.status !== 422 && error.status !== 429 && (textos?.errores?.generico || "Ocurrió un error inesperado.")
            ));
        } finally {
            setCargando(false);
        }
    }

    return (
        <main className="sesion-pagina" id="contenido-principal">
            <aside className="sesion-lateral" aria-label={pagina?.panel?.aria || "Panel informativo"}>
                <div className="sesion-fondo" aria-hidden="true" />
                <Link className="sesion-marca sesion-marca-lateral" to="/" aria-label={textos?.navbar?.logo?.aria || "Cromoverso"}>
                    <span className="sesion-marca-icono-circulo" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD23F">
                            <path d="M12 2.8L14.8 8.6L21.2 9.5L16.6 14L17.7 20.3L12 17.3L6.3 20.3L7.4 14L2.8 9.5L9.2 8.6L12 2.8Z"/>
                        </svg>
                    </span>
                    <span>{textos?.navbar?.logo?.texto || "cromoverso"}</span>
                </Link>

                <div className="sesion-cromos" aria-label={presentacion?.cromosAria || "Cromos destacados"}>
                    {destacados.map((cromo, indice) => {
                        const mundo = listaMundos.find((item) => item.id === cromo.mundo) || listaMundos[0];
                        return (
                            <div className={`sesion-cromo sesion-cromo-${indice + 1}`} key={cromo.id}>
                                <TarjetaCromo
                                    cromo={cromo}
                                    mundo={mundo}
                                    textos={textos}
                                    onSeleccionar={() => {}}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="sesion-promocion">
                    <span className="sesion-etiqueta">
                        {presentacion.etiquetas?.temporada || "Temporada 1 • Seis mundos"}
                    </span>
                    <h2>
                        {tituloLineas.map((linea, indice) => (
                            <span key={`${indice}-${linea}`}>{linea}</span>
                        ))}
                    </h2>
                    <p>
                        {primerTexto(presentacion.texto, "Explora seis mundos y conoce a sus 120 héroes originales.")}
                    </p>
                </div>
            </aside>

            <section className="sesion-contenido">
                <div className="sesion-formulario-contenedor">
                    <Link className="sesion-marca sesion-marca-formulario" to="/" aria-label={textos?.navbar?.logo?.aria || "Cromoverso"}>
                        <span className="sesion-marca-icono-circulo" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD23F">
                                <path d="M12 2.8L14.8 8.6L21.2 9.5L16.6 14L17.7 20.3L12 17.3L6.3 20.3L7.4 14L2.8 9.5L9.2 8.6L12 2.8Z"/>
                            </svg>
                        </span>
                        <span>{textos?.navbar?.logo?.texto || "cromoverso"}</span>
                    </Link>

                    <h1>{formulario.titulo || "Ingresa a tu cuenta"}</h1>
                    <p className="sesion-descripcion">
                        {formulario.subtitulo || "Ingresa con el correo y la contraseña de tu cuenta."}
                    </p>

                    {validacion && (
                        <div className="sesion-aviso-error" role="alert">
                            <span className="sesion-aviso-icono" aria-hidden="true">
                                <IconoUI nombre="alertaCirculo" size={18} />
                            </span>
                            <div className="sesion-aviso-cuerpo">
                                <strong>{erroresTexto.camposObligatorios?.titulo || "Revisa los campos marcados"}</strong>
                                <span>{erroresTexto.camposObligatorios?.texto || "Para ingresar escribe tu correo y tu contraseña."}</span>
                            </div>
                        </div>
                    )}

                    {mensaje && (
                        <div className={`sesion-aviso-error${exito ? " exito" : ""}`} role={exito ? "status" : "alert"}>
                            <span className="sesion-aviso-icono" aria-hidden="true">
                                <IconoUI nombre={exito ? "check" : "alertaCirculo"} size={18} />
                            </span>
                            <div className="sesion-aviso-cuerpo">
                                {mensajeTitulo && <strong>{mensajeTitulo}</strong>}
                                <span>{mensaje}</span>
                            </div>
                        </div>
                    )}

                    <form className="sesion-formulario" onSubmit={enviar} noValidate>
                        <div className="sesion-campo-grupo">
                            <label htmlFor="sesion-correo">{correoLabel}</label>
                            <input
                                className={validacion && !correo.trim() ? "campo-invalido" : ""}
                                id="sesion-correo"
                                name="correo"
                                type="email"
                                autoComplete="email"
                                value={correo}
                                placeholder={formulario.placeholders?.correo || "nombre@correo.com"}
                                onChange={(evento) => {
                                    setCorreo(evento.target.value);
                                    if (validacion && evento.target.value.trim() && clave) {
                                        setValidacion(false);
                                    }
                                }}
                            />
                            {validacion && !correo.trim() && (
                                <span className="sesion-campo-error">
                                    <IconoUI nombre="alertaTriangulo" size={12} />
                                    <span>{erroresTexto.correoObligatorio || "Escribe tu correo electrónico."}</span>
                                </span>
                            )}
                        </div>

                        <div className="sesion-campo-grupo">
                            <label htmlFor="sesion-clave">{claveLabel}</label>
                            <div className="sesion-clave-wrap">
                                <input
                                    className={validacion && !clave ? "campo-invalido" : ""}
                                    id="sesion-clave"
                                    name="clave"
                                    type={mostrarClave ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={clave}
                                    placeholder={formulario.placeholders?.clave || "••••••••••"}
                                    onChange={(evento) => {
                                        setClave(evento.target.value);
                                        if (validacion && correo.trim() && evento.target.value) {
                                            setValidacion(false);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="sesion-clave-toggle"
                                    onClick={() => setMostrarClave((valor) => !valor)}
                                    aria-label={mostrarClave ? (formulario.botones?.ocultarClave || "Ocultar contraseña") : (formulario.botones?.mostrarClave || "Mostrar contraseña")}
                                >
                                    <IconoUI nombre={mostrarClave ? "ojoTachado" : "ojo"} size={20} />
                                </button>
                            </div>
                            {validacion && !clave && (
                                <span className="sesion-campo-error">
                                    <IconoUI nombre="alertaTriangulo" size={12} />
                                    <span>{erroresTexto.claveObligatoria || "Escribe tu contraseña."}</span>
                                </span>
                            )}
                        </div>

                        <div className="sesion-opciones">
                            <label className="sesion-recordar">
                                <input
                                    type="checkbox"
                                    className="sesion-checkbox-nativo"
                                    checked={recordar}
                                    onChange={(evento) => setRecordar(evento.target.checked)}
                                />
                                <span className="sesion-checkbox-visual" aria-hidden="true">
                                    {recordar && <IconoUI nombre="check" size={12} />}
                                </span>
                                <span>{formulario.etiquetas?.mantenerSesion || "Mantener la sesión iniciada"}</span>
                            </label>
                            <Link to="/recuperar-clave" className="sesion-olvido-enlace">
                                {formulario.enlaces?.olvidasteClave || "¿Olvidaste tu contraseña?"}
                            </Link>
                        </div>

                        <button className="sesion-enviar" type="submit" disabled={cargando}>
                            {cargando ? (
                                <>
                                    <IconoUI nombre="spinner" size={18} className="sesion-spinner-anim" />
                                    <span>{formulario.mensajes?.ingresando || "Ingresando..."}</span>
                                </>
                            ) : errorConexion ? (
                                erroresTexto.conexion?.botones?.reintentar || "Reintentar"
                            ) : (
                                botonTexto
                            )}
                        </button>
                    </form>

                    <p className="sesion-registro">
                        <span>{formulario.mensajes?.sinCuenta || "¿No tienes cuenta?"}</span>{" "}
                        <Link to="/registro" className="sesion-registro-enlace">
                            {formulario.enlaces?.crearCuenta || "Crea una cuenta"}
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}

export default IniciarSesion;
