import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';

import { Boton } from '../../../componentes/Boton';
import { DondeEstoy } from '../../../componentes/DondeEstoy';
import { buscarPlato, formatearPrecio } from '../../../datos/platos';
import { useComedor } from '../../../contexto/ComedorContext';
import { colores, INFO_CATEGORIA } from '../../../tema/colores';

/** Detalle de un plato. URL: /menu/[id] */
export default function DetallePlato() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { agregarAlCarrito } = useComedor();

  // El parámetro de ruta siempre llega como texto: hay que convertirlo.
  const plato = buscarPlato(id);

  // Desafío opcional: cuántas pantallas hay apiladas en este Stack.
  const rutas = navigation.getState()?.routes;
  const pantallasEnPila = rutas?.length ?? 1;

  // Si el plato existe, el header pasa a mostrar su nombre.
  if (plato) {
    // El <Stack.Screen> tiene que ser un hijo directo del componente.
    return (
      <ScrollView contentContainerStyle={estilos.contenido}>
        <Stack.Screen
          options={{
            title: plato.nombre,
            headerBackButtonDisplayMode: 'minimal',
          }}
        />

        <Text style={estilos.emoji}>{plato.emoji}</Text>
        <Text style={estilos.nombre}>{plato.nombre}</Text>
        <Text style={estilos.precio}>{formatearPrecio(plato.precio)}</Text>

        <View style={estilos.categoria}>
          <Text style={estilos.categoriaTexto}>
            {INFO_CATEGORIA[plato.categoria].emoji}{' '}
            {INFO_CATEGORIA[plato.categoria].titulo}
          </Text>
        </View>

        <Text style={estilos.descripcion}>{plato.descripcion}</Text>

        <Boton
          titulo="Agregar al carrito"
          icono="🛒"
          onPress={() => agregarAlCarrito(plato)}
          estilo={estilos.boton}
        />

        <Boton
          titulo="Ir al carrito"
          tipo="secundario"
          onPress={() => router.push('/carrito')}
        />

        <Text style={estilos.pila}>📚 {pantallasEnPila} pantalla(s) en la pila</Text>

        <DondeEstoy />
      </ScrollView>
    );
  }

  // Plato inexistente: se valida el dato, no lo hace Expo Router.
  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Stack.Screen options={{ title: 'Plato no encontrado' }} />

      <Text style={stylesNoEncontrado.emoji}>🤔</Text>
      <Text style={stylesNoEncontrado.titulo}>No existe el plato "{String(id)}"</Text>
      <Text style={stylesNoEncontrado.detalle}>
        El identificador llegó como texto desde la URL y no coincide con ningún plato del menú.
      </Text>

      <DondeEstoy />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: 24,
    gap: 12,
    paddingBottom: 32,
  },
  emoji: {
    fontSize: 72,
    textAlign: 'center',
  },
  nombre: {
    fontSize: 26,
    fontWeight: '800',
    color: colores.verde,
    textAlign: 'center',
  },
  precio: {
    fontSize: 22,
    fontWeight: '700',
    color: colores.texto,
    textAlign: 'center',
  },
  categoria: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colores.verdeSuave,
  },
  categoriaTexto: {
    fontSize: 13,
    color: colores.verde,
    fontWeight: '600',
  },
  descripcion: {
    fontSize: 15,
    color: colores.textoSuave,
    textAlign: 'center',
    lineHeight: 22,
  },
  boton: {
    marginTop: 12,
  },
  pila: {
    textAlign: 'center',
    fontSize: 12,
    color: colores.textoSuave,
  },
});

const stylesNoEncontrado = StyleSheet.create({
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: colores.texto,
    textAlign: 'center',
  },
  detalle: {
    fontSize: 14,
    color: colores.textoSuave,
    textAlign: 'center',
    lineHeight: 20,
  },
});