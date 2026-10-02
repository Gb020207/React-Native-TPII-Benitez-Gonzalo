import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { ProveedorComedor, useComedor } from '../contexto/ComedorContext';
import { colores } from '../tema/colores';

/**
 * Qué pantalla queda debajo cuando alguien entra directo a una ruta con un
 * deep link. Con "(tabs)" como anchor, un deep link a /categorias/bebidas
 * deja las pestañas cargadas abajo en la pila en vez de una pantalla pelada.
 */
export const unstable_settings = {
  anchor: '(tabs)',
};

/** Colores por defecto de todas las pantallas del Stack raíz. */
const opcionesComunes = {
  headerStyle: { backgroundColor: colores.verde },
  headerTintColor: colores.blanco,
  headerTitleStyle: { fontWeight: '700' as const },
  headerBackButtonDisplayMode: 'minimal' as const,
  contentStyle: { backgroundColor: colores.verdeMuySuave },
};

/**
 * Navegación Raiz.
 *
 * Va en un componente aparte porque necesita leer el estado de sesión del
 * Context, y el Context lo provee el layout raíz: si esta función viviera
 * directamente en el layout, el useComedor() se ejecutaría antes de que
 * exista el provider.
 */
function NavegacionRaiz() {
  const { conSesion } = useComedor();

  return (
    <Stack screenOptions={opcionesComunes}>
      {/* Las pestañas van acá, con el header apagado porque cada tab
          maneja el suyo y si no se verían dos headers juntos. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Modal de confirmación de pedido */}
      <Stack.Screen
        name="confirmar"
        options={{ presentation: 'modal', title: 'Confirmar pedido' }}
      />

      {/* Login: solo existe SIN sesión. Al iniciar sesión el guard deja de
          cumplirse, el navegador saca la ruta del historial y el modal se
          cierra solo, sin llamar a router.back(). */}
      <Stack.Protected guard={!conSesion}>
        <Stack.Screen
          name="login"
          options={{ presentation: 'modal', title: 'Ingreso a Cocina' }}
        />
      </Stack.Protected>

      {/* Cocina: solo existe CON sesión. Al cerrar sesión desaparece del
          historial, por eso tampoco hace falta llamar a router.back(). */}
      <Stack.Protected guard={conSesion}>
        <Stack.Screen name="cocina" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function LayoutRaiz() {
  return (
    // GestureHandlerRootView tiene que envolver toda la app para que los
    // gestos del Drawer funcionen.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProveedorComedor>
        <StatusBar style="light" />
        <NavegacionRaiz />
      </ProveedorComedor>
    </GestureHandlerRootView>
  );
}