import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { Cola } from '../estructuras/Cola';
import { Pila } from '../estructuras/Pila';
import type { Plato } from '../datos/platos';

export type Usuario = { nombre: string; rol: 'cocina' };

export type ItemCarrito = { plato: Plato; cantidad: number };

export type Pedido = {
  numero: number;
  items: ItemCarrito[];
  nota: string;
  total: number;
  hora: string;
};

/** Usuario y clave fijos del personal de cocina, pedidos en el enunciado. */
export const CREDENCIALES = { usuario: 'cocina', clave: 'ipf2026' };

type ValorComedor = {
  // Sesión
  usuario: Usuario | null;
  conSesion: boolean;
  iniciarSesion: (nombre: string, clave: string) => boolean;
  cerrarSesion: () => void;

  // Carrito. La pila de deshacer es la única fuente de verdad.
  items: ItemCarrito[];
  cantidadTotal: number;
  total: number;
  agregarAlCarrito: (plato: Plato) => void;
  deshacerUltimo: () => Plato | undefined;
  vaciarCarrito: () => void;
  puedeDeshacer: boolean;

  // Nota para la cocina
  nota: string;
  setNota: (nota: string) => void;

  // Cola de pedidos (FIFO): el primero que confirma es el primero que se atiende
  colaPedidos: Cola<Pedido>;
  pedidosEnEspera: number;
  confirmarPedido: () => Pedido | undefined;
  pedidoDelFrente: Pedido | undefined;
  atenderSiguiente: () => Pedido | undefined;

  // Pila de pedidos ya atendidos (LIFO): del tope a la base
  pilaAtendidos: Pila<Pedido>;
  atendidos: Pedido[];

  // Consultas del turno
  pedidosAdelante: (numero: number) => number;
  minutosDeEspera: (numero: number) => number;
};

const ContextoComedor = createContext<ValorComedor | null>(null);

/** Minutos que tarda la cocina en promedio cada pedido (desafío opcional). */
const MINUTOS_POR_PEDIDO = 3;

export function ProveedorComedor({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nota, setNota] = useState('');
  const [version, setVersion] = useState(0);

  // Estructuras propias: se crean una sola vez y viven mientras la app viva.
  const pilaDeshacer = useRef(new Pila<Plato>()).current;
  const colaPedidos = useRef(new Cola<Pedido>()).current;
  const pilaAtendidos = useRef(new Pila<Pedido>()).current;
  const ultimoNumero = useRef(0);

  /** Avisa a React que las estructuras mutaron, para que vuelva a renderizar. */
  const refrescar = useCallback(() => setVersion((v) => v + 1), []);

  // El carrito se arma agrupando la pila de acciones: cada push es un alta.
  const items = useMemo<ItemCarrito[]>(() => {
    const agrupado = new Map<number, ItemCarrito>();

    for (const plato of pilaDeshacer.aArray()) {
      const actual = agrupado.get(plato.id);
      if (actual) {
        agrupado.set(plato.id, { plato, cantidad: actual.cantidad + 1 });
      } else {
        agrupado.set(plato.id, { plato, cantidad: 1 });
      }
    }

    return [...agrupado.values()];
  }, [version]);

  const total = useMemo(
    () => items.reduce((suma, item) => suma + item.plato.precio * item.cantidad, 0),
    [items]
  );

  const cantidadTotal = useMemo(
    () => items.reduce((suma, item) => suma + item.cantidad, 0),
    [items]
  );

  const pedidosEnEspera = useMemo(() => colaPedidos.tamanio, [version]);

  const pedidoDelFrente = useMemo(() => colaPedidos.frente(), [version]);

  /** Del tope a la base: el último atendido primero. */
  const atendidos = useMemo(() => pilaAtendidos.aArray().reverse(), [version]);

  const iniciarSesion = useCallback((nombre: string, clave: string) => {
    const ok = nombre.trim() === CREDENCIALES.usuario && clave === CREDENCIALES.clave;
    if (ok) setUsuario({ nombre, rol: 'cocina' });
    return ok;
  }, []);

  const cerrarSesion = useCallback(() => setUsuario(null), []);

  const agregarAlCarrito = useCallback(
    (plato: Plato) => {
      pilaDeshacer.push(plato);
      refrescar();
    },
    [refrescar]
  );

  /** Pop de la pila: saca el último plato agregado y lo devuelve. */
  const deshacerUltimo = useCallback(() => {
    const quitado = pilaDeshacer.pop();
    if (quitado) refrescar();
    return quitado;
  }, [refrescar]);

  const vaciarCarrito = useCallback(() => {
    pilaDeshacer.vaciar();
    setNota('');
    refrescar();
  }, [refrescar]);

  /** Asigna número correlativo, encola el pedido y limpia el carrito. */
  const confirmarPedido = useCallback(() => {
    const resumen = items.reduce(
      (lista, item) => [
        ...lista,
        { plato: item.plato, cantidad: item.cantidad },
      ],
      [] as ItemCarrito[]
    );

    if (resumen.length === 0) return undefined;

    ultimoNumero.current += 1;

    const pedido: Pedido = {
      numero: ultimoNumero.current,
      items: resumen,
      nota: nota.trim(),
      total,
      hora: new Date().toLocaleTimeString('es-PY', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    colaPedidos.encolar(pedido);
    pilaDeshacer.vaciar();
    setNota('');
    refrescar();

    return pedido;
  }, [items, nota, total, refrescar]);

  /** Desencola el pedido del frente y lo apila en la pila de atendidos. */
  const atenderSiguiente = useCallback(() => {
    const pedido = colaPedidos.desencolar();
    if (!pedido) return undefined;

    pilaAtendidos.push(pedido);
    refrescar();
    return pedido;
  }, [refrescar]);

  /** Cuántos pedidos tiene la cocina por delante de ese número de turno. */
  const pedidosAdelante = useCallback(
    (numero: number) => {
      const enFila = colaPedidos.aArray();
      return enFila.filter((pedido) => pedido.numero < numero).length;
    },
    [version]
  );

  const minutosDeEspera = useCallback(
    (numero: number) => pedidosAdelante(numero) * MINUTOS_POR_PEDIDO,
    [pedidosAdelante]
  );

  const valor = useMemo<ValorComedor>(
    () => ({
      usuario,
      conSesion: usuario !== null,
      iniciarSesion,
      cerrarSesion,
      items,
      cantidadTotal,
      total,
      agregarAlCarrito,
      deshacerUltimo,
      vaciarCarrito,
      puedeDeshacer: !pilaDeshacer.vacia,
      nota,
      setNota,
      colaPedidos,
      pedidosEnEspera,
      confirmarPedido,
      pedidoDelFrente,
      atenderSiguiente,
      pilaAtendidos,
      atendidos,
      pedidosAdelante,
      minutosDeEspera,
    }),
    [
      usuario,
      iniciarSesion,
      cerrarSesion,
      items,
      cantidadTotal,
      total,
      agregarAlCarrito,
      deshacerUltimo,
      vaciarCarrito,
      nota,
      pedidosEnEspera,
      confirmarPedido,
      pedidoDelFrente,
      atenderSiguiente,
      atendidos,
      pedidosAdelante,
      minutosDeEspera,
      version,
    ]
  );

  return <ContextoComedor.Provider value={valor}>{children}</ContextoComedor.Provider>;
}

/** Acceso al estado global. Solo se usa dentro del ProveedorComedor. */
export function useComedor(): ValorComedor {
  const valor = useContext(ContextoComedor);
  if (!valor) {
    throw new Error('useComedor se usó fuera del ProveedorComedor del layout raíz');
  }
  return valor;
}