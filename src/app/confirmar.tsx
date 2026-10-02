import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Boton } from '../componentes/Boton';
import { DondeEstoy } from '../componentes/DondeEstoy';
import { ItemCarrito } from '../componentes/ItemCarrito';
import { Vacio } from '../componentes/Tarjetas';
import { formatearPrecio } from '../datos/platos';
import { useComedor } from '../contexto/ComedorContext';
import { colores } from '../tema/colores';

/**
 * Resumen del pedido antes de confirmar. URL: /confirmar
 * Vive en el Stack raíz con presentation: "modal".
 */
export default function Confirmar() {
  const { items, total, cantidadTotal, nota, confirmarPedido } = useComedor();

  /** Encola el pedido en la Cola y navega al turno con replace. */
  const confirmar = () => {
    const pedido = confirmarPedido();

    if (!pedido) {
      router.dismissAll();
      return;
    }

    // replace y no push: si se apilara, el botón "atrás" traería al
    // usuario de vuelta a esta pantalla de confirmación y podría volver
    // a confirmar el mismo pedido.
    router.replace(`/turno/${pedido.numero}`);
  };

  if (items.length === 0) {
    return (
      <ScrollView contentContainerStyle={estilos.contenido}>
        <Vacio
          emoji="🧾"
          titulo="No hay nada que confirmar"
          detalle="Tu carrito está vacío."
        />
        <Boton titulo="Ir al Menú" onPress={() => router.dismissAll()} />
        <DondeEstoy />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Text style={estilos.titulo}>Revisá tu pedido</Text>
      <Text style={estilos.subtitulo}>
        {cantidadTotal} {cantidadTotal === 1 ? 'ítem' : 'ítems'}
      </Text>

      <View style={estilos.lista}>
        {items.map((item) => (
          <ItemCarrito key={item.plato.id} item={item} />
        ))}
      </View>

      {nota ? (
        <View style={estilos.nota}>
          <Text style={estilos.notaTexto}>📝 Nota para la cocina: {nota}</Text>
        </View>
      ) : null}

      <View style={estilos.total}>
        <Text style={estilos.totalEtiqueta}>Total</Text>
        <Text style={estilos.totalValor}>{formatearPrecio(total)}</Text>
      </View>

      <Boton titulo="Confirmar" icono="✅" onPress={confirmar} />
      <Boton
        titulo="Volver al carrito"
        tipo="secundario"
        onPress={() => router.back()}
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
  titulo: {
    fontSize: 22,
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
  nota: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colores.verdeSuave,
  },
  notaTexto: {
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
});