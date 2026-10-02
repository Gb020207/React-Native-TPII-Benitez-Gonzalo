import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { DondeEstoy } from '../../componentes/DondeEstoy';
import { TarjetaPlato } from '../../componentes/TarjetaPlato';
import { Vacio } from '../../componentes/Tarjetas';
import { esCategoriaValida, platosDeCategoria } from '../../datos/platos';
import { colores, INFO_CATEGORIA } from '../../tema/colores';

/** Platos de una categoría. URL: /categorias/[categoria] */
export default function PlatosPorCategoria() {
  const { categoria } = useLocalSearchParams<{ categoria: string }>();

  // El parámetro llega como texto: primero se valida que exista.
  const valida = esCategoriaValida(String(categoria));
  const platos = valida ? platosDeCategoria(String(categoria)) : [];
  const info = valida ? INFO_CATEGORIA[String(categoria) as keyof typeof INFO_CATEGORIA] : null;

  if (!valida || !info) {
    return (
      <ScrollView contentContainerStyle={estilos.contenido}>
        <Stack.Screen options={{ title: 'Categoría no encontrada' }} />

        <Vacio
          emoji="🗂️"
          titulo={`No existe la categoría "${String(categoria)}"`}
          detalle='Las categorías disponibles son: desayuno, almuerzo, bebidas y kiosco.'
        />

        <DondeEstoy />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Stack.Screen options={{ title: info.titulo }} />

      <Text style={estilos.emoji}>{info.emoji}</Text>
      <Text style={estilos.titulo}>{info.titulo}</Text>
      <Text style={estilos.cantidad}>
        {platos.length} {platos.length === 1 ? 'plato' : 'platos'}
      </Text>

      <View style={estilos.lista}>
        {platos.map((plato) => (
          <TarjetaPlato key={plato.id} plato={plato} />
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
  emoji: {
    fontSize: 52,
    textAlign: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: colores.verde,
    textAlign: 'center',
  },
  cantidad: {
    textAlign: 'center',
    fontSize: 14,
    color: colores.textoSuave,
    marginTop: -6,
  },
  lista: {
    gap: 10,
    marginTop: 6,
  },
});
