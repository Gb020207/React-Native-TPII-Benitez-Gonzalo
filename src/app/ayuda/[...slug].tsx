import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { DondeEstoy } from '../../componentes/DondeEstoy';
import { Vacio } from '../../componentes/Tarjetas';
import { buscarArticulo } from '../../datos/articulos_ayuda';
import { colores } from '../../tema/colores';

/**
 * Artículos de ayuda de profundidad variable. URL: /ayuda/[...slug]
 *
 * [...slug] captura uno o más segmentos, así que el mismo archivo sirve
 * para /ayuda/horarios y para /ayuda/pagos/efectivo. El array "slug"
 * siempre llega como string[].
 */
export default function ArticuloAyuda() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>();

  const segmentos = Array.isArray(slug) ? slug : slug ? [slug] : [];
  const articulo = buscarArticulo(segmentos);

  if (!articulo) {
    return (
      <ScrollView contentContainerStyle={estilos.contenido}>
        <Stack.Screen options={{ title: 'Artículo no encontrado' }} />

        <Vacio
          emoji="📄"
          titulo="Ese artículo no existe"
          detalle={`No encontramos nada en /ayuda/${segmentos.join('/')}`}
        />

        <DondeEstoy />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Stack.Screen options={{ title: articulo.titulo }} />

      <Text style={estilos.migas}>/ayuda/{segmentos.join(' / ')}</Text>

      <Text style={estilos.titulo}>{articulo.titulo}</Text>
      <Text style={estilos.resumen}>{articulo.resumen}</Text>

      <View style={estilos.cuerpo}>
        {articulo.contenido.map((parrafo, indice) => (
          <Text key={indice} style={estilos.parrafo}>
            • {parrafo}
          </Text>
        ))}
      </View>

      <DondeEstoy />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: 20,
    gap: 12,
    paddingBottom: 32,
  },
  migas: {
    fontSize: 12,
    color: colores.verdeVivo,
    fontWeight: '600',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: colores.verde,
  },
  resumen: {
    fontSize: 15,
    color: colores.textoSuave,
  },
  cuerpo: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
    gap: 8,
  },
  parrafo: {
    fontSize: 15,
    color: colores.texto,
    lineHeight: 22,
  },
});