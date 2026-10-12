/* carousel.js — minimal slick-equivalent carousel (no library).
   Initial state = the live initial state (data-start). Non-infinite: prev/next disable at the
   ends, like the source (slick infinite:false). data-mobile-only: carousel only below 1024px
   (Our vision is a static grid at desktop on the source). */
(() => {
  const MOBILE = window.matchMedia('(max-width: 1023px)');

  function setup(root) {
    const track = root.querySelector('.carousel__track');
    const viewport = root.querySelector('.carousel__viewport');
    let slides = [...track.children];
    const prev = root.querySelector(':scope > .carousel__arrow--prev');
    const next = root.querySelector(':scope > .carousel__arrow--next');
    const dots = [...root.querySelectorAll(':scope > .carousel__dots li')];
    const mobileOnly = root.hasAttribute('data-mobile-only');
    let index = Number(root.dataset.start || 0);

    const perView = () => {
      const s = slides[0];
      const cs = getComputedStyle(s);
      const step = s.getBoundingClientRect().width + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
      const vcs = getComputedStyle(viewport);
      const inner = viewport.clientWidth - parseFloat(vcs.paddingLeft) - parseFloat(vcs.paddingRight);
      return { step, n: Math.max(1, Math.round(inner / step)) };
    };

    // the source's responsive slick settings drop the arrows from the DOM below 1024px on some carousels
    const arrowsDesktopOnly = root.hasAttribute('data-arrows-desktop');
    function placeArrows() {
      if (!arrowsDesktopOnly) return;
      if (MOBILE.matches) { prev?.remove(); next?.remove(); } else if (prev && !prev.isConnected) { root.prepend(prev); viewport.after(next); }
    }

    function render(animate) {
      placeArrows();
      if (mobileOnly && !MOBILE.matches) { track.style.transform = ''; return; }
      const { step, n } = perView();
      const max = Math.max(0, slides.length - n);
      index = Math.min(Math.max(index, 0), max);
      if (!animate) track.style.transition = 'none';
      track.style.transform = `translate3d(${-index * step}px, 0, 0)`;
      if (!animate) { void track.offsetWidth; track.style.transition = ''; }
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index >= max;
      slides.forEach((s, i) => s.classList.toggle('is-active', i >= index && i < index + n));
      const page = Math.min(dots.length - 1, index);
      dots.forEach((d, i) => d.classList.toggle('is-active', i === page));
      // slick adaptiveHeight: the list takes the current slide's height
      if (adaptive) viewport.style.height = `${slides[index].offsetHeight}px`;
      // the source lazy-loads card images only for slides that are on screen
      const vr = viewport.getBoundingClientRect();
      slides.forEach((s, i) => {
        const left = vr.left + s.offsetLeft - index * step;
        if (left < vr.right && left + s.offsetWidth > vr.left) lazy(s);
      });
    }

    function lazy(slide) {
      slide.querySelectorAll('[data-lazy-src]').forEach((box) => {
        const img = document.createElement('img');
        img.className = 'recipe-card__img';
        img.alt = box.dataset.lazyAlt || '';
        img.width = 300; img.height = 300;
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        img.src = box.dataset.lazySrc;
        if (box.dataset.lazySrcM) {
          const pic = document.createElement('picture');
          const src = document.createElement('source');
          src.srcset = box.dataset.lazySrcM; src.media = '(max-width: 1023px)';
          pic.append(src, img); box.append(pic);
        } else box.append(img);
        box.removeAttribute('data-lazy-src');
      });
    }

    const adaptive = root.hasAttribute('data-adaptive');
    // slick autoplay with infinite:false ping-pongs between the ends (source: Most loved,
    // data-auto-play-speed-in-ms=3000); an arrow/dot interaction stops it
    const autoplayMs = Number(root.dataset.autoplay || 0);
    let dir = 1; let timer = null;
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    if (autoplayMs) {
      timer = setInterval(() => {
        const { n } = perView(); const max = Math.max(0, slides.length - n);
        if (index + dir > max || index + dir < 0) dir = -dir;
        index += dir; render(true);
      }, autoplayMs);
    }

    // slidesToScroll (source: recipes scroll 3 at a time at desktop)
    const by = () => (MOBILE.matches ? 1 : Number(root.dataset.scroll || 1));
    prev?.addEventListener('click', () => { stop(); index -= by(); render(true); });
    next?.addEventListener('click', () => { stop(); index += by(); render(true); });
    dots.forEach((d, i) => d.querySelector('button').addEventListener('click', () => { stop(); index = i; render(true); }));

    // touch / drag swipe (slick draggable)
    let x0 = null;
    viewport.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    viewport.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { index += dx < 0 ? 1 : -1; render(true); }
    });

    render(false);
    window.addEventListener('resize', () => render(false));
    // adaptive height depends on webfont metrics and image sizes: re-measure once they settle
    if (adaptive) {
      document.fonts?.ready.then(() => render(false));
      window.addEventListener('load', () => render(false));
      if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(() => { viewport.style.height = `${slides[index].offsetHeight}px`; });
        slides.forEach((s) => ro.observe(s));
      }
    }
    root.carousel = {
      go: (i) => { index = i; render(true); },
      get index() { return index; },
      get slides() { return slides; },
      refresh: () => { slides = [...track.children]; index = 0; render(false); },
    };
  }

  document.querySelectorAll('[data-carousel]').forEach(setup);
})();
