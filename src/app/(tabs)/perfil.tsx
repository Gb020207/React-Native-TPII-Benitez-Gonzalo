import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { DondeEstoy } from '../../componentes/DondeEstoy';
import { Boton } from '../../componentes/Boton';
import { Info, TarjetaAcceso } from '../../componentes/Tarjetas';
import { useComedor } from '../../contexto/ComedorContext';
import { colores } from '../../tema/colores';

/** Perfil del alumno y acceso a la cocina. URL: /perfil */
export default function Perfil() {
  const { usuario, cerrarSesion, cantidadTotal, total } = useComedor();

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <View style={estilos.avataro}>
        <Text style={estilos.avataroTexto}>{usuario ? '🧑‍🍳' : '👨‍🎓'}</Text>
      </View>

      <Text style={estilos.nombre}>{usuario ? usuario.nombre : 'Alumno del IPF'}</Text>
      <Text style={estilos.rol}>
        {usuario ? 'Personal de cocina' : 'Compras como alumno'}
      </Text>

      {usuario ? (
        <View style={estilos.datos}>
          <View style={estilos.dato}>
            <Text style={estilos.datoEtiqueta}>Pedidos en espera</Text>
            <Text style={estilos.datoValor}>Ver en Cocina</Text>
          </View>
        </View>
      ) : (
        <View style={estilos.datos}>
          <View style={estilos.dato}>
            <Text style={estilos.datoEtiqueta}>Ítems en el carrito</Text>
            <Text style={estilos.datoValor}>{cantidadTotal}</Text>
          </View>
          <View style={estilos.dato}>
            <Text style={estilos.datoEtiqueta}>Total actual</Text>
            <Text style={estilos.datoValor}>Gs. {total.toLocaleString('es-PY')}</Text>
          </View>
        </View>
      )}

      <Text style={estilos.seccion}>Ir a</Text>
      <View style={estilos.rejilla}>
        <TarjetaAcceso
          emoji="🍽️"
          titulo="Menú"
          descripcion="Platos del día"
          href="/menu"
        />
        <TarjetaAcceso
          emoji="🆘"
          titulo="Ayuda"
          descripcion="Pagos y horarios"
          href="/ayuda"
        />
      </View>

      {usuario ? (
        <>
          <Link href="/cocina" asChild>
            <View style={estilos.enlace}>
              <Ionicons name="flame" size={18} color={colores.verde} />
              <Text style={estilos.enlaceTexto}>Abrir Cocina</Text>
            </View>
          </Link>

          {/* Al cerrar sesión el guard de /cocina pasa a false y el navegador
              saca la sección del historial sola: no hace falta router.back(). */}
          <Boton
            titulo="Cerrar sesión"
            icono="🚪"
            tipo="peligro"
            onPress={cerrarSesion}
            estilo={estilos.boton}
          />
        </>
      ) : (
        <Info emoji="🔐" titulo="¿Sos de la cocina?">
          <Text style={estilosTexto}>
            Iniciá sesión para atender los pedidos en orden de llegada.
          </Text>
          <Link href="/login" asChild>
            <View style={estilos.enlace}>
              <Ionicons name="log-in" size={18} color={colores.verde} />
              <Text style={estilos.enlaceTexto}>Ingresar a Cocina</Text>
            </View>
          </Link>
        </Info>
      )}

      <DondeEstoy />
    </ScrollView>
  );
}

const estilosTexto = {
  fontSize: 13,
  color: colores.textoSuave,
};

const estilos = StyleSheet.create({
  contenido: {
    padding: 20,
    gap: 14,
    paddingBottom: 32,
  },
  avataro: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
    backgroundColor: colores.verdeSuave,
  },
  avataroTexto: {
    fontSize: 42,
  },
  nombre: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: colores.verde,
  },
  rol: {
    textAlign: 'center',
    fontSize: 14,
    color: colores.textoSuave,
    marginTop: -8,
  },
  datos: {
    flexDirection: 'row',
    gap: 12,
  },
  dato: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
    gap: 4,
  },
  datoEtiqueta: {
    fontSize: 12,
    color: colores.textoSuave,
  },
  datoValor: {
    fontSize: 18,
    fontWeight: '800',
    color: colores.verde,
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
  enlace: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
  },
  enlaceTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.verde,
  },
  boton: {
    marginTop: 4,
  },
});