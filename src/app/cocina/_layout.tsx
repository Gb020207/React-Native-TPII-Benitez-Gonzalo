import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colores } from '../../tema/colores';

/**
 * Menú lateral de la sección Cocina. URL de la sección: /cocina
 *
 * En SDK 57 el Drawer viene incluido en expo-router: se importa desde
 * 'expo-router/drawer' y NO hay que instalar @react-navigation/drawer.
 *
 * Como el Drawer está declarado dentro de un Stack.Protected con
 * guard={conSesion}, esta sección desaparece del historial al cerrar sesión.
 */
export default function LayoutCocina() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: colores.verde },
        headerTintColor: colores.blanco,
        headerTitleStyle: { fontWeight: '700' },
        drawerActiveTintColor: colores.verde,
        drawerInactiveTintColor: colores.textoSuave,
        drawerActiveBackgroundColor: colores.verdeSuave,
        drawerStyle: { backgroundColor: colores.blanco },
        sceneStyle: { backgroundColor: colores.verdeMuySuave },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Pedidos en cola',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="flame" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="atendidos"
        options={{
          title: 'Ya atendidos',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}