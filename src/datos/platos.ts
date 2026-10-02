import type { Categoria } from '../tema/colores';

export type Plato = {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: Categoria;
  emoji: string;
};

/** 18 platos repartidos en las cuatro categorías del menú. */
export const PLATOS: Plato[] = [
  // Desayuno
  {
    id: 1,
    nombre: 'Chipá completo',
    precio: 6500,
    descripcion: 'Chipá casero con huevo frito, jamón y queso. Se arma apenas se pide.',
    categoria: 'desayuno',
    emoji: '🧀',
  },
  {
    id: 2,
    nombre: 'Tostado de jamón y queso',
    precio: 4500,
    descripcion: 'Pan de molde bien tostado con jamón cocido y queso a la plancha.',
    categoria: 'desayuno',
    emoji: '🥪',
  },
  {
    id: 3,
    nombre: 'Medialunas con dulce',
    precio: 2000,
    descripcion: 'Docena de medialunas recién horneadas para compartir con el mate.',
    categoria: 'desayuno',
    emoji: '🥐',
  },
  {
    id: 4,
    nombre: 'Milanesas con papas',
    precio: 8500,
    descripcion: 'Milanesa de pollo con guarnición de papas fritas y ensalada.',
    categoria: 'desayuno',
    emoji: '🍗',
  },

  // Almuerzo
  {
    id: 5,
    nombre: 'Mandioca guisada',
    precio: 7000,
    descripcion: 'La especialidad de la casa: mandioca cocida con carne y verduras.',
    categoria: 'almuerzo',
    emoji: '🍲',
  },
  {
    id: 6,
    nombre: 'Empanadas criollas',
    precio: 3500,
    descripcion: 'Tres empanadas de carne fritas al momento. Relleno generoso.',
    categoria: 'almuerzo',
    emoji: '🥟',
  },
  {
    id: 7,
    nombre: 'Arroz con pollo al horno',
    precio: 7800,
    descripcion: 'Arroz perfumado con pollo al horno, ensalada de lechuga y tomate.',
    categoria: 'almuerzo',
    emoji: '🍚',
  },
  {
    id: 8,
    nombre: 'Lombarra completa',
    precio: 9000,
    descripcion: 'Lombarba con huevo, tomate y palta. Incluye papas fritas.',
    categoria: 'almuerzo',
    emoji: '🥖',
  },
  {
    id: 9,
    nombre: 'Ñoquis de verdura',
    precio: 6800,
    descripcion: 'Ñoquis caseros de verdura con salsa blanca y queso rallado.',
    categoria: 'almuerzo',
    emoji: '🍝',
  },
  {
    id: 10,
    nombre: 'Milanesa napolitana',
    precio: 9200,
    descripcion: 'Milanesa con muzarela al horno, salsa y fideos.',
    categoria: 'almuerzo',
    emoji: '🍝',
  },

  // Bebidas
  {
    id: 11,
    nombre: 'Mate cocido',
    precio: 2500,
    descripcion: 'Mate en tereré con agua caliente, ideal para la mañana.',
    categoria: 'bebidas',
    emoji: '🧉',
  },
  {
    id: 12,
    nombre: 'Café con leche',
    precio: 3000,
    descripcion: 'Café espresso de la casa con leche. Se puede llevar en vaso.',
    categoria: 'bebidas',
    emoji: '☕',
  },
  {
    id: 13,
    nombre: 'Jugo de naranja natural',
    precio: 4000,
    descripcion: 'Exprimido al momento, sin azúcar agregada.',
    categoria: 'bebidas',
    emoji: '🍊',
  },
  {
    id: 14,
    nombre: 'Agua mineral 500ml',
    precio: 1800,
    descripcion: 'Botella de agua mineral sin gas, bien fría.',
    categoria: 'bebidas',
    emoji: '💧',
  },

  // Kiosco
  {
    id: 15,
    nombre: 'Empanada de palma',
    precio: 3000,
    descripcion: 'Relleno de palmera y naranja, muy dulce. El clásico del recreo.',
    categoria: 'kiosco',
    emoji: '🥮',
  },
  {
    id: 16,
    nombre: 'Alfajor de chocolate',
    precio: 2200,
    descripcion: 'Alfajor con dulce de leche y chocolate amargo.',
    categoria: 'kiosco',
    emoji: '🍫',
  },
  {
    id: 17,
    nombre: 'Galletitas de agua',
    precio: 1200,
    descripcion: 'Paquete de galletitas simples, el de siempre del kiosco.',
    categoria: 'kiosco',
    emoji: '🍪',
  },
  {
    id: 18,
    nombre: 'Biscuit de manteca',
    precio: 1500,
    descripcion: 'Biscuits suecos con manteca y azúcar glass.',
    categoria: 'kiosco',
    emoji: '🥨',
  },
];

/** Busca un plato por id. Ojo: el id puede llegar como texto desde la URL. */
export function buscarPlato(id: string | number | undefined): Plato | undefined {
  if (id === undefined) return undefined;
  const numero = Number(id);
  if (Number.isNaN(numero)) return undefined;
  return PLATOS.find((plato) => plato.id === numero);
}

/** Filtra los platos de una categoría. */
export function platosDeCategoria(categoria: string): Plato[] {
  return PLATOS.filter((plato) => plato.categoria === categoria);
}

/** ¿La categoría existe en el menú? */
export function esCategoriaValida(categoria: string): boolean {
  return PLATOS.some((plato) => plato.categoria === categoria);
}

/** Busca por texto (nombre o descripción) y, si se pasa, por categoría. */
export function buscarPlatos(texto: string, categoria?: string): Plato[] {
  const normalizado = texto.trim().toLowerCase();

  return PLATOS.filter((plato) => {
    const coincideCategoria = !categoria || plato.categoria === categoria;
    if (!coincideCategoria) return false;
    if (!normalizado) return true;

    return (
      plato.nombre.toLowerCase().includes(normalizado) ||
      plato.descripcion.toLowerCase().includes(normalizado)
    );
  });
}

/** Formatea un precio a pesos con separador de miles. */
export function formatearPrecio(precio: number): string {
  return `Gs. ${precio.toLocaleString('es-PY')}`;
}