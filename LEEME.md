# LEEME

Estos son algunos prompts pedidos a ChatGPT para la realización de Cromoverso:

### 1. “¿Cómo hago para que al tocar una tarjeta me lleve a la página de ese mundo?”

**Lo que me recomendaron:** usar una ruta dinámica con React Router, por ejemplo `/mundos/:id`, y navegar pasando el identificador del mundo.

**Qué usé:** la idea de tener una ruta por mundo y reutilizar el mismo componente de detalle.

**Qué no:** copiar el ejemplo tal cual; los nombres y datos tenían que coincidir con los del proyecto.

### 2. “Tengo un componente lleno de cosas. ¿Cómo lo separo sin romper la página?”

**Lo que me recomendaron:** mover las partes que se repiten o tienen su propia función a componentes separados y pasarles la información por props.

**Qué usé:** separar la interfaz en componentes más pequeños.

**Qué no:** dividir cada pedacito por dividir; algunos elementos funcionan mejor juntos.

### 3. “¿Por qué no me carga la lista que viene de la API?”

**Lo que me recomendaron:** revisar la URL, la respuesta de `fetch`, el estado de carga y el manejo de errores; también comprobar la petición en Network.

**Qué usé:** mirar la pestaña Network y verificar qué respuesta devolvía el servidor.

**Qué no:** asumir que el problema era React antes de comprobar la respuesta.

### 4. “¿Cómo hago que el menú cambie de idioma?”

**Lo que me recomendaron:** guardar el idioma seleccionado en estado y usarlo para elegir los textos que se muestran.

**Qué usé:** mantener el idioma en un estado compartido y pasar los textos a los componentes.

**Qué no:** duplicar toda la página para cada idioma.

### 5. “¿Qué reviso si un componente no aparece aunque no veo errores?”

**Lo que me recomendaron:** comprobar si la ruta lo está mostrando, si alguna condición evita el renderizado y si el elemento aparece en el DOM; si aparece, mirar sus estilos en DevTools.

**Qué usé:** revisar primero el DOM y las condiciones del JSX.

**Qué no:** cambiar estilos a ciegas sin confirmar si el elemento se estaba renderizando.
