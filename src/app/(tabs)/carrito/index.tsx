import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Boton } from '../../../componentes/Boton';
import { DondeEstoy } from '../../../componentes/DondeEstoy';
import { ItemCarrito, LinkNota } from '../../../componentes/ItemCarrito';
import { Vacio } from '../../../componentes/Tarjetas';
import { formatearPrecio } from '../../../datos/platos';
import { useComedor } from '../../../contexto/ComedorContext';
import { colores } from '../../../tema/colores';

/** Ítems del carrito, total, deshacer y confirmar. URL: /carrito */
export default function Carrito() {
  const { items, total, cantidadTotal, nota, deshacerUltimo, puedeDeshacer } = useComedor();

  if (items.length === 0) {
    return (
      <ScrollView contentContainerStyle={estilos.contenido}>
        <Vacio
          emoji="🛒"
          titulo="Tu carrito está vacío"
          detalle="Agregá platos desde el Menú y volvé a acá."
        />
        <Boton titulo="Ir al Menú" icono="🍽️" onPress={() => router.push('/menu')} />
        <DondeEstoy />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Text style={estilos.resumen}>
        {cantidadTotal} {cantidadTotal === 1 ? 'ítem' : 'ítems'} en el carrito
      </Text>

      <View style={estilos.lista}>
        {items.map((item) => (
          <ItemCarrito key={item.plato.id} item={item} />
        ))}
      </View>

      <LinkNota />

      {nota ? (
        <View style={estilos.notaActiva}>
          <Text style={estilos.notaActivaTexto}>📝 Nota: {nota}</Text>
        </View>
      ) : null}

      <View style={estilos.total}>
        <Text style={estilos.totalEtiqueta}>Total</Text>
        <Text style={estilos.totalValor}>{formatearPrecio(total)}</Text>
      </View>

      {/* "Deshacer último" hace pop en la pila de acciones. El botón se
          deshabilita cuando la pila está vacía. */}
      <Boton
        titulo="Deshacer último"
        icono="↩️"
        tipo="secundario"
        deshabilitado={!puedeDeshacer}
        onPress={() => deshacerUltimo()}
      />

      {/* Confirmar lleva a /confirmar, que es un modal del Stack raíz.
          Se navega con router porque es una acción del botón, no un link. */}
      <Boton
        titulo="Confirmar pedido"
        icono="✅"
        onPress={() => router.push('/confirmar')}
        estilo={estilos.confirmar}
      />

      <DondeEstoy />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: 20,
    gap: 14,
    paddingBottom: 32,
  },
  resumen: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.textoSuave,
  },
  lista: {
    gap: 10,
  },
  notaActiva: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colores.verdeVivo,
    backgroundColor: colores.verdeSuave,
  },
  notaActivaTexto: {
    fontSize: 14,
    color: colores.verde,
    fontWeight: '600',
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    backgroundColor: colores.verdeSuave,
  },
  totalEtiqueta: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.verde,
  },
  totalValor: {
    fontSize: 22,
    fontWeight: '800',
    color: colores.verde,
  },
  confirmar: {
    marginTop: 2,
  },
});