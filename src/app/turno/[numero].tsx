import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Boton } from '../../componentes/Boton';
import { DondeEstoy } from '../../componentes/DondeEstoy';
import { useComedor } from '../../contexto/ComedorContext';
import { colores } from '../../tema/colores';

/** Número de turno y cuántos pedidos hay adelante. URL: /turno/[numero] */
export default function Turno() {
  const { numero } = useLocalSearchParams<{ numero: string }>();
  const { pedidosAdelante, minutosDeEspera } = useComedor();

  // El número de turno viene de la URL como texto: se convierte.
  const n = Number(numero);
  const turnoValido = !Number.isNaN(n) && n > 0;

  if (!turnoValido) {
    return (
      <ScrollView contentContainerStyle={estilos.contenido}>
        <Text style={estilos.emoji}>❓</Text>
        <Text style={estilos.titulo}>Turno inválido</Text>
        <Text style={estilos.detalle}>No hay un turno con el número "{String(numero)}".</Text>
        <Boton titulo="Volver al inicio" onPress={() => router.replace('/')} />
        <DondeEstoy />
      </ScrollView>
    );
  }

  const adelante = pedidosAdelante(n);
  const espera = minutosDeEspera(n);

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Text style={estilos.emoji}>🎫</Text>

      <Text style={estilos.titulo}>Tu turno</Text>
      <Text style={estilos.numero}>{n}</Text>

      <View style={estilos.tarjeta}>
        <Text style={estilos.tarjetaEtiqueta}>Pedidos adelante tuyo</Text>
        <Text style={estilos.tarjetaValor}>{adelante}</Text>
        <Text style={estilos.tarjetaDetalle}>
          {adelante === 0
            ? 'Sos el siguiente: la cocina te atiende ahora.'
            : `Hay ${adelante} ${adelante === 1 ? 'pedido' : 'pedidos'} en la fila antes que vos.`}
        </Text>
      </View>

      {/* Desafío opcional: 3 minutos por pedido de espera. */}
      <View style={estilos.tarjeta}>
        <Text style={estilos.tarjetaEtiqueta}>Espera estimada</Text>
        <Text style={estilos.tarjetaValor}>{espera} min</Text>
        <Text style={estilos.tarjetaDetalle}>Calculada como {adelante} × 3 minutos.</Text>
      </View>

      <Text style={estilos.aviso}>
        🛒 Tu carrito quedó vacío. Guardá este número para consultar por tu pedido.
      </Text>

      <Boton titulo="Volver al inicio" icono="🏠" onPress={() => router.replace('/')} />

      <DondeEstoy />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: 24,
    gap: 14,
    alignItems: 'stretch',
    paddingBottom: 32,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: colores.verde,
    textAlign: 'center',
  },
  numero: {
    fontSize: 72,
    fontWeight: '900',
    color: colores.verde,
    textAlign: 'center',
    lineHeight: 84,
  },
  tarjeta: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
    gap: 4,
  },
  tarjetaEtiqueta: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  tarjetaValor: {
    fontSize: 30,
    fontWeight: '900',
    color: colores.verde,
  },
  tarjetaDetalle: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  aviso: {
    fontSize: 13,
    color: colores.textoSuave,
    textAlign: 'center',
  },
  detalle: {
    fontSize: 15,
    color: colores.textoSuave,
    textAlign: 'center',
  },
});