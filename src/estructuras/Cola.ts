/**
 * Cola genérica (FIFO) SIN usar Array.shift().
 *
 * Es la estructura con la que la cocina atiende los pedidos: el primero que
 * entra es el primero que sale, así que nadie puede "colarse".
 *
 * La versión de clase usaba shift(), que es O(n) porque al quitar el primer
 * elemento tiene que correr todos los demás un lugar. Acá se guarda un índice
 * del frente (#frente) y se avanza: encolar y desencolar son O(1).
 */
export class Cola<T> {
  /** Array interno. Las posiciones anteriores a #frente ya se Consumieron. */
  #items: T[] = [];

  /** Índice del primer elemento pendiente. Es el "frente" de la fila. */
  #frente = 0;

  /** Agrega un elemento al final de la fila. */
  encolar(x: T): void {
    this.#items.push(x);
  }

  /** Saca y devuelve el elemento del frente. Devuelve undefined si estaba vacía. */
  desencolar(): T | undefined {
    if (this.vacia) return undefined;

    const valor = this.#items[this.#frente] as T;
    this.#frente++;
    this.#compactar();

    return valor;
  }

  /** Mira el elemento del frente sin sacarlo. */
  frente(): T | undefined {
    if (this.vacia) return undefined;
    return this.#items[this.#frente];
  }

  /** ¿Queda alguien en la fila? */
  get vacia(): boolean {
    return this.#frente >= this.#items.length;
  }

  /** Cantidad de gente en la fila. */
  get tamanio(): number {
    return this.#items.length - this.#frente;
  }

  /** Devuelve una COPIA de lo que falta, de frente a final. */
  aArray(): T[] {
    return this.#items.slice(this.#frente);
  }

  /** Vacía la fila por completo. */
  vaciar(): void {
    this.#items = [];
    this.#frente = 0;
  }

  /**
   * Recorta el array cuando el frente ya comió mucho espacio.
   * Con poca cantidad de pedidos no hace falta y se lo saltea.
   */
  #compactar(): void {
    if (this.#frente > 32 && this.#frente * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#frente);
      this.#frente = 0;
    }
  }
}