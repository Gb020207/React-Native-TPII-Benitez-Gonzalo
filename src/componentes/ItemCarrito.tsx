import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { formatearPrecio } from '../datos/platos';
import type { ItemCarrito as ItemCarritoTipo } from '../contexto/ComedorContext';
import { colores } from '../tema/colores';

/** Fila del carrito: un plato, su cantidad y el subtotal. */
export function ItemCarrito({ item }: { item: ItemCarritoTipo }) {
  const { plato, cantidad } = item;

  return (
    <View style={estilos.fila}>
      <Text style={estilos.emoji}>{plato.emoji}</Text>

      <View style={estilos.datos}>
        <Text style={estilos.nombre}>{plato.nombre}</Text>
        <Text style={estilos.cantidad}>
          {cantidad} × {formatearPrecio(plato.precio)}
        </Text>
      </View>

      <Text style={estilos.subtotal}>{formatearPrecio(plato.precio * cantidad)}</Text>
    </View>
  );
}

/** Enlace a la pantalla donde se escribe la nota para la cocina. */
export function LinkNota() {
  return (
    <Link href="/carrito/nota" asChild>
      <View style={estilos.nota}>
        <Text style={estilos.notaTexto}>📝 Agregar o editar la nota para la cocina</Text>
      </View>
    </Link>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
  },
  emoji: {
    fontSize: 26,
  },
  datos: {
    flex: 1,
    gap: 2,
  },
  nombre: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.texto,
  },
  cantidad: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  subtotal: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.verde,
  },
  nota: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colores.verdeVivo,
    backgroundColor: colores.verdeSuave,
  },
  notaTexto: {
    fontSize: 13,
    color: colores.verde,
    fontWeight: '600',
  },
});