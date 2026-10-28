/**
 * community — "Our Community" card carousel (prototype section.community,
 * stardust/eds-schema/index.json). Decode tier: reconstructive (repeat group: one row per card).
 *
 * Section head: the default content before the block (h2 + lede) is reabsorbed (EW8).
 * Authoring: one row per card — cell 1: background image(s), first desktop, second (optional)
 * mobile; cell 2: card heading, description, CTA (<strong><a>; opens in a new tab like the source).
 */

const DESKTOP = window.matchMedia('(width >= 1024px)');

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

/** background art: first image desktop, second mobile (one image serves both) */
function buildBg(pictures, className) {
  const bg = el('div', className);
  if (pictures[0]) {
    bg.append(wrapNodes(pictures[1] ? 'bg-desktop' : 'bg-all', [pictures[0]]));
  }
  if (pictures[1]) bg.append(wrapNodes('bg-mobile', [pictures[1]]));
  return bg;
}

function buildCard(row) {
  const cells = [...row.children];
  const contentCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6, a')) || cells[cells.length - 1];
  const pictures = cells
    .filter((c) => c !== contentCell)
    .flatMap((c) => [...c.querySelectorAll('picture')]);
  const heading = contentCell.querySelector('h1, h2, h3, h4, h5, h6');
  const ctas = [...contentCell.querySelectorAll('p')].filter((p) => p.querySelector('a[href]'));
  const texts = [...contentCell.querySelectorAll('p')].filter((p) => !ctas.includes(p) && p.textContent.trim());

  const slide = el('div', 'community-slide');
  const card = el('div', 'community-card');
  card.append(buildBg(pictures, 'community-card-bg'));
  const content = el('div', 'community-card-content');
  if (heading) content.append(wrapNodes('community-card-title', [heading]));
  if (texts.length) content.append(wrapNodes('community-card-desc', texts));
  if (ctas.length) {
    ctas.forEach((p) => p.querySelectorAll('a[href]').forEach((a) => {
      a.target = '_blank';
      a.rel = 'noopener';
    }));
    content.append(wrapNodes('community-card-action', ctas));
  }
  card.append(content);
  slide.append(card);
  return slide;
}

export default function decorate(block) {
  if (block.querySelector('.community-inner')) return; // EW9: re-entrant
  const head = takeSectionHead(block);
  const inner = el('div', 'community-inner');
  const heading = head.find((n) => /^H[1-6]$/.test(n.tagName));
  if (heading) inner.append(wrapNodes('section-title', [heading]));
  const lede = head.filter((n) => n !== heading);
  if (lede.length) inner.append(wrapNodes('community-sub', lede));

  const rows = [...block.children].filter((row) => row.querySelector('picture, h1, h2, h3, h4, a'));
  const carousel = buildCarousel(rows.map(buildCard), { arrows: true, dots: true });
  carousel.classList.add('community-carousel');
  inner.append(carousel);
  block.replaceChildren(inner);
  initCarousel(carousel);
}
