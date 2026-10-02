export type ArticuloAyuda = {
  /** Ruta dentro de /ayuda, sin la barra inicial. */
  slug: string[];
  titulo: string;
  resumen: string;
  contenido: string[];
};

/** Artículos de ayuda con profundidad variable, para el catch-all [...slug]. */
export const ARTICULOS_AYUDA: ArticuloAyuda[] = [
  {
    slug: ['horarios'],
    titulo: 'Horarios de atención',
    resumen: 'Cuándo abre y cierra el comedor.',
    contenido: [
      'Lunes a viernes: de 07:00 a 15:00.',
      'Sábados: de 08:00 a 13:00.',
      'Domingos: cerrado.',
      'El último pedido se toma 30 minutos antes del cierre.',
    ],
  },
  {
    slug: ['pagos', 'efectivo'],
    titulo: 'Pago en efectivo',
    resumen: 'Cómo pagar con guaraníes.',
    contenido: [
      'Se acepta efectivo en la caja del comedor.',
      'No hace falta tener cambio, pero conviene.',
      'El pago se hace al retirar el pedido, no al confirmar.',
    ],
  },
  {
    slug: ['pagos', 'tarjeta'],
    titulo: 'Pago con tarjeta',
    resumen: 'Tarjetas de débito y de crédito.',
    contenido: [
      'Se aceptan tarjetas de débito y de crédito.',
      'El posnet está en la caja, al lado de la pantalla de pedidos.',
      'No se aceptan transferencias desde la app.',
    ],
  },
  {
    slug: ['pedidos', 'turno'],
    titulo: 'Cómo funciona el número de turno',
    resumen: 'La cocina atiende en orden de llegada.',
    contenido: [
      'Cada pedido confirmado recibe un número correlativo.',
      'La cocina atiende siempre al pedido que tiene el número más bajo.',
      'Nadie puede colarse: el orden lo define la fila de espera.',
    ],
  },
  {
    slug: ['pedidos', 'cancelar'],
    titulo: 'Cancelar un pedido',
    resumen: 'Todavía se puede cancelar mientras no te atiendan.',
    contenido: [
      'Mientras estés en el carrito, tocá "Deshacer último" para sacar el último plato.',
      'Una vez confirmado, el pedido entra en la cola: pedile a la cocina que lo cancele.',
    ],
  },
];

/** Busca un artículo por sus segmentos de ruta. */
export function buscarArticulo(slug: string[]): ArticuloAyuda | undefined {
  const clave = slug.join('/');
  return ARTICULOS_AYUDA.find((articulo) => articulo.slug.join('/') === clave);
}

/** Rutas de ejemplo que se muestran en el índice de /ayuda. */
export const EJEMPLOS_AYUDA = ARTICULOS_AYUDA.map((articulo) => ({
  href: `/ayuda/${articulo.slug.join('/')}`,
  titulo: articulo.titulo,
}));