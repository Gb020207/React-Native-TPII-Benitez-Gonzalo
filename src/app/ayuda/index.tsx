import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { DondeEstoy } from '../../componentes/DondeEstoy';
import { ARTICULOS_AYUDA } from '../../datos/articulos_ayuda';
import { colores } from '../../tema/colores';

/**
 * Índice de ayuda. URL: /ayuda
 *
 * Esta pantalla existe porque /ayuda sin subcarpetas necesita su propio
 * index.tsx: el catch-all [...slug] exige uno o más segmentos.
 */
export default function Ayuda() {
  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Text style={estilos.titulo}>Centro de ayuda</Text>
      <Text style={estilos.subtitulo}>Todo lo que necesitás saber para pedir.</Text>

      <View style={estilos.lista}>
        {ARTICULOS_AYUDA.map((articulo) => (
          <Link
            key={articulo.slug.join('/')}
            href={`/ayuda/${articulo.slug.join('/')}`}
            asChild
          >
            <View style={estilos.fila}>
              <Text style={estilos.icono}>📄</Text>
              <View style={estilos.datos}>
                <Text style={estilos.filaTitulo}>{articulo.titulo}</Text>
                <Text style={estilos.filaResumen}>{articulo.resumen}</Text>
              </View>
            </View>
          </Link>
        ))}
      </View>

      <DondeEstoy />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: 20,
    gap: 16,
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
    marginTop: -10,
  },
  lista: {
    gap: 10,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
  },
  icono: {
    fontSize: 26,
  },
  datos: {
    flex: 1,
    gap: 2,
  },
  filaTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.texto,
  },
  filaResumen: {
    fontSize: 13,
    color: colores.textoSuave,
  },
});