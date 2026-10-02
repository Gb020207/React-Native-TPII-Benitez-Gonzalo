/**
 * Pila genérica (LIFO).
 *
 * Es la estructura que usan dos cosas de la app:
 *  - el historial de pantallas de un Stack de Expo Router,
 *  - la pila de acciones del carrito ("Deshacer último") y la de pedidos ya atendidos.
 *
 * El array interno es un campo privado (#items): nadie de afuera puede
 * tocarlo y meterse en la fila sin pasar por push/pop.
 */
export class Pila<T> {
  /** Almacenamiento interno. Privado a propósito: se manipula solo por la API. */
  #items: T[] = [];

  /** Apila un elemento en el tope. */
  push(x: T): void {
    this.#items.push(x);
  }

  /** Saca y devuelve el elemento del tope. Devuelve undefined si estaba vacía. */
  pop(): T | undefined {
    return this.#items.pop();
  }

  /** Mira el elemento del tope sin sacarlo. Devuelve undefined si estaba vacía. */
  tope(): T | undefined {
    return this.#items.at(-1);
  }

  /** ¿Queda algo en la pila? */
  get vacia(): boolean {
    return this.#items.length === 0;
  }

  /** Cantidad de elementos apilados. */
  get tamanio(): number {
    return this.#items.length;
  }

  /** Devuelve una COPIA del contenido, de base a tope. */
  aArray(): T[] {
    return [...this.#items];
  }

  /** Vacía la pila por completo. */
  vaciar(): void {
    this.#items = [];
  }
}