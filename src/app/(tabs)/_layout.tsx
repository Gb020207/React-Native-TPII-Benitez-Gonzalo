import { Tabs } from 'expo-router/js-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colores } from '../../tema/colores';
import { useComedor } from '../../contexto/ComedorContext';

/**
 * Layout de las pestañas.
 *
 * En SDK 57 las Tabs se importan desde 'expo-router/js-tabs': importarlas
 * desde 'expo-router' está deprecado.
 *
 * El grupo "(tabs)" no aparece en la URL, así que la pestaña Menú sigue
 * siendo /menu y la de Carrito /carrito.
 */
export default function LayoutTabs() {
  const { cantidadTotal } = useComedor();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.verde,
        tabBarInactiveTintColor: colores.textoSuave,
        tabBarStyle: {
          backgroundColor: colores.blanco,
          borderTopColor: colores.borde,
        },
        headerStyle: { backgroundColor: colores.verde },
        headerTintColor: colores.blanco,
        headerTitleStyle: { fontWeight: '700' },
        sceneStyle: { backgroundColor: colores.verdeMuySuave },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* El header de la tab Menú se apaga porque la subcarpeta menu/ tiene
          su propio Stack, con su propio header. */}
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menú',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="carrito"
        options={{
          title: 'Carrito',
          headerShown: false,
          // Badge con la cantidad de ítems del carrito.
          tabBarBadge: cantidadTotal > 0 ? cantidadTotal : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}