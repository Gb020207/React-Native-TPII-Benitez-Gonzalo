# Comedor IPF — TP2 Expo Router + React Native

App de pedidos para el comedor, armada con **Expo SDK 57**, **Expo Router** y
**TypeScript**. Tema verde y blanco.

## Requisitos

- Node.js 20 o superior.
- npm.
- Para probar en el teléfono: la app **Expo Go**.
- Para web: `npx expo install react-dom react-native-web` (ya está en el proyecto).

## Cómo ejecutar

```bash
npm install
npm start
```

Después:

- Presioná `w` para abrir en web.
- Presioná `a` para Android, `i` para iOS.
- Escaneá el QR con Expo Go para el teléfono.

Otros comandos:

```bash
npx expo start --clear   # reinicia la caché de Metro
npm run typecheck        # revisa los tipos
npx expo export --platform web
```

## Deep links

El `scheme` de la app es `comedoripf`, así que cualquiera de estas rutas se
puede abrir directo:

```bash
npx uri-scheme open "comedoripf://menu" --android
npx uri-scheme open "comedoripf://cocina" --android
```

En web se usa el path normal: `http://localhost:8081/ayuda/pagos/efectivo`.

## Árbol de `src/app`

```
src/app/
├── _layout.tsx            Stack raíz + Stack.Protected (sesión)
├── +not-found.tsx         404 global
├── (tabs)/                Tabs (expo-router/js-tabs)
│   ├── _layout.tsx
│   ├── index.tsx          /
│   ├── menu/
│   │   ├── _layout.tsx
│   │   ├── index.tsx      /menu
│   │   └── [id].tsx       /menu/[id]
│   ├── carrito/
│   │   ├── _layout.tsx
│   │   ├── index.tsx      /carrito
│   │   └── nota.tsx       /carrito/nota
│   └── perfil.tsx         /perfil
├── confirmar.tsx          /confirmar       (modal)
├── login.tsx              /login           (modal, protegido)
├── cocina/                Drawer (expo-router/drawer)
│   ├── _layout.tsx
│   ├── index.tsx          /cocina
│   └── atendidos.tsx      /cocina/atendidos
├── buscar.tsx             /buscar
├── pedido.tsx             /pedido          (redirección)
├── turno/
│   └── [numero].tsx       /turno/[numero]
├── categorias/
│   └── [categoria].tsx    /categorias/[categoria]
└── ayuda/
    ├── index.tsx          /ayuda
    └── [...slug].tsx      /ayuda/[...slug]
```

## Qué navegador usa cada `_layout`

| Archivo | Navegador | Para qué sirve |
| --- | --- | |
| `src/app/_layout.tsx` | `Stack` | Pila raíz. Define headers verdes, el modal de confirmación y los `Stack.Protected` de `/login` y `/cocina`. |
| `src/app/(tabs)/_layout.tsx` | `Tabs` (desde `expo-router/js-tabs`) | Barra inferior con Inicio, Menú, Carrito y Perfil. Muestra el badge con la cantidad de ítems del carrito. |
| `src/app/(tabs)/menu/_layout.tsx` | `Stack` | Pila propia del Menú, así el detalle `/menu/[id]` se apila sobre la lista. |
| `src/app/(tabs)/carrito/_layout.tsx` | `Stack` | Pila propia del Carrito, para poder ir a la nota y volver. |
| `src/app/cocina/_layout.tsx` | `Drawer` (desde `expo-router/drawer`) | Menú lateral con "Pedidos en curso" y "Atendidos". |

## `replace` vs `push`

Se usa `push` cuando el usuario quiere poder volver con el botón atrás, y
`replace` cuando la pantalla anterior ya no tiene sentido.

| Desde | Hacia | Método | Por qué |
| --- | --- | --- | --- |
| `/menu` | `/menu/[id]` | `<Link>` (equivale a `push`) | El detalle es una capa sobre la lista: se vuelve con el botón atrás. |
| `/menu/[id]` | `/carrito` | `push` | El carrito es una capa más de la navegación normal. |
| `/carrito` | `/menu` | `push` | Se quiere volver al listado, no a la confirmación. |
| `/carrito` | `/confirmar` | `push` | El modal se cierra con "Cancelar" y vuelve al carrito. |
| `/confirmar` | `/turno/[numero]` | `replace` | El pedido ya está confirmado: **no** se debe volver al carrito, porque el carrito se vació. |
| `/turno/[numero]` | `/` | `replace` | "Volver al inicio" limpia la pila para que el botón atrás no regrese al turno. |
| `/carrito` | `/carrito/nota` | `<Link>` (equivale a `push`) | Se edita la nota y se vuelve al carrito con atrás. |
| Login | `/cocina` | `replace` (en un `useEffect`) | El guard de `/login` ya lo sacó del historial; se reemplaza para no dejar rastro. |
| `/pedido` | `/carrito` | `<Redirect>` | Es una redirección pura: `<Redirect>` equivale a `replace`, y evita un bucle. |
| 404 | `/` | `replace` | Tampoco tiene sentido volver atrás desde un error. |

