import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { DondeEstoy } from '../../../componentes/DondeEstoy';
import { TarjetaPlato } from '../../../componentes/TarjetaPlato';
import { PLATOS, platosDeCategoria } from '../../../datos/platos';
import { CATEGORIAS, colores, INFO_CATEGORIA } from '../../../tema/colores';

/** Lista de platos agrupada por categoría. URL: /menu */
export default function Menu() {
  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Text style={estilos.titulo}>Nuestro menú</Text>
      <Text style={estilos.subtitulo}>Tocá un plato para ver el detalle y agregarlo.</Text>

      {CATEGORIAS.map((categoria) => {
        const platos = platosDeCategoria(categoria);
        const info = INFO_CATEGORIA[categoria];

        return (
          <View key={categoria} style={estilos.seccion}>
            <View style={estilos.encabezado}>
              <Text style={estilos.seccionTitulo}>
                {info.emoji} {info.titulo}
              </Text>

              {/* Link a la categoría filtrada, que vive en el Stack raíz. */}
              <Link href={`/categorias/${categoria}`} asChild>
                <View style={estilos.verTodo}>
                  <Text style={estilos.verTodoTexto}>Ver todo</Text>
                  <Ionicons name="chevron-forward" size={14} color={colores.verde} />
                </View>
              </Link>
            </View>

            <View style={estilos.lista}>
              {platos.map((plato) => (
                <TarjetaPlato key={plato.id} plato={plato} />
              ))}
            </View>
          </View>
        );
      })}

      <Text style={estilos.total}>{PLATOS.length} platos disponibles</Text>

      <DondeEstoy />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: 20,
    gap: 20,
    paddingBottom: 32,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: colores.verde,
  },
  subtitulo: {
    fontSize: 14,
    color: colores.textoSuave,
    marginTop: -14,
  },
  seccion: {
    gap: 10,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seccionTitulo: {
    fontSize: 19,
    fontWeight: '800',
    color: colores.texto,
  },
  verTodo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colores.verdeSuave,
  },
  verTodoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: colores.verde,
  },
  lista: {
    gap: 10,
  },
  total: {
    textAlign: 'center',
    fontSize: 13,
    color: colores.textoSuave,
  },
});