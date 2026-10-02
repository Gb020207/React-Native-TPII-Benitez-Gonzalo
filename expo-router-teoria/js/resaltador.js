/* =========================================================================
   Resaltador de sintaxis mínimo (TSX / JS / JSON / Bash).
   Convierte cada <script type="text/plain" data-codigo="tsx"> en un bloque
   de código coloreado. Sin dependencias: funciona sin internet.
   ========================================================================= */
(function () {
  const escapar = (texto) =>
    texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const envolver = (clase, texto) => `<span class="tk-${clase}">${escapar(texto)}</span>`;

  const PALABRAS = new Set([
    'import', 'from', 'export', 'default', 'function', 'return', 'const', 'let', 'var',
    'if', 'else', 'type', 'async', 'await', 'new', 'class', 'extends', 'while', 'for',
    'of', 'in', 'this', 'get', 'set', 'static', 'typeof', 'as',
  ]);
  const LITERALES = new Set(['true', 'false', 'null', 'undefined']);

  const REGLAS_JS = new RegExp(
    [
      /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/.source, // 1 comentario
      /('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`)/.source, // 2 texto
      /(<\/?)([A-Za-z][\w.]*)/.source, // 3-4 etiqueta JSX
      /(\b\d+(?:\.\d+)?\b)/.source, // 5 número
      /(#?[A-Za-z_$][\w$]*)/.source, // 6 identificador
    ].join('|'),
    'g',
  );

  function resaltarJS(codigo, esJSON) {
    let salida = '';
    let ultimo = 0;
    REGLAS_JS.lastIndex = 0;
    let m;

    while ((m = REGLAS_JS.exec(codigo))) {
      salida += escapar(codigo.slice(ultimo, m.index));
      ultimo = m.index + m[0].length;
      const siguiente = codigo.slice(ultimo).match(/^\s*(.)/)?.[1];

      if (m[1]) {
        salida += envolver('com', m[1]);
      } else if (m[2]) {
        salida += envolver(esJSON && siguiente === ':' ? 'attr' : 'str', m[2]);
      } else if (m[4]) {
        salida += escapar(m[3]) + envolver('tag', m[4]);
      } else if (m[5]) {
        salida += envolver('num', m[5]);
      } else if (m[6]) {
        const id = m[6];
        const inmediato = codigo[ultimo];
        if (PALABRAS.has(id)) salida += envolver('kw', id);
        else if (LITERALES.has(id)) salida += envolver('lit', id);
        else if (inmediato === '(') salida += envolver('fn', id);
        else if (inmediato === '=' && codigo[ultimo + 1] !== '=' && codigo[ultimo + 1] !== '>')
          salida += envolver('attr', id);
        else if (/^[A-Z]/.test(id)) salida += envolver('tipo', id);
        else salida += escapar(id);
      }
    }
    return salida + escapar(codigo.slice(ultimo));
  }

  function resaltarBash(codigo) {
    return codigo
      .split('\n')
      .map((linea) => {
        if (/^\s*#/.test(linea)) return envolver('com', linea);
        return linea.replace(
          /^(\$ )?(\S+)(.*)$/,
          (_, prompt, comando, resto) =>
            (prompt ? envolver('prompt', prompt) : '') +
            envolver('fn', comando) +
            escapar(resto).replace(/(\s)(--?[\w-]+)/g, '$1<span class="tk-attr">$2</span>'),
        );
      })
      .join('\n');
  }

  /** Árbol de carpetas: carpetas en azul y lo que sigue a "→" como comentario. */
  function resaltarArbol(codigo) {
    return codigo
      .split('\n')
      .map((linea) => {
        const [archivo, nota] = linea.split('→');
        const base = escapar(archivo).replace(
          /([\w()[\].+-]+\/)/g,
          '<span class="tk-tag">$1</span>',
        );
        return nota === undefined ? base : base + envolver('com', '→' + nota);
      })
      .join('\n');
  }

  /** Quita la sangría común para poder indentar el código dentro del HTML. */
  function limpiarSangria(texto) {
    const lineas = texto.replace(/^\n+|\s+$/g, '').split('\n');
    const sangria = Math.min(
      ...lineas.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length),
    );
    return lineas.map((l) => l.slice(sangria)).join('\n');
  }

  window.resaltarCodigo = function (raiz = document) {
    raiz.querySelectorAll('script[type="text/plain"][data-codigo]').forEach((script) => {
      const lenguaje = script.dataset.codigo;
      const codigo = limpiarSangria(script.textContent);

      const figura = document.createElement('figure');
      figura.className = 'codigo';
      if (script.dataset.clase) figura.classList.add(...script.dataset.clase.split(' '));

      if (script.dataset.archivo) {
        const cabecera = document.createElement('figcaption');
        cabecera.className = 'codigo-archivo';
        cabecera.textContent = script.dataset.archivo;
        figura.append(cabecera);
      }

      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.innerHTML =
        lenguaje === 'bash'
          ? resaltarBash(codigo)
          : lenguaje === 'arbol'
            ? resaltarArbol(codigo)
            : resaltarJS(codigo, lenguaje === 'json');
      pre.append(code);
      figura.append(pre);
      script.replaceWith(figura);
    });
  };
})();
