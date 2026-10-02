import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { formatearPrecio } from '../datos/platos';
import type { Plato } from '../datos/platos';
import { colores, INFO_CATEGORIA } from '../tema/colores';

type Props = {
  plato: Plato;
  /** Por defecto cada tarjeta abre el detalle del plato. */
  mostrarLink?: boolean;
  accion?: React.ReactNode;
};

/**
 * Tarjeta de un plato.
 *
 * Se usa dentro de un <Link asChild> en el resto de la app. Por eso el
 * <Link> y esta tarjeta son dos componentes separados: si esta tarjeta
 * recibiera el style como array al ser hija de un <Slot>, Expo Router
 * tiraría el warning de arrays de estilos.
 */
export function TarjetaPlato({ plato, mostrarLink = true, accion }: Props) {
  const contenido = (
    <View style={estilos.tarjeta}>
      <Text style={estilos.emoji}>{plato.emoji}</Text>

      <View style={estilos.datos}>
        <Text style={estilos.nombre}>{plato.nombre}</Text>
        <Text style={estilos.descripcion} numberOfLines={2}>
          {plato.descripcion}
        </Text>

        <View style={estilos.pie}>
          <Text style={estilos.precio}>{formatearPrecio(plato.precio)}</Text>
          <View style={estilos.categoria}>
            <Text style={estilos.categoriaTexto}>
              {INFO_CATEGORIA[plato.categoria].emoji}{' '}
              {INFO_CATEGORIA[plato.categoria].titulo}
            </Text>
          </View>
        </View>
      </View>

      {accion ? <View style={estilos.accion}>{accion}</View> : null}
    </View>
  );

  if (!mostrarLink) return contenido;

  return (
    <Link href={{ pathname: '/menu/[id]', params: { id: String(plato.id) } }} asChild>
      {contenido}
    </Link>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
  },
  emoji: {
    fontSize: 34,
  },
  datos: {
    flex: 1,
    gap: 3,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.texto,
  },
  descripcion: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 8,
  },
  precio: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.verde,
  },
  categoria: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colores.verdeSuave,
  },
  categoriaTexto: {
    fontSize: 11,
    color: colores.verde,
    fontWeight: '600',
  },
  accion: {
    marginLeft: 4,
  },
});