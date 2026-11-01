
import { useState } from "react";
import BannerCookies from "./BannerCookies";

const NOMBRE_COOKIE = "consentimiento";
const DURACION_COOKIE = 60 * 60 * 24 * 365;

function leerConsentimiento() {
    return document.cookie
        .split("; ")
        .some((cookie) => cookie.startsWith(`${NOMBRE_COOKIE}=`));
}

function guardarConsentimiento(decision) {
    const seguro =
        window.location.protocol === "https:" ? "; Secure" : "";

    document.cookie =
        `${NOMBRE_COOKIE}=${decision}; Path=/; Max-Age=${DURACION_COOKIE}; SameSite=Lax${seguro}`;
}

function Cookies({ textos }) {
    const [consentimiento, setConsentimiento] = useState(
        () => leerConsentimiento()
    );

    function aceptarCookies() {
        guardarConsentimiento("aceptadas");
        setConsentimiento(true);
    }

    function rechazarCookies() {
        guardarConsentimiento("rechazadas");
        setConsentimiento(true);
    }

    if (consentimiento || !textos?.banner) {
        return null;
    }

    return (
        <BannerCookies
            textos={textos.banner}
            onAceptar={aceptarCookies}
            onRechazar={rechazarCookies}
        />
    );
}

export default Cookies;