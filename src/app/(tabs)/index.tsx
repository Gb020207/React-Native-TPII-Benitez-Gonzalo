import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { DondeEstoy } from '../../componentes/DondeEstoy';
import { Info, TarjetaAcceso } from '../../componentes/Tarjetas';
import { useComedor } from '../../contexto/ComedorContext';
import { colores } from '../../tema/colores';

/** Pantalla de Inicio: saludo y accesos rápidos. URL: / */
export default function Inicio() {
  const { usuario, cantidadTotal, pedidosEnEspera } = useComedor();

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Text style={estilos.saludo}>¡Hola! 👋</Text>
      <Text style={estilos.subtitulo}>Comedor IPF · hacé tu pedido desde el celular</Text>

      {usuario ? (
        <Info emoji="🧑‍🍳" titulo={`Sesión de ${usuario.nombre}`}>
          <Text style={estilos.infoTexto}>
            Estás en modo cocina. Hay {pedidosEnEspera}{' '}
            {pedidosEnEspera === 1 ? 'pedido esperando' : 'pedidos esperando'}.
          </Text>
        </Info>
      ) : (
        <Info emoji="👨‍🎓" titulo="Pedidos para alumnos">
          <Text style={estilos.infoTexto}>
            Entrá al Menú, armá tu carrito y confirmá. Te damos un número de turno.
          </Text>
        </Info>
      )}

      <Text style={estilos.seccion}>Accesos rápidos</Text>

      <View style={estilos.rejilla}>
        <TarjetaAcceso
          emoji="🍽️"
          titulo="Menú"
          descripcion="Platos por categoría"
          href="/menu"
        />
        <TarjetaAcceso
          emoji="🔎"
          titulo="Buscar"
          descripcion="Buscá por nombre o categoría"
          href="/buscar"
        />
        <TarjetaAcceso
          emoji="🆘"
          titulo="Ayuda"
          descripcion="Pagos, horarios y más"
          href="/ayuda"
        />
        <TarjetaAcceso
          emoji="🧑‍🍳"
          titulo="Cocina"
          descripcion="Atender pedidos en orden"
          href={usuario ? '/cocina' : '/login'}
        />
      </View>

      {cantidadTotal > 0 ? (
        <Info emoji="🛒" titulo={`Tenés ${cantidadTotal} ítems en el carrito`}>
          <Text style={estilos.infoTexto}>Mirá el total y confirmá el pedido.</Text>
        </Info>
      ) : null}

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
  saludo: {
    fontSize: 30,
    fontWeight: '800',
    color: colores.verde,
  },
  subtitulo: {
    fontSize: 14,
    color: colores.textoSuave,
    marginTop: -10,
  },
  seccion: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.texto,
    marginTop: 4,
  },
  rejilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoTexto: {
    fontSize: 13,
    color: colores.textoSuave,
  },
});