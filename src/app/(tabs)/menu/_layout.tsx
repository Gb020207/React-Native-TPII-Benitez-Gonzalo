import { Stack } from 'expo-router';

import { colores } from '../../../tema/colores';

/**
 * Stack propio de la pestaña Menú.
 *
 * Al vivir dentro de una tab, el detalle de un plato se apila acá y la barra
 * de pestañas sigue visible (regla práctica: si debe mantener las tabs, va
 * dentro de la tab).
 */
export default function LayoutMenu() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.verde },
        headerTintColor: colores.blanco,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colores.verdeMuySuave },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Menú' }} />
      {/* El título del detalle se setea desde la propia pantalla para que
          muestre el nombre del plato. */}
      <Stack.Screen name="[id]" options={{ title: 'Detalle del plato' }} />
    </Stack>
  );
}