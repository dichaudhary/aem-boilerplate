/*
 * carousel.js — shared slick-equivalent carousel (no library), ported from the gated
 * prototype (stardust/prototypes/js/carousel.js). Chrome CSS lives in styles/styles.css.
 *
 * Expected DOM (blocks build it, moving authored nodes into the slides):
 *   <div class="carousel" [data-start] [data-scroll] [data-autoplay] [data-adaptive]
 *        [data-mobile-only] [data-arrows-desktop]>
 *     <button class="carousel-arrow carousel-arrow-prev" type="button" aria-label="Previous">
 *     <div class="carousel-viewport"><div class="carousel-track">
 *       <div class="carousel-slide">…</div>…
 *     </div></div>
 *     <button class="carousel-arrow carousel-arrow-next" type="button" aria-label="Next">
 *     <ul class="carousel-dots"><li><button type="button"></button></li>…</ul>
 *   </div>
 *
 * Behaviour (source parity): non-infinite (arrows disable at the ends); data-start = initial
 * slide; data-scroll = slides per arrow step at desktop; data-autoplay = ms, ping-pongs between
 * the ends and stops on interaction; data-adaptive = viewport takes the current slide height;
 * data-mobile-only = carousel only below 1024px; data-arrows-desktop = arrows removed below
 * 1024px. options.onVisible(slide) runs for every slide that enters the viewport (lazy media).
 */

const MOBILE = window.matchMedia('(max-width: 1023px)');

/**
 * Initialises one carousel.
 * @param {HTMLElement} root the .carousel element
 * @param {{ onVisible?: (slide: HTMLElement) => void }} [options]
 * @returns {{ go: Function, refresh: Function, stop: Function, index: number }} controller
 */
export default function createCarousel(root, options = {}) {
  const track = root.querySelector('.carousel-track');
  const viewport = root.querySelector('.carousel-viewport');
  let slides = [...track.children];
  const prev = root.querySelector(':scope > .carousel-arrow-prev');
  const next = root.querySelector(':scope > .carousel-arrow-next');
  const dots = [...root.querySelectorAll(':scope > .carousel-dots li')];
  const mobileOnly = root.hasAttribute('data-mobile-only');
  const arrowsDesktopOnly = root.hasAttribute('data-arrows-desktop');
  const adaptive = root.hasAttribute('data-adaptive');
  const autoplayMs = Number(root.dataset.autoplay || 0);
  const { onVisible } = options;
  let index = Number(root.dataset.start || 0);
  let dir = 1;
  let timer = null;

  const perView = () => {
    const s = slides[0];
    if (!s) return { step: 0, n: 1 };
    const cs = getComputedStyle(s);
    const margins = parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
    const step = s.getBoundingClientRect().width + margins;
    const vcs = getComputedStyle(viewport);
    const pad = parseFloat(vcs.paddingLeft) + parseFloat(vcs.paddingRight);
    const inner = viewport.clientWidth - pad;
    return { step, n: step ? Math.max(1, Math.round(inner / step)) : 1 };
  };

  function placeArrows() {
    if (!arrowsDesktopOnly) return;
    if (MOBILE.matches) {
      prev?.remove();
      next?.remove();
    } else if (prev && !prev.isConnected) {
      root.prepend(prev);
      viewport.after(next);
    }
  }

  function revealVisible(step) {
    if (!onVisible) return;
    const vr = viewport.getBoundingClientRect();
    slides.forEach((s) => {
      const left = vr.left + s.offsetLeft - index * step;
      if (left < vr.right && left + s.offsetWidth > vr.left) onVisible(s);
    });
  }

  function render(animate) {
    placeArrows();
    if (mobileOnly && !MOBILE.matches) {
      track.style.transform = '';
      revealVisible(0);
      return;
    }
    const { step, n } = perView();
    const max = Math.max(0, slides.length - n);
    index = Math.min(Math.max(index, 0), max);
    if (!animate) track.style.transition = 'none';
    track.style.transform = `translate3d(${-index * step}px, 0, 0)`;
    if (!animate) {
      track.getBoundingClientRect();
      track.style.transition = '';
    }
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index >= max;
    slides.forEach((s, i) => s.classList.toggle('is-active', i >= index && i < index + n));
    const page = Math.min(dots.length - 1, index);
    dots.forEach((d, i) => d.classList.toggle('is-active', i === page));
    if (adaptive && slides[index]) viewport.style.height = `${slides[index].offsetHeight}px`;
    revealVisible(step);
  }

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  if (autoplayMs) {
    timer = setInterval(() => {
      const { n } = perView();
      const max = Math.max(0, slides.length - n);
      if (index + dir > max || index + dir < 0) dir = -dir;
      index += dir;
      render(true);
    }, autoplayMs);
  }

  const by = () => (MOBILE.matches ? 1 : Number(root.dataset.scroll || 1));
  prev?.addEventListener('click', () => {
    stop();
    index -= by();
    render(true);
  });
  next?.addEventListener('click', () => {
    stop();
    index += by();
    render(true);
  });
  dots.forEach((d, i) => d.querySelector('button')?.addEventListener('click', () => {
    stop();
    index = i;
    render(true);
  }));

  let x0 = null;
  viewport.addEventListener('pointerdown', (e) => {
    x0 = e.clientX;
  });
  viewport.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) {
      stop();
      index += dx < 0 ? 1 : -1;
      render(true);
    }
  });

  render(false);
  window.addEventListener('resize', () => render(false));
  if (adaptive) {
    document.fonts?.ready.then(() => render(false));
    window.addEventListener('load', () => render(false));
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => {
        if (slides[index]) viewport.style.height = `${slides[index].offsetHeight}px`;
      });
      slides.forEach((s) => ro.observe(s));
    }
  }

  const controller = {
    go: (i) => {
      index = i;
      render(true);
    },
    refresh: () => {
      slides = [...track.children];
      index = 0;
      render(false);
    },
    stop,
    get index() {
      return index;
    },
    get slides() {
      return slides;
    },
  };
  root.carousel = controller;
  return controller;
}
