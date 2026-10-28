/**
 * popular — "Most loved" product carousel (prototype section.popular,
 * stardust/eds-schema/index.json). Decode tier: reconstructive (repeat group: one row per product).
 *
 * Section head: the default content before the block (h2 + lede) is reabsorbed (EW8).
 * Authoring: one row per product — cell 1: product image; cell 2: the product name as a link
 * to the product page (the image becomes the link; the name's anchor is unwrapped, EW6),
 * then the description paragraph(s).
 * Motion (capture-state promise): autoplays every 3000 ms from slide 1, non-looping.
 */

const DESKTOP = window.matchMedia('(width >= 1024px)');
const AUTOPLAY_MS = 3000;

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

function buildItem(row) {
  const picture = row.querySelector('picture');
  const link = row.querySelector('a[href]');
  const paras = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture') && p.textContent.trim());
  const name = (link && link.closest('p')) || paras[0];
  const details = paras.filter((p) => p !== name);

  const slide = el('div', 'popular-slide');
  const item = el('div', 'popular-item');
  const image = el('div', 'popular-image');
  if (picture) {
    const target = link ? el('a', '', { href: link.href }) : el('div');
    target.append(picture);
    image.append(target);
    const img = picture.querySelector('img');
    img.loading = 'eager'; // the source loads both products up front (layout height)
    img.classList.add('fade');
    if (img.complete && img.naturalWidth) img.classList.add('loaded');
    else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
  }
  const desc = el('div', 'popular-desc');
  if (name) {
    desc.append(wrapNodes('popular-name', [name]));
    if (link && name.contains(link)) link.replaceWith(...link.childNodes);
  }
  if (details.length) desc.append(wrapNodes('popular-details', details));
  item.append(image, desc);
  slide.append(item);
  return slide;
}

export default function decorate(block) {
  if (block.querySelector('.popular-inner')) return; // EW9: re-entrant
  const head = takeSectionHead(block);
  const inner = el('div', 'popular-inner');
  const heading = head.find((n) => /^H[1-6]$/.test(n.tagName));
  if (heading) inner.append(wrapNodes('section-title', [heading]));
  const lede = head.filter((n) => n !== heading);
  if (lede.length) inner.append(wrapNodes('section-sub', lede));

  const rows = [...block.children].filter((row) => row.querySelector('picture, p'));
  const carousel = buildCarousel(rows.map(buildItem), { arrows: true, dots: true });
  inner.append(carousel);
  block.replaceChildren(inner);
  initCarousel(carousel, { start: 0, autoplay: AUTOPLAY_MS });
}
