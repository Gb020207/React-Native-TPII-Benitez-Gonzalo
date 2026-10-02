import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { Boton } from '../componentes/Boton';
import { DondeEstoy } from '../componentes/DondeEstoy';
import { CREDENCIALES, useComedor } from '../contexto/ComedorContext';
import { colores } from '../tema/colores';

/**
 * Ingreso del personal de cocina. URL: /login
 *
 * Está dentro de un Stack.Protected con guard={!conSesion} en el layout raíz:
 * si ya hay sesión, esta ruta directamente no existe. Por eso después de
 * iniciar sesión no hay que llamar a router.back(): el guard cambia a false,
 * el navegador saca la pantalla del historial y el modal se cierra solo.
 */
export default function Login() {
  const { iniciarSesion, conSesion } = useComedor();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);

  // La navegación va en un efecto y no dentro del onPress a propósito:
  // iniciarSesion recién setea el estado, y si se navegara en el mismo
  // click el guard todavía estaría en false y /cocina no existiría todavía.
  // Esperando al efecto, /login ya fue retirado del navegador.
  useEffect(() => {
    if (conSesion) {
      router.replace('/cocina');
    }
  }, [conSesion]);

  const ingresar = () => {
    const ok = iniciarSesion(usuario, clave);

    if (!ok) {
      setError('Usuario o clave incorrectos.');
      return;
    }

    setError(null);
  };

  return (
    <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
      <Text style={estilos.emoji}>🧑‍🍳</Text>
      <Text style={estilos.titulo}>Cocina</Text>
      <Text style={estilos.subtitulo}>Ingresá con tu usuario para atender los pedidos.</Text>

      <View style={estilos.formulario}>
        <Text style={estilos.etiqueta}>Usuario</Text>
        <TextInput
          style={estilos.entrada}
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          placeholder="cocina"
          placeholderTextColor={colores.textoSuave}
        />

        <Text style={estilos.etiqueta}>Clave</Text>
        <TextInput
          style={estilos.entrada}
          value={clave}
          onChangeText={setClave}
          secureTextEntry
          placeholder="••••••"
          placeholderTextColor={colores.textoSuave}
        />

        {error ? <Text style={estilos.error}>{error}</Text> : null}

        <Boton titulo="Ingresar" icono="🔓" onPress={ingresar} estilo={estilos.boton} />
        <Boton titulo="Cancelar" tipo="secundario" onPress={() => router.back()} />
      </View>

      <Text style={estilos.pista}>
        Usuario: {CREDENCIALES.usuario} · Clave: {CREDENCIALES.clave}
      </Text>

      <DondeEstoy />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    padding: 24,
    gap: 10,
    paddingBottom: 32,
  },
  emoji: {
    fontSize: 56,
    textAlign: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: colores.verde,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: colores.textoSuave,
    textAlign: 'center',
    marginBottom: 8,
  },
  formulario: {
    gap: 8,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '700',
    color: colores.texto,
    marginTop: 6,
  },
  entrada: {
    borderWidth: 2,
    borderColor: colores.borde,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colores.texto,
    backgroundColor: colores.blanco,
  },
  error: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: colores.error,
  },
  boton: {
    marginTop: 12,
  },
  pista: {
    textAlign: 'center',
    fontSize: 12,
    color: colores.textoSuave,
  },
});