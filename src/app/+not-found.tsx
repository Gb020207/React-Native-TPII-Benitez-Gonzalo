import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, router, usePathname } from 'expo-router';

import { Boton } from '../componentes/Boton';
import { DondeEstoy } from '../componentes/DondeEstoy';
import { TarjetaAcceso } from '../componentes/Tarjetas';
import { colores } from '../tema/colores';

/** Pantalla 404: se muestra cuando ninguna ruta coincide con la URL. */
export default function NoEncontrada() {
  const pathname = usePathname();

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Stack.Screen options={{ title: 'Página no encontrada' }} />

      <Text style={estilos.codigo}>404</Text>
      <Text style={estilos.titulo}>No encontramos esa pantalla</Text>

      <View style={estilos.url}>
        <Text style={estilos.urlTexto} selectable>
          {pathname}
        </Text>
      </View>

      <Text style={estilos.detalle}>
        Esa URL no corresponde a ninguna ruta de la app. Probá con alguno de estos accesos:
      </Text>

      <View style={estilos.rejilla}>
        <TarjetaAcceso emoji="🍽️" titulo="Menú" descripcion="Platos" href="/menu" />
        <TarjetaAcceso emoji="🆘" titulo="Ayuda" descripcion="Ayuda" href="/ayuda" />
      </View>

      <Boton titulo="Ir al inicio" icono="🏠" onPress={() => router.replace('/')} />

      <DondeEstoy />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: 24,
    gap: 14,
    alignItems: 'center',
    paddingBottom: 32,
  },
  codigo: {
    fontSize: 84,
    fontWeight: '900',
    color: colores.verdeSuave,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: colores.verde,
    textAlign: 'center',
  },
  url: {
    alignSelf: 'stretch',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
  },
  urlTexto: {
    fontSize: 14,
    color: colores.verde,
    textAlign: 'center',
  },
  detalle: {
    fontSize: 14,
    color: colores.textoSuave,
    textAlign: 'center',
    lineHeight: 20,
  },
  rejilla: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});