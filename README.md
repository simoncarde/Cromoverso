# Cromoverso

Cromoverso es una aplicación web de colección de cromos construida con React y Vite. Permite explorar mundos, consultar álbumes, filtrar cromos y personalizar la presentación para adaptarla a distintas necesidades de acceso.

## Requisitos

- Node.js compatible con Vite 8.
- npm.
- Acceso a la API de Cromoverso para cargar textos, mundos y cromos.

## Desarrollo

Instala las dependencias con `npm install` y ejecuta `npm run dev`. Vite inicia el servidor local y actualiza la página al guardar cambios.

`npm run build` genera la versión de producción en `dist`. `npm run test` todavía no ejecuta pruebas: el script actual es un marcador.

## Estructura

- `src/App.jsx` configura las rutas, comparte el estado de idioma y preferencias, y compone la navegación, el contenido y el pie de página.
- `src/components` contiene los componentes visuales por área: navegación, portada, mundos, álbum, cookies, pie de página y controles de accesibilidad.
- `src/hooks` encapsula la consulta y el estado de los datos remotos y las preferencias persistentes.
- `src/services/api.js` centraliza la dirección base y los endpoints que consumen los hooks.
- `src/styles/tokens.css` define la paleta, tipografía, espaciado y radios reutilizables.
- `src/styles/global.css` establece reglas globales, foco, enlace de salto y modos de presentación.
- `src/utils/textos.js` sustituye variables dentro de plantillas de texto.
- `public/assets` contiene los recursos estáticos servidos sin transformación.

## Datos remotos

La aplicación consulta `https://yanethm-cromoverso-api.fly.dev/api/v1` para obtener textos traducidos, mundos y cromos destacados. Los hooks mantienen los resultados en memoria durante la sesión y comparten solicitudes concurrentes cuando varios componentes necesitan los mismos datos. El idioma inicial es español; el selector también permite inglés.

La portada depende de los textos y los recursos remotos para mostrar el contenido definitivo. La conexión previa declarada en `index.html` reduce el coste de establecer la primera conexión con la API. El navegador, la latencia de red y la disponibilidad de la API determinan el tiempo real de carga; por ello no se garantiza un intervalo fijo de 2–10 ms.

Las fuentes usan pilas locales del sistema para evitar solicitudes de terceros antes de mostrar el contenido. Esto reduce dependencias de red y conserva una alternativa legible, aunque cambia la apariencia tipográfica respecto de las fuentes de marca originales.

## Accesibilidad

La interfaz incluye navegación semántica, un enlace de salto al contenido, indicadores de foco visibles, controles nativos con nombres accesibles y estados expuestos mediante atributos ARIA. El panel de accesibilidad abre como diálogo modal, recibe el foco, mantiene la navegación por teclado dentro del diálogo, se cierra con Escape o al activar el fondo y devuelve el foco al control que lo abrió.

Las preferencias se guardan bajo la clave `cromoverso-accesibilidad` en `localStorage` y se reflejan como atributos `data-*` en el elemento raíz. Incluyen ampliación de la página, paleta de alto contraste, reducción del movimiento, subrayado de enlaces y una fuente de lectura sencilla. El restablecimiento devuelve los valores iniciales.

La aplicación no declara conformidad certificada con WCAG. Se requiere una revisión manual con teclado, lector de pantalla y herramientas de contraste para evaluar el sitio completo, incluidas las respuestas y recursos remotos.

## Rutas

- `/` muestra la portada y el catálogo de mundos.
- `/mundos` redirige al primer mundo.
- `/mundos/:id` muestra el álbum y sus filtros.
- Las rutas desconocidas regresan a la portada.

## Configuración y calidad

Vite y el complemento de React se configuran en `vite.config.js`. Las dependencias y comandos disponibles están declarados en `package.json`. Antes de publicar, genera la compilación con `npm run build` y revisa el resultado en distintos tamaños de pantalla y con tecnologías de asistencia.
