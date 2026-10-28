/**
 * vision — "Our vision" video cards (prototype section.vision, stardust/eds-schema/index.json).
 * Decode tier: reconstructive (repeat group: one row per card).
 *
 * Section head: the default content before the block (h2) is reabsorbed (EW8).
 * Authoring: one row per card — a paragraph holding the video link (its label is the player's
 * title), then the card title paragraph and the description paragraph(s).
 * The first card is the highlighted one (spans both grid rows on desktop).
 * Mobile: a dot-paged carousel whose viewport takes the height of the card in view (adaptive).
 * @ew-exempt <p> video link (embed source) — rendered as the card's YouTube player, never as text
 */

const DESKTOP = window.matchMedia('(width >= 1024px)');
const EMBED = /youtube\.com|youtu\.be|vimeo\.com|\/embed\//i;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function wrapNodes(className, nodes) {
  const w = el('div', className);
  w.append(...nodes);
  return w;
}

/** the section head authored as default content right before the block (EW8) */
function takeSectionHead(block) {
  const prev = block.parentElement?.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return [];
  const nodes = [...prev.children];
  prev.remove();
  return nodes;
}

// ── carousel (the prototype's index.js initCarousel; copied per block — no shared module) ──
function buildCarousel(slides, { arrows = true, dots = false } = {}) {
  const root = el('div', 'carousel');
  const viewport = el('div', 'carousel-viewport');
  const track = el('div', 'carousel-track');
  slides.forEach((s) => s.classList.add('carousel-slide'));
  track.append(...slides);
  viewport.append(track);
  root.append(viewport);
  if (arrows) {
    root.append(
      el('button', 'carousel-arrow carousel-arrow-prev', { type: 'button', 'aria-label': 'Previous' }),
      el('button', 'carousel-arrow carousel-arrow-next', { type: 'button', 'aria-label': 'Next' }),
    );
  }
  if (dots) {
    const list = el('ul', 'carousel-dots');
    slides.forEach((s, i) => {
      const li = el('li');
      li.append(el('button', '', { type: 'button', 'aria-label': `${i + 1} of ${slides.length}` }));
      list.append(li);
    });
    root.append(list);
  }
  return root;
}

function initCarousel(root, opts = {}) {
  const track = root.querySelector('.carousel-track');
  const viewport = root.querySelector('.carousel-viewport');
  const prev = root.querySelector('.carousel-arrow-prev');
  const next = root.querySelector('.carousel-arrow-next');
  const dots = [...root.querySelectorAll('.carousel-dots button')];
  const slides = [...track.children];
  let index = opts.start || 0;

  const slideWidth = () => slides[0]?.getBoundingClientRect().width || 0;
  const perView = () => Math.max(1, Math.round(viewport.clientWidth / (slideWidth() || 1)));
  const lastIndex = () => Math.max(0, slides.length - (dots.length ? 1 : perView()));

  function render() {
    if (opts.mobileOnly && DESKTOP.matches) {
      track.style.transform = '';
      viewport.style.height = '';
      return;
    }
    const w = slideWidth();
    track.style.transform = `translateX(${-index * w}px)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    if (prev) prev.disabled = index <= 0;
    if (next) next.disabled = index >= lastIndex();
    const count = Math.max(1, Math.ceil(viewport.clientWidth / (w || 1) - 0.01));
    const visible = slides.slice(index, index + count);
    if (opts.onVisible) opts.onVisible(visible);
    if (opts.adaptive) {
      viewport.style.height = `${Math.max(...visible.map((s) => s.offsetHeight))}px`;
    }
    dots.forEach((d, i) => {
      if (i === index) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
  }

  const go = (i) => {
    index = Math.min(Math.max(i, 0), lastIndex());
    render();
  };

  prev?.addEventListener('click', () => go(index - 1));
  next?.addEventListener('click', () => go(index + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  window.addEventListener('resize', render);
  if (opts.adaptive) new ResizeObserver(() => render()).observe(track);
  root.carouselReset = () => go(0);
  if (opts.autoplay) {
    // the source rotates once on a timer and stops at the last slide (non-looping)
    const timer = setInterval(() => {
      if (index >= lastIndex()) clearInterval(timer);
      else go(index + 1);
    }, opts.autoplay);
    [prev, next, ...dots].forEach((c) => c?.addEventListener('click', () => clearInterval(timer)));
  }
  track.style.transition = 'none';
  render();
  requestAnimationFrame(() => {
    track.style.transition = '';
  });
}

function buildCard(row, i) {
  const video = [...row.querySelectorAll('a[href]')].find((a) => EMBED.test(a.href));
  const paras = [...row.querySelectorAll('p')]
    .filter((p) => (!video || !p.contains(video)) && p.textContent.trim());
  const [title, ...desc] = paras;

  const slide = el('div', `vision-slide${i === 0 ? ' vision-slide-lead' : ''}`);
  const card = el('div', `vision-card vision-card-${i === 0 ? 'highlighted' : 'default'} vision-card-${i}`);
  const media = el('div', 'vision-card-media');
  if (video) {
    const frame = el('iframe', '', {
      title: video.textContent.trim(),
      loading: 'lazy',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      allowfullscreen: '',
    });
    frame.src = video.href;
    media.append(frame);
    (video.closest('p') || video).remove();
  }
  card.append(media);
  const info = el('div', 'vision-card-info');
  if (title) info.append(wrapNodes('vision-card-title', [title]));
  if (desc.length) info.append(wrapNodes('vision-card-desc', desc));
  card.append(info);
  slide.append(card);
  return slide;
}

export default function decorate(block) {
  if (block.querySelector('.vision-inner')) return; // EW9: re-entrant
  const head = takeSectionHead(block);
  const inner = el('div', 'vision-inner');
  const heading = head.find((n) => /^H[1-6]$/.test(n.tagName));
  if (heading) inner.append(wrapNodes('section-title vision-title', [heading]));
  const rest = head.filter((n) => n !== heading);
  if (rest.length) inner.append(wrapNodes('section-sub', rest));

  const rows = [...block.children].filter((row) => row.textContent.trim());
  const carousel = buildCarousel(rows.map(buildCard), { arrows: false, dots: true });
  carousel.classList.add('vision-grid');
  inner.append(carousel);
  block.replaceChildren(inner);
  initCarousel(carousel, { mobileOnly: true, adaptive: true });
}
