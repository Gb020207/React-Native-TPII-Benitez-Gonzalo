/**
 * Paleta de la app: verde y blanco.
 * Todo el color de la interfaz sale de acá para que el diseño sea parejo.
 */
export const colores = {
  /** Verde principal: barras, botones, títulos. */
  verde: '#1B5E20',
  /** Verde un poco más claro, para acentos y estados activos. */
  verdeClaro: '#2E7D32',
  /** Verde de apoyo para íconos. */
  verdeVivo: '#43A047',
  /** Verde muy suave: fondos de tarjetas y pantallas. */
  verdeSuave: '#E8F5E9',
  /** Verde todavía más suave, para filas alternadas. */
  verdeMuySuave: '#F1F8F2',
  /** Bordes suaves. */
  borde: '#C8E6C9',

  /** Blancos. */
  blanco: '#FFFFFF',
  blancoHueso: '#FAFAFA',

  /** Textos. */
  texto: '#12351A',
  textoSuave: '#5C6B5F',
  textoInvertido: '#FFFFFF',

  /** Estados. */
  error: '#C62828',
  errorSuave: '#FDECEA',
  aviso: '#8D6E00',
  avisoSuave: '#FFF8E1',
} as const;

/** Categorías del menú, en el orden en que se muestran. */
export const CATEGORIAS = ['desayuno', 'almuerzo', 'bebidas', 'kiosco'] as const;

export type Categoria = (typeof CATEGORIAS)[number];

/** Nombre y emoji de cada categoría, para pintar los títulos. */
export const INFO_CATEGORIA: Record<Categoria, { titulo: string; emoji: string }> = {
  desayuno: { titulo: 'Desayuno', emoji: '🥐' },
  almuerzo: { titulo: 'Almuerzo', emoji: '🍲' },
  bebidas: { titulo: 'Bebidas', emoji: '🥤' },
  kiosco: { titulo: 'Kiosco', emoji: '🍿' },
};