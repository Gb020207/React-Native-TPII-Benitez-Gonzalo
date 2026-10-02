import { StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { Boton } from '../../../componentes/Boton';
import { DondeEstoy } from '../../../componentes/DondeEstoy';
import { useComedor } from '../../../contexto/ComedorContext';
import { colores } from '../../../tema/colores';

/** Aclaración para la cocina, por ejemplo "sin sal". URL: /carrito/nota */
export default function Nota() {
  const { nota, setNota } = useComedor();

  return (
    <View style={estilos.contenido}>
      <Text style={estilos.titulo}>Nota para la cocina</Text>
      <Text style={estilos.ayuda}>
        Escribí algo que la cocina tenga que tener en cuenta, por ejemplo "sin sal" o
        "servir templado".
      </Text>

      <TextInput
        style={estilos.entrada}
        value={nota}
        onChangeText={setNota}
        placeholder="Ej.: sin sal, sin cebolla, para llevar"
        placeholderTextColor={colores.textoSuave}
        multiline
        maxLength={160}
      />

      <Boton
        titulo="Guardar nota"
        icono="💾"
        onPress={() => router.back()}
        estilo={estilos.boton}
      />
      <Boton
        titulo="Quitar la nota"
        icono="🗑️"
        tipo="secundario"
        onPress={() => {
          setNota('');
          router.back();
        }}
      />

      <DondeEstoy />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: colores.verde,
  },
  ayuda: {
    fontSize: 14,
    color: colores.textoSuave,
    lineHeight: 20,
  },
  entrada: {
    minHeight: 110,
    borderWidth: 2,
    borderColor: colores.borde,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colores.texto,
    backgroundColor: colores.blanco,
    textAlignVertical: 'top',
  },
  boton: {
    marginTop: 4,
  },
});