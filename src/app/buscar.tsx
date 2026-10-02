import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { DondeEstoy } from '../componentes/DondeEstoy';
import { TarjetaPlato } from '../componentes/TarjetaPlato';
import { Vacio } from '../componentes/Tarjetas';
import { buscarPlatos } from '../datos/platos';
import { CATEGORIAS, colores, INFO_CATEGORIA } from '../tema/colores';

/**
 * Buscador. URL: /buscar?q=&categoria=
 *
 * El estado de la búsqueda vive en la URL, así que se puede compartir con un
 * link. Por eso se actualiza con router.setParams y no con router.push:
 * setParams cambia los params de la pantalla actual sin apilar, y si se
 * usara push, cada tecla escribiría una pantalla nueva en la pila.
 */
export default function Buscar() {
  const { q = '', categoria } = useLocalSearchParams<{ q?: string; categoria?: string }>();

  const texto = Array.isArray(q) ? q[0] : (q ?? '');
  const categoriaActual = Array.isArray(categoria) ? categoria[0] : categoria;
  const resultados = buscarPlatos(texto, categoriaActual);

  /** Comparte la búsqueda actual como un link. */
  const enlaceDeBusqueda = `q=${encodeURIComponent(texto)}${
    categoriaActual ? `&categoria=${categoriaActual}` : ''
  }`;

  return (
    <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
      <TextInput
        style={estilos.entrada}
        value={texto}
        onChangeText={(valor) => router.setParams({ q: valor })}
        placeholder="Buscar platos... (mate, chipá, empanada)"
        placeholderTextColor={colores.textoSuave}
        autoCorrect={false}
      />

      <Text style={estilos.etiqueta}>Filtrar por categoría</Text>

      <View style={estilos.chips}>
        <Chip
          texto="Todas"
          activo={!categoriaActual}
          onPress={() => router.setParams({ categoria: undefined })}
        />

        {CATEGORIAS.map((nombre) => (
          <Chip
            key={nombre}
            texto={`${INFO_CATEGORIA[nombre].emoji} ${INFO_CATEGORIA[nombre].titulo}`}
            activo={categoriaActual === nombre}
            onPress={() =>
              router.setParams({ categoria: categoriaActual === nombre ? undefined : nombre })
            }
          />
        ))}
      </View>

      <View style={estilos.resumen}>
        <Text style={estilos.resumenTexto}>
          {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
        </Text>
        <Text style={estilos.resumenEnlace} selectable>
          /buscar?{enlaceDeBusqueda}
        </Text>
      </View>

      {resultados.length === 0 ? (
        <Vacio
          emoji="🔍"
          titulo="No encontramos nada"
          detalle="Probá con otro texto o quitá el filtro de categoría."
        />
      ) : (
        <View style={estilos.lista}>
          {resultados.map((plato) => (
            <TarjetaPlato key={plato.id} plato={plato} />
          ))}
        </View>
      )}

      <DondeEstoy />
    </ScrollView>
  );
}

/** Botón redondo de filtro. */
function Chip({
  texto,
  activo,
  onPress,
}: {
  texto: string;
  activo: boolean;
  onPress: () => void;
}) {
  return (
    <Text
      accessibilityRole="button"
      onPress={onPress}
      style={[estilos.chip, activo ? estilos.chipActivo : null]}
    >
      {texto}
    </Text>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: 20,
    gap: 14,
    paddingBottom: 32,
  },
  entrada: {
    borderWidth: 2,
    borderColor: colores.borde,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colores.texto,
    backgroundColor: colores.blanco,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '700',
    color: colores.texto,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
    fontSize: 13,
    color: colores.textoSuave,
    overflow: 'hidden',
  },
  chipActivo: {
    backgroundColor: colores.verde,
    borderColor: colores.verde,
    color: colores.blanco,
    fontWeight: '700',
  },
  resumen: {
    gap: 2,
  },
  resumenTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.texto,
  },
  resumenEnlace: {
    fontSize: 12,
    color: colores.verde,
  },
  lista: {
    gap: 10,
  },
});