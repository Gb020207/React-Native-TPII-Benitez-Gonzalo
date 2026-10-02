import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';

import { colores } from '../tema/colores';

type Props = {
  emoji: string;
  titulo: string;
  descripcion: string;
  href: Href;
};

/** Tarjeta de acceso rápido de la pantalla de Inicio. */
export function TarjetaAcceso({ emoji, titulo, descripcion, href }: Props) {
  return (
    <Link href={href} asChild>
      <View style={estilos.tarjeta}>
        <Text style={estilos.emoji}>{emoji}</Text>
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.descripcion}>{descripcion}</Text>
        <Text style={estilos.flecha}>Abrir →</Text>
      </View>
    </Link>
  );
}

/** Bloque informativo con ícono verde. */
export function Info({ emoji, titulo, children }: { emoji: string; titulo: string; children?: React.ReactNode }) {
  return (
    <View style={estilos.info}>
      <Text style={estilos.infoEmoji}>{emoji}</Text>
      <View style={estilos.infoCuerpo}>
        <Text style={estilos.infoTitulo}>{titulo}</Text>
        {children}
      </View>
    </View>
  );
}

/** Mensaje para cuando no hay nada que mostrar. */
export function Vacio({ emoji, titulo, detalle }: { emoji: string; titulo: string; detalle: string }) {
  return (
    <View style={estilos.vacio}>
      <Text style={estilos.vacioEmoji}>{emoji}</Text>
      <Text style={estilos.vacioTitulo}>{titulo}</Text>
      <Text style={estilos.vacioDetalle}>{detalle}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
    gap: 4,
  },
  emoji: {
    fontSize: 30,
  },
  titulo: {
    fontSize: 17,
    fontWeight: '700',
    color: colores.verde,
  },
  descripcion: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  flecha: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    color: colores.verdeVivo,
  },
  info: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colores.verdeSuave,
  },
  infoEmoji: {
    fontSize: 24,
  },
  infoCuerpo: {
    flex: 1,
    gap: 2,
  },
  infoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.verde,
  },
  vacio: {
    alignItems: 'center',
    gap: 6,
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
  },
  vacioEmoji: {
    fontSize: 40,
  },
  vacioTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.texto,
  },
  vacioDetalle: {
    fontSize: 13,
    color: colores.textoSuave,
    textAlign: 'center',
  },
});