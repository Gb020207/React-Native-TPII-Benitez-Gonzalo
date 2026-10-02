import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { colores } from '../tema/colores';

type Props = {
  titulo: string;
  onPress: () => void;
  tipo?: 'principal' | 'secundario' | 'peligro';
  deshabilitado?: boolean;
  cargando?: boolean;
  icono?: string;
  estilo?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * Botón propio con el verde y blanco de la app.
 *
 * Existe como componente separado por dos motivos:
 *  1. se puede usar dentro de un <Link asChild> sin tripping el warning
 *     "You are passing an array of styles to a child of <Slot>", porque acá
 *     el style se arma adentro con StyleSheet y nunca llega como array;
 *  2. todos los botones de la app se ven iguales.
 */
export function Boton({
  titulo,
  onPress,
  tipo = 'principal',
  deshabilitado = false,
  cargando = false,
  icono,
  estilo,
  children,
}: Props) {
  const inactivo = deshabilitado || cargando;
  const paleta = PALETAS[tipo];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo }}
      disabled={inactivo}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        { backgroundColor: paleta.fondo, borderColor: paleta.borde },
        pressed && !inactivo ? estilos.presionado : null,
        inactivo ? estilos.inactivo : null,
        estilo,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={paleta.texto} />
      ) : (
        <>
          {icono ? <Text style={estilos.icono}>{icono}</Text> : null}
          <Text style={[estilos.texto, { color: paleta.texto }]}>{titulo}</Text>
          {children}
        </>
      )}
    </Pressable>
  );
}

const PALETAS = {
  principal: { fondo: colores.verde, borde: colores.verde, texto: colores.blanco },
  secundario: {
    fondo: colores.blanco,
    borde: colores.verde,
    texto: colores.verde,
  },
  peligro: { fondo: colores.error, borde: colores.error, texto: colores.blanco },
} as const;

const estilos = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  presionado: {
    opacity: 0.8,
  },
  inactivo: {
    opacity: 0.45,
  },
  texto: {
    fontSize: 16,
    fontWeight: '700',
  },
  icono: {
    fontSize: 16,
  },
});