import { Redirect } from 'expo-router';

/**
 * URL vieja de la versión anterior. URL: /pedido
 *
 * <Redirect> equivale a router.replace(): al renderizarse manda a /carrito y
 * reemplaza la ruta actual. Si fuera push, /pedido quedaría en la pila y al
 * tocar "atrás" el usuario volvería a /pedido, que lo redirigiría otra vez
 * a /carrito: un bucle.
 */
export default function PedidoViejo() {
  return <Redirect href="/carrito" />;
}