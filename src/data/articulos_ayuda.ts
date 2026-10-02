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
      'Lunes a viernes: 07:00 a 15:00.',
      'Sábado: 08:00 a 13:00.',
      'Domingo: cerrado.',
      'El último pedido se toma 30 minutos antes del cierre.',
    ],
  },
  {
    slug: ['pagos', 'efectivo'],
    titulo: 'Pago en efectivo',
    resumen: 'Cómo pagar con guaraníes.',
    contenido: [
      'Se acepta efectivo en la caja del comedor.',
      'No hace falta tener cambio: hay que Gleer con el monto justo si podés.',
      'El pago se hace al retirar el pedido, no al confirmar.',
    ],
  },
  {
    slug: ['pagos', 'tarjeta'],
    titulo: 'Pago con tarjeta',
    resumen: 'Tarjetas de débito y crédito.',
    contenido: [
      'Se aceptan tarjetas de débito y crédito.',
      'El posnet está en la caja, al lado de la pantalla de pedidos.',
      'No se acceptan pagos por transferencia desde la app.',
    ],
  },
  {
    slug: ['pedidos', 'turno'],
    titulo: 'Cómo funciona el número de turno',
    resumen: 'La cocina atiende en orden de llegada.',
    contenido: [
      'Cada pedido confirmado recibe un número correlativo.',
      'La cocina atiende siempre al pedido con el número más bajo.',
      'Nadie puede "colarse": el orden lo define la fila de espera, no la hora del link.',
    ],
  },
  {
    slug: ['pedidos', 'cancelar'],
    titulo: 'Cancelar un pedido',
    resumen: 'Todavía podés cancelar mientras no te atiendan.',
    contenido: [
      'Abrí tu pedido desde el carrito antes de confirmar y tocá "Deshacer último".',
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