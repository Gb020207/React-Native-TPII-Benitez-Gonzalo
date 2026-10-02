/* =========================================================================
   Motor de la presentación: navegación, mapa de progreso, notas y tema.

   Teclado:  → / Espacio / PageDown  siguiente
             ← / PageUp              anterior
             Inicio / Fin            primera / última
             M  mapa completo   N  notas   T  tema   F  pantalla completa
   ========================================================================= */
(function () {
  const SECCIONES = {
    contexto: { nombre: 'Contexto', letra: 'C', resumen: 'Qué es navegar y qué resuelve Expo Router' },
    estructuras: { nombre: 'Pilas y colas', letra: 'P', resumen: 'LIFO, FIFO y dónde aparecen al navegar' },
    fundamentos: { nombre: 'Fundamentos', letra: 'F', resumen: 'Archivos, layouts, Link y router' },
    navegadores: { nombre: 'Navegadores', letra: 'N', resumen: 'Stack, Tabs, Drawer y anidación' },
    dinamicas: { nombre: 'Rutas dinámicas', letra: 'D', resumen: '[id], [...slug], query params y hooks' },
    acceso: { nombre: 'Acceso y errores', letra: 'A', resumen: 'Redirect, rutas protegidas, 404 y deep links' },
    taller: { nombre: 'Taller', letra: 'T', resumen: 'App de ejemplo, errores comunes y práctica' },
  };

  const $ = (sel) => document.querySelector(sel);
  const slides = [...document.querySelectorAll('.slide')];
  const mapa = $('#mapa');
  const contador = $('#contador');
  const panelNotas = $('#panel-notas');
  const contenidoNotas = $('#contenido-notas');
  const vistaGeneral = $('#vista-general');
  const btnNotas = $('#btn-notas');
  const btnMapa = $('#btn-mapa');

  let actual = 0;

  /* ---------- Guardado seguro en localStorage ---------- */
  const guardar = (clave, valor) => {
    try {
      localStorage.setItem(clave, valor);
    } catch {}
  };
  const leer = (clave) => {
    try {
      return localStorage.getItem(clave);
    } catch {
      return null;
    }
  };

  /* ---------- Preparar cada diapositiva ---------- */
  function prepararSlides() {
    slides.forEach((slide, i) => {
      const seccion = SECCIONES[slide.dataset.seccion];
      const lamina = slide.querySelector('.lamina');

      if (!slide.hasAttribute('data-sin-cartel')) {
        const cartel = document.createElement('header');
        cartel.className = 'cartel';
        cartel.innerHTML = `<span class="bullet" aria-hidden="true">${seccion.letra}</span><span class="estacion">${seccion.nombre} · estación ${i + 1}</span>`;
        lamina.prepend(cartel);
      }

      [...lamina.children].forEach((hijo, j) => hijo.style.setProperty('--i', j));
      slide.setAttribute('aria-roledescription', 'diapositiva');
      slide.setAttribute('aria-label', `${i + 1} de ${slides.length}: ${slide.dataset.titulo}`);
    });
  }

  /* ---------- Mapa de progreso (barra inferior) ---------- */
  function construirMapa() {
    slides.forEach((slide, i) => {
      const parada = document.createElement('button');
      parada.className = 'parada';
      parada.dataset.seccion = slide.dataset.seccion;
      parada.setAttribute('aria-label', `Ir a ${i + 1}: ${slide.dataset.titulo}`);
      const globo = document.createElement('span');
      globo.className = 'globo';
      globo.textContent = `${i + 1} · ${slide.dataset.titulo}`;
      parada.append(globo);
      parada.addEventListener('click', () => ir(i));
      mapa.append(parada);
    });
  }

  /* ---------- Agenda y mapa completo (agrupados por sección) ---------- */
  function agruparPorSeccion() {
    const grupos = [];
    slides.forEach((slide, i) => {
      const clave = slide.dataset.seccion;
      let grupo = grupos.find((g) => g.clave === clave);
      if (!grupo) grupos.push((grupo = { clave, slides: [] }));
      grupo.slides.push({ indice: i, titulo: slide.dataset.titulo });
    });
    return grupos;
  }

  function construirAgenda() {
    const agenda = $('#agenda');
    if (!agenda) return;
    agruparPorSeccion().forEach((grupo) => {
      const seccion = SECCIONES[grupo.clave];
      const li = document.createElement('li');
      const boton = document.createElement('button');
      boton.dataset.seccion = grupo.clave;
      boton.innerHTML = `
        <span class="bullet" aria-hidden="true">${seccion.letra}</span>
        <span class="agenda-nombre"><strong>${seccion.nombre}</strong><small>${seccion.resumen}</small></span>
        <span class="agenda-cant">${grupo.slides.length} est.</span>`;
      boton.addEventListener('click', () => ir(grupo.slides[0].indice));
      li.append(boton);
      agenda.append(li);
    });
  }

  function construirVistaGeneral() {
    const contenedor = $('#vg-lineas');
    agruparPorSeccion().forEach((grupo) => {
      const seccion = SECCIONES[grupo.clave];
      const linea = document.createElement('div');
      linea.className = 'vg-linea';
      linea.dataset.seccion = grupo.clave;
      linea.innerHTML = `<header><span class="bullet" aria-hidden="true">${seccion.letra}</span>${seccion.nombre}</header>`;
      grupo.slides.forEach(({ indice, titulo }) => {
        const boton = document.createElement('button');
        boton.textContent = `${indice + 1}. ${titulo}`;
        boton.dataset.indice = indice;
        boton.addEventListener('click', () => {
          ir(indice);
          alternarVistaGeneral(false);
        });
        linea.append(boton);
      });
      contenedor.append(linea);
    });
  }

  /* ---------- Navegación ---------- */
  function ir(indice, { actualizarHash = true } = {}) {
    indice = Math.max(0, Math.min(slides.length - 1, indice));
    actual = indice;

    slides.forEach((slide, i) => {
      slide.classList.toggle('activa', i === indice);
      slide.classList.toggle('antes', i < indice);
      slide.inert = i !== indice;
    });

    [...mapa.children].forEach((parada, i) => {
      parada.classList.toggle('actual', i === indice);
      parada.classList.toggle('visitada', i < indice);
      if (i === indice) parada.setAttribute('aria-current', 'step');
      else parada.removeAttribute('aria-current');
    });

    document.querySelectorAll('.vg-linea button').forEach((b) => {
      b.classList.toggle('actual', Number(b.dataset.indice) === indice);
    });

    contador.textContent = `${indice + 1} / ${slides.length}`;
    slides[indice].scrollTop = 0;

    const notas = slides[indice].querySelector('.notas');
    contenidoNotas.innerHTML = notas ? notas.innerHTML : '<p>Sin notas para esta diapositiva.</p>';

    document.title = `${slides[indice].dataset.titulo} · Línea Expo Router`;
    if (actualizarHash) history.replaceState(null, '', `#${indice + 1}`);
  }

  const siguiente = () => ir(actual + 1);
  const anterior = () => ir(actual - 1);

  /* ---------- Paneles ---------- */
  function alternarNotas(forzar) {
    const mostrar = forzar ?? panelNotas.hidden;
    panelNotas.hidden = !mostrar;
    btnNotas.setAttribute('aria-pressed', String(mostrar));
  }

  function alternarVistaGeneral(forzar) {
    const mostrar = forzar ?? vistaGeneral.hidden;
    vistaGeneral.hidden = !mostrar;
    btnMapa.setAttribute('aria-pressed', String(mostrar));
    if (mostrar) vistaGeneral.querySelector('button.actual')?.focus();
  }

  function alternarTema() {
    const oscuroAhora =
      document.documentElement.dataset.theme === 'dark' ||
      (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    const nuevo = oscuroAhora ? 'light' : 'dark';
    document.documentElement.dataset.theme = nuevo;
    guardar('linea-expo-router:tema', nuevo);
  }

  function pantallaCompleta() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }

  /* ---------- Eventos ---------- */
  function escucharEventos() {
    $('#btn-siguiente').addEventListener('click', siguiente);
    $('#btn-anterior').addEventListener('click', anterior);
    btnNotas.addEventListener('click', () => alternarNotas());
    btnMapa.addEventListener('click', () => alternarVistaGeneral());
    $('#btn-tema').addEventListener('click', alternarTema);
    $('#btn-completa').addEventListener('click', pantallaCompleta);

    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
      const tecla = e.key.toLowerCase();

      if (['arrowright', 'pagedown'].includes(tecla) || (tecla === ' ' && !e.target.matches('button'))) {
        e.preventDefault();
        siguiente();
      } else if (['arrowleft', 'pageup'].includes(tecla)) {
        e.preventDefault();
        anterior();
      } else if (tecla === 'home') {
        e.preventDefault();
        ir(0);
      } else if (tecla === 'end') {
        e.preventDefault();
        ir(slides.length - 1);
      } else if (tecla === 'n') {
        alternarNotas();
      } else if (tecla === 'm') {
        alternarVistaGeneral();
      } else if (tecla === 't') {
        alternarTema();
      } else if (tecla === 'f') {
        pantallaCompleta();
      } else if (tecla === 'escape') {
        alternarVistaGeneral(false);
        alternarNotas(false);
      }
    });

    // Deslizar con el dedo en celulares y tablets
    let inicioX = null;
    let inicioY = null;
    const deck = $('#deck');
    deck.addEventListener('touchstart', (e) => {
      inicioX = e.touches[0].clientX;
      inicioY = e.touches[0].clientY;
    }, { passive: true });
    deck.addEventListener('touchend', (e) => {
      if (inicioX === null) return;
      const dx = e.changedTouches[0].clientX - inicioX;
      const dy = e.changedTouches[0].clientY - inicioY;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5 && !e.target.closest('pre, .tabla-scroll, input')) {
        dx < 0 ? siguiente() : anterior();
      }
      inicioX = null;
    });

    window.addEventListener('hashchange', () => {
      const n = parseInt(location.hash.slice(1), 10);
      if (!Number.isNaN(n)) ir(n - 1, { actualizarHash: false });
    });
  }

  /* ---------- Arranque ---------- */
  const temaGuardado = leer('linea-expo-router:tema');
  if (temaGuardado === 'dark' || temaGuardado === 'light') {
    document.documentElement.dataset.theme = temaGuardado;
  }

  window.resaltarCodigo();
  prepararSlides();
  construirMapa();
  construirAgenda();
  construirVistaGeneral();
  window.iniciarDemos();
  escucharEventos();

  const desdeHash = parseInt(location.hash.slice(1), 10);
  ir(Number.isNaN(desdeHash) ? 0 : desdeHash - 1);
})();
