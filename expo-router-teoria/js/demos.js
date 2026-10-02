/* =========================================================================
   Demos interactivas de la presentación.
   Cada demo se engancha a un elemento con data-demo="nombre".
   ========================================================================= */
(function () {
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
  const DURACION_SALIDA = 320;

  const crear = (etiqueta, clase, texto) => {
    const el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
  };

  /** Anima la salida de un elemento y lo quita del DOM al terminar. */
  const quitarAnimado = (el) => {
    el.classList.add('saliendo');
    setTimeout(() => el.remove(), DURACION_SALIDA);
  };

  /* ---------------------------------------------------------------------
     PILA (LIFO)
     --------------------------------------------------------------------- */
  function demoPila(raiz) {
    const contenedor = $('.dp-contenedor', raiz);
    const consola = $('.consola', raiz);
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const MAXIMO = 6;
    let pila = ['A', 'B', 'C'];
    let siguiente = 3;

    const ficha = (valor) => {
      const el = crear('div', 'ficha');
      el.append(crear('span', '', valor), crear('small', '', 'TOPE'));
      return el;
    };

    pila.forEach((v) => contenedor.append(ficha(v)));
    const mostrar = (texto) => (consola.textContent = `› ${texto}   pila = [${pila.join(', ')}]`);
    const fichasVivas = () => $$('.ficha:not(.saliendo)', contenedor);

    raiz.addEventListener('click', (e) => {
      const accion = e.target.closest('[data-accion]')?.dataset.accion;
      if (!accion) return;

      if (accion === 'push') {
        if (pila.length >= MAXIMO) return mostrar('La pila está llena (máximo 6 para la demo)');
        const valor = letras[siguiente++ % letras.length];
        pila.push(valor);
        const el = ficha(valor);
        el.classList.add('entrando');
        contenedor.append(el);
        mostrar(`push('${valor}')`);
      }

      if (accion === 'pop') {
        if (!pila.length) return mostrar('pop() → undefined (la pila está vacía)');
        const valor = pila.pop();
        quitarAnimado(fichasVivas().at(-1));
        mostrar(`pop() → '${valor}'`);
      }

      if (accion === 'tope') {
        const el = fichasVivas().at(-1);
        if (!el) return mostrar('tope() → undefined');
        el.classList.remove('destello');
        void el.offsetWidth;
        el.classList.add('destello');
        mostrar(`tope() → '${pila.at(-1)}' (no lo saca)`);
      }
    });
  }

  /* ---------------------------------------------------------------------
     COLA (FIFO)
     --------------------------------------------------------------------- */
  function demoCola(raiz) {
    const contenedor = $('.dc-contenedor', raiz);
    const consola = $('.consola', raiz);
    const nombres = ['Dani', 'Eli', 'Fede', 'Gabi', 'Hugo', 'Iara', 'Juan', 'Kari', 'Lu', 'Mati'];
    const MAXIMO = 6;
    let cola = ['Ana', 'Beto', 'Caro'];
    let siguiente = 0;

    const ficha = (valor) => {
      const el = crear('div', 'ficha');
      el.append(crear('span', '', valor), crear('small', '', 'FRENTE'));
      return el;
    };

    cola.forEach((v) => contenedor.append(ficha(v)));
    const mostrar = (texto) => (consola.textContent = `› ${texto}   cola = [${cola.join(', ')}]`);
    const fichasVivas = () => $$('.ficha:not(.saliendo)', contenedor);

    raiz.addEventListener('click', (e) => {
      const accion = e.target.closest('[data-accion]')?.dataset.accion;
      if (!accion) return;

      if (accion === 'encolar') {
        if (cola.length >= MAXIMO) return mostrar('La fila está llena (máximo 6 para la demo)');
        const valor = nombres[siguiente++ % nombres.length];
        cola.push(valor);
        const el = ficha(valor);
        el.classList.add('entrando');
        contenedor.append(el);
        mostrar(`encolar('${valor}')`);
      }

      if (accion === 'desencolar') {
        if (!cola.length) return mostrar('desencolar() → undefined (no hay nadie)');
        const valor = cola.shift();
        quitarAnimado(fichasVivas()[0]);
        mostrar(`desencolar() → '${valor}'`);
      }

      if (accion === 'frente') {
        const el = fichasVivas()[0];
        if (!el) return mostrar('frente() → undefined');
        el.classList.remove('destello');
        void el.offsetWidth;
        el.classList.add('destello');
        mostrar(`frente() → '${cola[0]}' (no lo saca)`);
      }
    });
  }

  /* ---------------------------------------------------------------------
     EXPLORADOR: archivo → URL
     --------------------------------------------------------------------- */
  const ARCHIVOS = [
    { ruta: '_layout.tsx', nivel: 0, tipo: 'Layout', url: '— no es una pantalla —', texto: 'Layout raíz. Define el Stack principal, los providers y las rutas protegidas.' },
    { carpeta: '(tabs)/', nivel: 0 },
    { ruta: '(tabs)/_layout.tsx', nombre: '_layout.tsx', nivel: 1, tipo: 'Layout', url: '— no es una pantalla —', texto: 'Define la barra de pestañas. Cada archivo de (tabs) es una tab.' },
    { ruta: '(tabs)/index.tsx', nombre: 'index.tsx', nivel: 1, tipo: 'Estática', url: '/', texto: 'index es la ruta por defecto de la carpeta, y (tabs) es un grupo: no suma nada a la URL.' },
    { carpeta: 'productos/', nivel: 1 },
    { ruta: '(tabs)/productos/_layout.tsx', nombre: '_layout.tsx', nivel: 2, tipo: 'Layout', url: '— no es una pantalla —', texto: 'Un Stack anidado dentro de la pestaña Productos.' },
    { ruta: '(tabs)/productos/index.tsx', nombre: 'index.tsx', nivel: 2, tipo: 'Estática', url: '/productos', texto: 'El listado. Es el index de la carpeta productos.' },
    { ruta: '(tabs)/productos/[id].tsx', nombre: '[id].tsx', nivel: 2, tipo: 'Dinámica', url: '/productos/3', texto: 'Los corchetes marcan un segmento variable: sirve para /productos/1, /productos/2… El valor llega en useLocalSearchParams().' },
    { ruta: '(tabs)/perfil.tsx', nombre: 'perfil.tsx', nivel: 1, tipo: 'Estática', url: '/perfil', texto: 'Pestaña Perfil. El grupo (tabs) no aparece en la URL.' },
    { carpeta: 'pila/', nivel: 0 },
    { ruta: 'pila/[nivel].tsx', nombre: '[nivel].tsx', nivel: 1, tipo: 'Dinámica', url: '/pila/2', texto: 'Demo de la pila de navegación. No tiene _layout propio: se apila en el Stack raíz.' },
    { carpeta: 'docs/', nivel: 0 },
    { ruta: 'docs/[...slug].tsx', nombre: '[...slug].tsx', nivel: 1, tipo: 'Catch-all', url: '/docs/guia/rutas', texto: 'Los tres puntos capturan uno o más segmentos: slug = ["guia", "rutas"].' },
    { ruta: 'buscar.tsx', nivel: 0, tipo: 'Con query params', url: '/buscar?q=mate', texto: 'Lo que va después del ? no necesita corchetes: se lee con useLocalSearchParams().' },
    { ruta: 'modal.tsx', nivel: 0, tipo: 'Modal', url: '/modal', texto: 'Pantalla común del Stack con presentation: "modal" en el layout raíz.' },
    { carpeta: 'privado/', nivel: 0 },
    { ruta: 'privado/index.tsx', nombre: 'index.tsx', nivel: 1, tipo: 'Protegida', url: '/privado', texto: 'Solo existe cuando hay sesión, gracias a <Stack.Protected guard={conSesion}>.' },
    { ruta: '+not-found.tsx', nivel: 0, tipo: 'Especial', url: '/cualquier-cosa-inexistente', texto: 'El + indica archivo especial: se muestra cuando ninguna ruta coincide.' },
  ];

  function demoExplorador(raiz) {
    const arbol = $('.arbol', raiz);
    const tipo = $('.detalle-tipo', raiz);
    const url = $('.detalle-url', raiz);
    const texto = $('.detalle-texto', raiz);

    const raizCarpeta = crear('li');
    const btnRaiz = crear('button', 'carpeta');
    btnRaiz.append(crear('span', 'icono', '▾'), document.createTextNode('src/app/'));
    btnRaiz.tabIndex = -1;
    raizCarpeta.append(btnRaiz);
    arbol.append(raizCarpeta);

    const seleccionar = (archivo, boton) => {
      $$('button[aria-pressed]', arbol).forEach((b) => b.setAttribute('aria-pressed', 'false'));
      boton.setAttribute('aria-pressed', 'true');
      tipo.textContent = archivo.tipo;
      url.textContent = archivo.url;
      texto.textContent = archivo.texto;
      url.animate?.([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], {
        duration: 250,
        easing: 'ease-out',
      });
    };

    ARCHIVOS.forEach((archivo) => {
      const li = crear('li');
      const boton = crear('button');
      boton.style.setProperty('--nivel', archivo.nivel + 1);

      if (archivo.carpeta) {
        boton.className = 'carpeta';
        boton.tabIndex = -1;
        boton.append(crear('span', 'icono', '▾'), document.createTextNode(archivo.carpeta));
      } else {
        boton.setAttribute('aria-pressed', 'false');
        boton.append(crear('span', 'icono', '·'), document.createTextNode(archivo.nombre ?? archivo.ruta));
        boton.addEventListener('click', () => seleccionar(archivo, boton));
      }
      li.append(boton);
      arbol.append(li);
    });

    const inicial = ARCHIVOS.findIndex((a) => a.ruta === '(tabs)/productos/[id].tsx');
    seleccionar(ARCHIVOS[inicial], $$('li', arbol)[inicial + 1].firstChild);
  }

  /* ---------------------------------------------------------------------
     SIMULADOR DE STACK
     --------------------------------------------------------------------- */
  function demoStack(raiz) {
    const vistaPila = $('.sim-pila', raiz);
    const titulo = $('.sim-titulo', raiz);
    const atras = $('.sim-atras', raiz);
    const contenido = $('.sim-contenido', raiz);
    const llamada = $('.sim-llamada', raiz);
    const explicacion = $('.sim-explicacion', raiz);

    let clave = 0;
    const pantalla = (ruta, id) => ({ clave: ++clave, ruta, id });
    const url = (p) => (p.ruta === '/productos/[id]' ? `/productos/${p.id}` : p.ruta);
    const nombre = (p) =>
      ({ '/': 'Inicio', '/productos': 'Productos', '/perfil': 'Perfil' })[p.ruta] ?? `Producto ${p.id}`;

    let pila = [pantalla('/'), pantalla('/productos'), pantalla('/productos/[id]', 3)];
    let proximoId = 4;

    function dibujar({ nuevas = [], cambiadas = [], quitadas = [], direccion = 'adelante' } = {}) {
      vistaPila.replaceChildren();
      const tope = pila.at(-1);

      [...pila].reverse().forEach((p, i) => {
        const carta = crear('div', 'sim-carta');
        carta.append(crear('span', '', url(p)), crear('small', '', i === 0 ? 'TOPE' : `#${pila.length - i}`));
        if (i === 0) carta.classList.add('tope');
        if (nuevas.includes(p.clave)) carta.classList.add('nueva');
        if (cambiadas.includes(p.clave)) carta.classList.add('cambiada');
        vistaPila.append(carta);
      });

      // Las que salieron se muestran un instante arriba, desvaneciéndose
      quitadas.reverse().forEach((p) => {
        const carta = crear('div', 'sim-carta');
        carta.append(crear('span', '', url(p)), crear('small', '', 'sale'));
        vistaPila.prepend(carta);
        requestAnimationFrame(() => requestAnimationFrame(() => quitarAnimado(carta)));
      });

      titulo.textContent = nombre(tope);
      atras.textContent = pila.length > 1 ? '‹' : '';
      contenido.replaceChildren(
        crear('span', 'grande', tope.ruta === '/productos/[id]' ? `#${tope.id}` : nombre(tope)),
        crear('span', 'ruta', url(tope)),
        crear('small', 'etiqueta', `${pila.length} en la pila`),
      );
      contenido.classList.remove('cambio', 'volver');
      void contenido.offsetWidth;
      contenido.classList.add(direccion === 'atras' ? 'volver' : 'cambio');
    }

    const acciones = {
      'push-producto'() {
        const nueva = pantalla('/productos/[id]', proximoId++);
        pila.push(nueva);
        return [`router.push('/productos/${nueva.id}')`, `Se apiló /productos/${nueva.id}. Ahora hay ${pila.length} pantallas.`, { nuevas: [nueva.clave] }];
      },
      'navigate-producto'() {
        const id = proximoId++;
        const tope = pila.at(-1);
        if (tope.ruta === '/productos/[id]') {
          tope.id = id;
          return [`router.navigate('/productos/${id}')`, `El destino es la misma pantalla que ya está visible: no se apila, solo cambia el id a ${id}.`, { cambiadas: [tope.clave] }];
        }
        const nueva = pantalla('/productos/[id]', id);
        pila.push(nueva);
        return [`router.navigate('/productos/${id}')`, `El tope era otra pantalla, así que navigate apiló /productos/${id}, igual que push.`, { nuevas: [nueva.clave] }];
      },
      'push-perfil'() {
        const nueva = pantalla('/perfil');
        pila.push(nueva);
        return [`router.push('/perfil')`, `Se apiló /perfil. Ahora hay ${pila.length} pantallas.`, { nuevas: [nueva.clave] }];
      },
      'replace-perfil'() {
        const vieja = pila.pop();
        const nueva = pantalla('/perfil');
        pila.push(nueva);
        return [`router.replace('/perfil')`, `${url(vieja)} fue reemplazada por /perfil. La pila sigue teniendo ${pila.length} pantallas.`, { nuevas: [nueva.clave], quitadas: [vieja] }];
      },
      back() {
        if (pila.length === 1) {
          return ['router.back()', 'No hay nada debajo: canGoBack() es false. En una app real, Android cerraría la app.', {}];
        }
        const vieja = pila.pop();
        return ['router.back()', `Pop: salió ${url(vieja)} y quedó visible ${url(pila.at(-1))}, que nunca se desmontó.`, { quitadas: [vieja], direccion: 'atras' }];
      },
      dismissto() {
        const indice = pila.findLastIndex((p) => p.ruta === '/productos');
        if (indice === -1) {
          const vieja = pila.pop();
          const nueva = pantalla('/productos');
          pila.push(nueva);
          return [`router.dismissTo('/productos')`, '/productos no estaba en la pila, así que reemplazó el tope.', { nuevas: [nueva.clave], quitadas: [vieja] }];
        }
        const quitadas = pila.slice(indice + 1);
        pila = pila.slice(0, indice + 1);
        return [`router.dismissTo('/productos')`, quitadas.length ? `Se desapilaron ${quitadas.length} pantallas hasta llegar a /productos.` : 'Ya estabas en /productos: no hay nada que sacar.', { quitadas, direccion: 'atras' }];
      },
      dismissall() {
        const quitadas = pila.slice(1);
        pila = pila.slice(0, 1);
        return ['router.dismissAll()', quitadas.length ? `Se vació la pila hasta la primera pantalla (salieron ${quitadas.length}).` : 'Ya estabas en la primera pantalla.', { quitadas, direccion: 'atras' }];
      },
    };

    raiz.addEventListener('click', (e) => {
      const accion = e.target.closest('[data-sim]')?.dataset.sim;
      if (!acciones[accion]) return;
      const [codigo, texto, cambios] = acciones[accion]();
      llamada.textContent = `› ${codigo}`;
      explicacion.textContent = texto;
      dibujar(cambios);
    });

    dibujar();
  }

  /* ---------------------------------------------------------------------
     TABS con pilas independientes
     --------------------------------------------------------------------- */
  function demoTabs(raiz) {
    const columnas = $('.demo-tabs', raiz);
    const consola = $('.consola', raiz);
    const tabs = [
      { id: 'inicio', nombre: 'Inicio', pila: ['/'], generar: (n) => `/pila/${n}` },
      { id: 'productos', nombre: 'Productos', pila: ['/productos', '/productos/3'], generar: (n) => `/productos/${n}` },
      { id: 'perfil', nombre: 'Perfil', pila: ['/perfil'], generar: (n) => `/perfil/pedido-${n}` },
    ];
    let activa = 'productos';
    let contador = 4;
    let recienAgregada = null;

    function dibujar() {
      columnas.replaceChildren();
      tabs.forEach((tab) => {
        const col = crear('div', 'tab-col');
        if (tab.id === activa) col.classList.add('activa');
        const boton = crear('button', '', tab.nombre);
        boton.setAttribute('aria-pressed', String(tab.id === activa));
        boton.addEventListener('click', () => {
          activa = tab.id;
          consola.textContent = `› Tab activa: ${tab.nombre}. Su pila tiene ${tab.pila.length} pantalla(s) y quedó tal cual la dejaste.`;
          dibujar();
        });
        const pila = crear('div', 'tab-pila');
        tab.pila.forEach((ruta, i) => {
          const carta = crear('div', 'sim-carta', ruta);
          if (i === tab.pila.length - 1 && tab.id === activa) carta.classList.add('tope');
          if (recienAgregada === `${tab.id}:${i}`) carta.classList.add('nueva');
          pila.append(carta);
        });
        col.append(boton, pila);
        columnas.append(col);
      });
      recienAgregada = null;
    }

    raiz.addEventListener('click', (e) => {
      const accion = e.target.closest('[data-tabs]')?.dataset.tabs;
      if (!accion) return;
      const tab = tabs.find((t) => t.id === activa);

      if (accion === 'push') {
        if (tab.pila.length >= 5) {
          consola.textContent = '› Para la demo, máximo 5 pantallas por tab.';
          return;
        }
        const ruta = tab.generar(contador++);
        tab.pila.push(ruta);
        recienAgregada = `${tab.id}:${tab.pila.length - 1}`;
        consola.textContent = `› push('${ruta}') en la tab ${tab.nombre}. Las otras tabs no cambian.`;
      }

      if (accion === 'back') {
        if (tab.pila.length === 1) {
          consola.textContent = `› La pila de ${tab.nombre} ya está en su primera pantalla.`;
          return;
        }
        const salio = tab.pila.pop();
        consola.textContent = `› back() en ${tab.nombre}: salió ${salio}.`;
      }
      dibujar();
    });

    dibujar();
  }

  /* ---------------------------------------------------------------------
     PROBADOR DE RUTAS (un mini router)
     --------------------------------------------------------------------- */
  const RUTAS = [
    { archivo: '(tabs)/index.tsx', patron: '/' },
    { archivo: '(tabs)/perfil.tsx', patron: '/perfil' },
    { archivo: '(tabs)/productos/index.tsx', patron: '/productos' },
    { archivo: '(tabs)/productos/[id].tsx', patron: '/productos/[id]' },
    { archivo: 'pila/[nivel].tsx', patron: '/pila/[nivel]' },
    { archivo: 'docs/[...slug].tsx', patron: '/docs/[...slug]' },
    { archivo: 'buscar.tsx', patron: '/buscar' },
    { archivo: 'estructuras.tsx', patron: '/estructuras' },
    { archivo: 'modal.tsx', patron: '/modal' },
    { archivo: 'privado/index.tsx', patron: '/privado' },
    { archivo: 'privado/ajustes.tsx', patron: '/privado/ajustes' },
  ];

  const segmentos = (texto) => texto.split('/').filter(Boolean);

  function coincidir(url) {
    const [camino, query = ''] = url.trim().split('?');
    const partes = segmentos(camino).map((p) => decodeURIComponent(p));
    let mejor = null;

    for (const ruta of RUTAS) {
      const patron = segmentos(ruta.patron);
      const params = {};
      let puntaje = 0;
      let ok = true;

      for (let i = 0; i < patron.length; i++) {
        const seg = patron[i];
        const catchAll = seg.match(/^\[\.\.\.(\w+)\]$/);
        const dinamico = seg.match(/^\[(\w+)\]$/);

        if (catchAll) {
          const resto = partes.slice(i);
          if (!resto.length) ok = false;
          params[catchAll[1]] = resto;
          puntaje += 1;
          i = partes.length;
          break;
        }
        if (i >= partes.length) { ok = false; break; }
        if (dinamico) { params[dinamico[1]] = partes[i]; puntaje += 2; }
        else if (seg === partes[i]) puntaje += 3;
        else { ok = false; break; }
      }

      const usaCatchAll = patron.some((s) => s.startsWith('[...'));
      if (!usaCatchAll && patron.length !== partes.length) ok = false;
      if (ok && (!mejor || puntaje > mejor.puntaje)) mejor = { ruta, params, puntaje };
    }

    const busqueda = Object.fromEntries(new URLSearchParams(query));
    return { mejor, busqueda };
  }

  function demoProbador(raiz) {
    const input = $('input', raiz);
    const resultado = $('.probador-resultado', raiz);

    const fila = (etiqueta, valor) => {
      const el = crear('div', 'probador-fila');
      el.append(crear('span', 'etiqueta', etiqueta), crear('span', '', valor));
      return el;
    };

    function probar() {
      let url = input.value.trim() || '/';
      if (!url.startsWith('/')) url = '/' + url;
      const { mejor, busqueda } = coincidir(url);

      resultado.replaceChildren();
      resultado.classList.toggle('sin-coincidencia', !mejor);

      if (!mejor) {
        resultado.append(
          fila('archivo', '+not-found.tsx'),
          fila('por qué', 'Ningún archivo de src/app coincide con esa URL.'),
        );
        return;
      }
      const params = { ...mejor.params, ...busqueda };
      resultado.append(
        fila('archivo', `src/app/${mejor.ruta.archivo}`),
        fila('patrón', mejor.ruta.patron),
        fila('params', JSON.stringify(params)),
      );
    }

    input.addEventListener('input', probar);
    input.addEventListener('keydown', (e) => e.stopPropagation());
    $$('.chip', raiz).forEach((chip) =>
      chip.addEventListener('click', () => {
        input.value = chip.textContent;
        probar();
      }),
    );
    probar();
  }

  /* ---------------------------------------------------------------------
     RUTAS PROTEGIDAS
     --------------------------------------------------------------------- */
  function demoProtegidas(raiz) {
    const interruptor = $('input[type="checkbox"]', raiz);
    const valor = $('.valor-guard', raiz);

    const actualizar = () => {
      const conSesion = interruptor.checked;
      valor.textContent = String(conSesion);
      $$('li[data-guard]', raiz).forEach((li) => {
        const visible =
          li.dataset.guard === 'siempre' ||
          (li.dataset.guard === 'conSesion' && conSesion) ||
          (li.dataset.guard === 'sinSesion' && !conSesion);
        li.classList.toggle('fuera', !visible);
      });
    };

    interruptor.addEventListener('change', actualizar);
    actualizar();
  }

  /* ---------------------------------------------------------------------
     QUIZ
     --------------------------------------------------------------------- */
  function demoQuiz(raiz) {
    const slide = raiz.closest('.slide');
    const marcador = $('[data-puntaje]', slide);
    const preguntas = $$('.pregunta', raiz);
    let puntos = 0;
    let respondidas = 0;

    preguntas.forEach((pregunta) => {
      const correcta = Number(pregunta.dataset.correcta);
      const botones = $$('.btn', pregunta);

      botones.forEach((boton, indice) => {
        boton.addEventListener('click', () => {
          botones.forEach((b) => (b.disabled = true));
          botones[correcta].classList.add('correcta');
          if (indice === correcta) puntos++;
          else boton.classList.add('incorrecta');
          respondidas++;
          $('.porque', pregunta).hidden = false;
          marcador.textContent = `${puntos} / ${preguntas.length}`;
          if (respondidas === preguntas.length) {
            marcador.textContent += puntos === preguntas.length ? ' · ¡perfecto!' : ' · ¡bien!';
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Botones "ver respuesta"
     --------------------------------------------------------------------- */
  function activarRevelar() {
    $$('[data-revelar]').forEach((boton) => {
      boton.addEventListener('click', () => {
        const objetivo = document.getElementById(boton.dataset.revelar);
        objetivo.hidden = !objetivo.hidden;
        boton.textContent = objetivo.hidden ? 'Ver respuestas' : 'Ocultar respuestas';
      });
    });
  }

  const DEMOS = {
    pila: demoPila,
    cola: demoCola,
    explorador: demoExplorador,
    stack: demoStack,
    tabs: demoTabs,
    probador: demoProbador,
    protegidas: demoProtegidas,
    quiz: demoQuiz,
  };

  window.iniciarDemos = function () {
    $$('[data-demo]').forEach((raiz) => DEMOS[raiz.dataset.demo]?.(raiz));
    activarRevelar();
  };
})();
