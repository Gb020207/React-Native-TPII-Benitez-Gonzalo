# Línea Expo Router · presentación

Presentación en HTML, CSS y JavaScript (sin dependencias) para la clase de Expo Router del
Taller Complementario · React Native II — Instituto Politécnico Formosa.

## Cómo abrirla

Abrí `index.html` con doble clic en Chrome, Edge o Firefox. No necesita servidor.
Funciona sin internet: solo las tipografías vienen de Google Fonts y, si no cargan, se usan
fuentes del sistema.

## Controles

| Tecla                      | Acción                                   |
| -------------------------- | ---------------------------------------- |
| `→` `Espacio` `PageDown`   | Siguiente diapositiva                    |
| `←` `PageUp`               | Anterior                                 |
| `Inicio` / `Fin`           | Primera / última                         |
| `M`                        | Mapa completo (índice de diapositivas)   |
| `N`                        | Notas del docente                        |
| `T`                        | Tema claro / oscuro                      |
| `F`                        | Pantalla completa                        |
| `Esc`                      | Cierra el mapa y las notas               |

También se puede deslizar con el dedo, tocar las estaciones de la barra inferior o abrir una
diapositiva directa con `index.html#17`.

## Contenido (35 diapositivas, 7 líneas)

- **C · Contexto:** qué es navegar, qué es Expo Router, antes y después.
- **P · Pilas y colas:** LIFO y FIFO con demos animadas, código en JS y dónde aparecen en Expo Router (historial y `routingQueue`).
- **F · Fundamentos:** crear el proyecto, explorador archivo → URL, convenciones, layouts, `Link`, `router` y un simulador de Stack interactivo.
- **N · Navegadores:** Stack, Tabs (con demo de pilas por tab), Drawer y anidación.
- **D · Rutas dinámicas:** `[id]` con probador de rutas, `[...slug]`, query params y hooks.
- **A · Acceso y errores:** `Redirect`, `Stack.Protected` interactivo, 404, anchor, rutas tipadas y deep links.
- **T · Taller:** la app de ejemplo, errores comunes, actividad práctica, quiz y cierre.

## Archivos

```
index.html          Diapositivas y notas del docente (<aside class="notas">)
css/estilos.css     Diseño, temas claro/oscuro y animaciones
js/resaltador.js    Resaltado de sintaxis del código
js/demos.js         Demos interactivas (pila, cola, simulador, probador, quiz…)
js/presentacion.js  Navegación, mapa de progreso, notas y tema
```

Para editar el código de una diapositiva, buscá el `<script type="text/plain" data-codigo="tsx">`
correspondiente: se escribe tal cual, sin escapar `<` ni `>`.
