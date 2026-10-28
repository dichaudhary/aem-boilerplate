// Carousels (arrows, dots, swipe-free paging) and recipe tabs for the home prototype.
function initCarousel(root) {
  const track = root.querySelector('.carousel__track');
  const viewport = root.querySelector('.carousel__viewport');
  const prev = root.querySelector(':scope > .carousel__arrow--prev');
  const next = root.querySelector(':scope > .carousel__arrow--next');
  const dots = [...root.querySelectorAll(':scope > .carousel__dots button')];
  const slides = [...track.children];
  let index = Number(root.dataset.start || 0);

  const perView = () => {
    const w = slides[0]?.getBoundingClientRect().width || 1;
    return Math.max(1, Math.round(viewport.clientWidth / w));
  };
  const lastIndex = () => Math.max(0, slides.length - (dots.length ? 1 : perView()));

  function render() {
    if (root.dataset.mobileOnly !== undefined && window.matchMedia('(min-width: 1024px)').matches) {
      track.style.transform = '';
      viewport.style.height = '';
      return;
    }
    const w = slides[0]?.getBoundingClientRect().width || 0;
    track.style.transform = `translateX(${-index * w}px)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    if (prev) prev.disabled = index <= 0;
    if (next) next.disabled = index >= lastIndex();
    const w0 = slides[0]?.getBoundingClientRect().width || 1;
    const visible = slides.slice(index, index + Math.max(1, Math.ceil(viewport.clientWidth / w0 - 0.01)));
    visible.forEach((s) => s.querySelectorAll('.lazy-img[data-src]').forEach((ph) => {
      const img = document.createElement('img');
      img.src = ph.dataset.src; img.alt = ph.dataset.alt || ''; img.width = 300; img.height = 300;
      img.className = 'fade';
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      ph.replaceWith(img);
    }));
    if (root.dataset.adaptive !== undefined) {
      const inView = visible;
      viewport.style.height = `${Math.max(...inView.map((s) => s.offsetHeight))}px`;
    }
    dots.forEach((d, i) => (i === index ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
  }
  const go = (i) => { index = Math.min(Math.max(i, 0), lastIndex()); render(); };

  prev?.addEventListener('click', () => go(index - 1));
  next?.addEventListener('click', () => go(index + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  window.addEventListener('resize', render);
  if (root.dataset.adaptive !== undefined) new ResizeObserver(() => render()).observe(track);
  root.carouselReset = () => go(0);
  if (root.dataset.autoplay) {
    // Source rotates once on a timer and stops at the last slide (non-looping).
    const timer = setInterval(() => { if (index >= lastIndex()) clearInterval(timer); else go(index + 1); }, Number(root.dataset.autoplay));
    [prev, next, ...dots].forEach((c) => c?.addEventListener('click', () => clearInterval(timer)));
  }
  track.style.transition = 'none';
  render();
  requestAnimationFrame(() => { track.style.transition = ''; });
}

document.querySelectorAll('[data-carousel]').forEach(initCarousel);

const tabs = [...document.querySelectorAll('.recipes__tab')];
const panels = [...document.querySelectorAll('.recipes__panel')];
tabs.forEach((tab, i) => tab.addEventListener('click', () => {
  tabs.forEach((t, j) => t.setAttribute('aria-selected', String(i === j)));
  panels.forEach((p, j) => { p.hidden = i !== j; });
  panels[i].carouselReset?.();
}));

document.querySelectorAll('button[data-href]').forEach((b) => b.addEventListener('click', () => { window.location.href = b.dataset.href; }));

// Source fades lazy images in (opacity, 300ms) once they load.
document.querySelectorAll('img.fade').forEach((img) => {
  if (img.complete && img.naturalWidth) img.classList.add('loaded');
  else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
});
