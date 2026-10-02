import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Boton } from '../../componentes/Boton';
import { DondeEstoy } from '../../componentes/DondeEstoy';
import { Vacio } from '../../componentes/Tarjetas';
import { formatearPrecio } from '../../datos/platos';
import { useComedor } from '../../contexto/ComedorContext';
import { colores } from '../../tema/colores';

/**
 * Cola de pedidos de la cocina. URL: /cocina
 *
 * Muestra el frente() de la Cola y desencola con "Atender siguiente".
 * El pedido atendido se apila en la Pila de atendidos.
 */
export default function Cocina() {
  const {
    usuario,
    pedidoDelFrente,
    pedidosEnEspera,
    atenderSiguiente,
    cerrarSesion,
  } = useComedor();

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <View style={estilos.encabezado}>
        <View>
          <Text style={estilos.saludo}>Hola, {usuario?.nombre}</Text>
          <Text style={estilos.subtitulo}>Pedidos en orden de llegada</Text>
        </View>
        <Boton titulo="Salir" tipo="peligro" onPress={cerrarSesion} />
      </View>

      <View style={estilos.contador}>
        <Text style={estilos.contadorValor}>{pedidosEnEspera}</Text>
        <Text style={estilos.contadorEtiqueta}>
          {pedidosEnEspera === 1 ? 'pedido en espera' : 'pedidos en espera'}
        </Text>
      </View>

      {pedidoDelFrente ? (
        <View style={estilos.pedido}>
          <View style={estilos.pedidoEncabezado}>
            <Text style={estilos.pedidoNumero}>Turno {pedidoDelFrente.numero}</Text>
            <Text style={estilos.pedidoHora}>🕐 {pedidoDelFrente.hora}</Text>
          </View>

          <View style={estilos.lineas}>
            {pedidoDelFrente.items.map((item) => (
              <Text key={item.plato.id} style={estilos.linea}>
                {item.cantidad} × {item.plato.emoji} {item.plato.nombre}
              </Text>
            ))}
          </View>

          {pedidoDelFrente.nota ? (
            <View style={estilos.nota}>
              <Text style={estilos.notaTexto}>📝 {pedidoDelFrente.nota}</Text>
            </View>
          ) : null}

          <Text style={estilos.pedidoTotal}>
            Total: {formatearPrecio(pedidoDelFrente.total)}
          </Text>

          {/* Desencola el frente de la Cola y apila el pedido atendido. */}
          <Boton
            titulo="Atender siguiente"
            icono="✅"
            onPress={() => atenderSiguiente()}
            estilo={estilos.boton}
          />
        </View>
      ) : (
        <Vacio
          emoji="🎉"
          titulo="No hay pedidos esperando"
          detalle="La fila está vacía. Los pedidos nuevos van a aparecer acá."
        />
      )}

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
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  saludo: {
    fontSize: 22,
    fontWeight: '800',
    color: colores.verde,
  },
  subtitulo: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  contador: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: colores.verdeSuave,
  },
  contadorValor: {
    fontSize: 46,
    fontWeight: '900',
    color: colores.verde,
    lineHeight: 52,
  },
  contadorEtiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.verde,
  },
  pedido: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colores.verde,
    backgroundColor: colores.blanco,
    gap: 10,
  },
  pedidoEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pedidoNumero: {
    fontSize: 20,
    fontWeight: '800',
    color: colores.verde,
  },
  pedidoHora: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  lineas: {
    gap: 4,
  },
  linea: {
    fontSize: 15,
    color: colores.texto,
  },
  nota: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colores.avisoSuave,
  },
  notaTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.aviso,
  },
  pedidoTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.verde,
    textAlign: 'right',
  },
  boton: {
    marginTop: 4,
  },
});