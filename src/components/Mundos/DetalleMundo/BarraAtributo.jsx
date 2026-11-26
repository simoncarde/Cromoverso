function BarraAtributo({ nombre, valor, idioma = "es", destacada = false }) {
    const porcentaje = Math.min(Math.max(valor, 0), 100);

    return (
        <div className={`modal-cromo-atributo${destacada ? " destacada" : ""}`}>
            <span>
                {nombre.charAt(0).toLocaleUpperCase(idioma)}
                {nombre.slice(1)}
            </span>
            <div className="modal-cromo-barra">
                <div
                    className="modal-cromo-barra-progreso"
                    style={{ width: `${porcentaje}%` }}
                />
            </div>
            <strong>{valor}</strong>
        </div>
    );
}

export default BarraAtributo;