## Sesión con `Stack.Protected`

En `src/app/_layout.tsx`:

```tsx
<Stack.Protected guard={!conSesion}>
  <Stack.Screen name="login" options={{ presentation: 'modal' }} />
</Stack.Protected>

<Stack.Protected guard={conSesion}>
  <Stack.Screen name="cocina" options={{ headerShown: false }} />
</Stack.Protected>
```

- **Sin sesión:** `/cocina` no existe en el navegador, así que no se puede
  llegar ni con deep link. `/login` sí existe.
- **Con sesión:** `/login` desaparece del historial y el modal se cierra solo.
  Por eso el login navega con `replace` en un `useEffect` y no en el `onPress`:
  si navegara en el mismo click, el guard todavía estaría en `false`.

El estado de sesión vive en `src/contexto/ComedorContext.tsx`. Credenciales
de prueba: usuario `cocina`, clave `ipf2026`.

## Deep link con anchor

`src/app/_layout.tsx` exporta:

```tsx
export const unstable_settings = { anchor: '(tabs)' };
```

Sirve para que al abrir un deep link directo a una ruta suelta, como
`/categorias/bebidas`, las pestañas queden cargadas abajo en la pila y no se
muestre una pantalla pelada sin historial.

## Estructuras de datos

En `src/estructuras/`:

- `Pila.ts` (LIFO): `#items` privado, `push`, `pop`, `tope()`, `get vacia`,
  `get tamanio`, `aArray()`, `vaciar()`.
- `Cola.ts` (FIFO): `#items` privado, `encolar`, `desencolar`, `frente()`,
  `get vacia`, `get tamanio`, `aArray()`, `vaciar()`. Usa un índice `#frente`
  para grow, **nunca `shift()`**, así que encolar y desencolar son O(1)
  amortizado. Cuando el frente ya consumió más de la mitad del array, `#compactar()`
  recorta el array para no quedar con memoria tirada.

Dónde se usan:

| Dónde | Estructura | Para qué |
| --- | --- | --- |
| Carrito | `Pila<ItemCarrito>` | El carrito **es** la pila: `apilar` al agregar, `desapilar` en "Deshacer último". |
| Confirmación | `Cola<Pedido>` | Pedidos en espera. La cocina desencola el primero (FIFO). |
| `/cocina/atendidos` | `Pila<Pedido>` | Historial: el último atendido aparece primero. |

## Ayuda con `[...slug]`

`src/app/ayuda/[...slug].tsx` captura **uno o más** segmentos, así que el mismo
archivo sirve para `/ayuda/horarios` y para `/ayuda/pagos/efectivo`. Por eso
`/ayuda` necesita su propio `index.tsx`: el catch-all exige al menos un
segmento.

Los artículos viven en `src/datos/articulos_ayuda.ts`.

## Desafíos opcionales

- Contador de pantallas apiladas con `navigation.getState()?.routes.length` en
  `/menu/[id]`.
- Tiempo de espera estimado en `/turno/[numero]`, calculado con
  `pedidosAdelante(numero) * MINUTOS_POR_PEDIDO`.

## Componente `DondeEstoy`

`src/componentes/DondeEstoy.tsx` se incluye al final de cada pantalla y muestra
los tres hooks de ubicación de Expo Router por separado:

```tsx
const pathname = usePathname();
const segmentos = useSegments();
const params = useLocalSearchParams();
```

- `pathname`: la ruta ya resuelta, sin los grupos. Ej: `/menu/4`.
- `segments`: los segmentos de la URL **con** los grupos. Ej: `["(tabs)", "menu", "4"]`.
- `params`: los parámetros de ruta y de búsqueda.

Mostrar los tres juntos sirve para entender de dónde viene cada dato, y sobre
todo para diferenciar una ruta del Stack raíz de una que vive dentro de una tab
o de un Drawer: `/menu/4` y `/(tabs)/menu/4` son pantallas distintas para
Expo Router pero se ven iguales en `pathname`.

Para apagarlo, poner `DEBUG = false` en el propio archivo: el componente deja
de dibujarse pero sigue presente en cada pantalla.

## Estructura del proyecto

```
src/
├── app/            rutas de Expo Router
├── componentes/    Boton, DondeEstoy, ItemCarrito, TarjetaPlato, Tarjetas
├── contexto/       ComedorContext (sesión, carrito, cola, atendidos)
├── datos/          platos.ts, articulos_ayuda.ts
├── estructuras/    Pila.ts, Cola.ts
└── tema/           colores.ts
```