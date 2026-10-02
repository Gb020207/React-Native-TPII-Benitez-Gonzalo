import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { DondeEstoy } from '../../componentes/DondeEstoy';
import { Vacio } from '../../componentes/Tarjetas';
import { formatearPrecio } from '../../datos/platos';
import { useComedor } from '../../contexto/ComedorContext';
import { colores } from '../../tema/colores';

/**
 * Pedidos ya atendidos. URL: /cocina/atendidos
 *
 * Los atendidos se apilan en una Pila, así que se muestran del tope a la
 * base: el último atendido primero.
 */
export default function Atendidos() {
  const { atendidos } = useComedor();

  if (atendidos.length === 0) {
    return (
      <ScrollView contentContainerStyle={estilos.contenido}>
        <Vacio
          emoji="📋"
          titulo="Todavía no atendiste ningún pedido"
          detalle="Acá va a quedar el historial de lo que ya prepararon."
        />
        <DondeEstoy />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Text style={estilos.titulo}>Pedidos atendidos</Text>
      <Text style={estilos.subtitulo}>Del más reciente al más antiguo</Text>

      <View style={estilos.lista}>
        {atendidos.map((pedido) => (
          <View key={pedido.numero} style={estilos.fila}>
            <View style={estilos.numero}>
              <Text style={estilos.numeroTexto}>{pedido.numero}</Text>
            </View>

            <View style={estilos.datos}>
              <Text style={estilos.hora}>🕐 {pedido.hora}</Text>
              <Text style={estilos.items}>
                {pedido.items
                  .map((item) => `${item.cantidad}× ${item.plato.nombre}`)
                  .join(' · ')}
              </Text>
              {pedido.nota ? (
                <Text style={estilos.nota}>📝 {pedido.nota}</Text>
              ) : null}
            </View>

            <Text style={estilos.total}>{formatearPrecio(pedido.total)}</Text>
          </View>
        ))}
      </View>

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
    fontSize: 13,
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
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
  },
  numero: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: colores.verdeSuave,
  },
  numeroTexto: {
    fontSize: 17,
    fontWeight: '800',
    color: colores.verde,
  },
  datos: {
    flex: 1,
    gap: 2,
  },
  hora: {
    fontSize: 12,
    color: colores.textoSuave,
  },
  items: {
    fontSize: 14,
    color: colores.texto,
  },
  nota: {
    fontSize: 12,
    color: colores.aviso,
    fontWeight: '600',
  },
  total: {
    fontSize: 14,
    fontWeight: '700',
    color: colores.verde,
  },
});