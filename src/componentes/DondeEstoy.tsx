import { Text, View } from 'react-native';
import { useLocalSearchParams, usePathname, useSegments } from 'expo-router';

import { colores } from '../tema/colores';

/**
 * Interruptor de depuración.
 * Con DEBUG en false el componente no se dibuja, pero sigue siendo parte
 * de cada pantalla para poder activarlo cuando haga falta.
 */
export const DEBUG = true;

/**
 * Componente "¿Dónde estoy?".
 *
 * Muestra los tres hooks de ubicación de Expo Router. Sirve para entender
 * de qué segmento de la URL viene cada cosa, sobre todo para diferenciar
 * una ruta del Stack raíz de una ruta dentro de una tab o de un Drawer.
 */
export function DondeEstoy() {
  const pathname = usePathname();
  const segments = useSegments();
  const params = useLocalSearchParams();

  if (!DEBUG) return null;

  const listaParams = Object.entries(params)
    .map(([clave, valor]) => `${clave}: ${String(valor)}`)
    .join(', ');

  return (
    <View style={contenedor} testID="donde-estoy">
      <Text style={titulo}>¿Dónde estoy?</Text>
      <Text style={linea}>pathname: {pathname}</Text>
      <Text style={linea}>segments: [{segments.join(', ')}]</Text>
      <Text style={linea}>params: {'{' + (listaParams || 'sin parámetros') + '}'}</Text>
    </View>
  );
}

const contenedor = {
  marginTop: 16,
  padding: 10,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: colores.borde,
  backgroundColor: colores.verdeMuySuave,
};

const titulo = {
  fontSize: 11,
  fontWeight: '700' as const,
  color: colores.verde,
  marginBottom: 4,
};

const linea = {
  fontSize: 11,
  color: colores.textoSuave,
};