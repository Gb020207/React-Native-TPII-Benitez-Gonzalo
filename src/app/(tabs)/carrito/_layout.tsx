import { Stack } from 'expo-router';

import { colores } from '../../../tema/colores';

/**
 * Stack propio de la pestaña Carrito.
 * El detalle de la nota vive acá adentro para que la barra de pestañas
 * siga visible.
 */
export default function LayoutCarrito() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.verde },
        headerTintColor: colores.blanco,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colores.verdeMuySuave },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Tu carrito' }} />
      <Stack.Screen name="nota" options={{ title: 'Nota para la cocina' }} />
    </Stack>
  );
}